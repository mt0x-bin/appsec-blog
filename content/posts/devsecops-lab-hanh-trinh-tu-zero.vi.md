---
title: "DevSecOps Lab — Hành trình dựng Kubernetes cluster từ zero trên AWS"
date: 2026-04-12
description: "Từ không biết gì về cloud đến multi-node K8s cluster. Hành trình đầy lỗi, đầy debug, nhưng học được rất nhiều."
categories: ["DevSecOps"]
tags: ["kubernetes", "aws", "terraform", "k3s", "devsecops"]
draft: false
---

Trong lộ trình AppSec mà tôi đang theo, giai đoạn 3 là **DevSecOps & SDLC** — tích hợp bảo mật vào quy trình phát triển phần mềm. Nghe thì hay, nhưng muốn học DevSecOps thực chiến thì phải có một cái lab để mà phá.

Vấn đề là: tôi chưa từng dựng Kubernetes cluster bao giờ.

Thế là bắt đầu.

---

## Chọn sân chơi

Tài liệu gốc tôi theo là **"DevSecOps Homelab – Complete Setup & Operations Guide"**, hướng dẫn chạy trên máy vật lý với Proxmox VE hoặc KVM. Tôi có con ThinkPad P52 64GB RAM — thừa sức chạy. Nhưng nghĩ lại thì dựng trên cloud có mấy cái lợi:

- Không phải lo hypervisor, driver, BIOS settings
- Học ở đâu cũng được — kể cả ở công ty qua SSH
- Gần với môi trường thực tế doanh nghiệp hơn

Ban đầu tôi thử đăng ký **Hetzner** vì rẻ nhất (~$4/tháng). Bị reject. Hetzner hay từ chối tài khoản từ Việt Nam — biết rồi nhưng vẫn thử, rồi vẫn bị từ chối :3.

Cuối cùng chọn **AWS** — đắt hơn một chút nhưng đăng ký dễ, và quan trọng nhất là phổ biến trong doanh nghiệp. Học AWS luôn cho tiện.

---

## Setup AWS — IAM, CLI, SSH

Bước đầu tiên: **không dùng root account**. Tạo IAM user `devsecops-admin` với AdministratorAccess, bật MFA cho cả root lẫn IAM. Nguyên tắc cơ bản nhưng nhiều người bỏ qua.

Cài AWS CLI trên Windows, cấu hình region `ap-southeast-1` (Singapore, gần Việt Nam nhất), test kết nối:

```powershell
aws sts get-caller-identity
# {
#     "UserId": "AIDASKRJJIGUIQ4YJGOJD",
#     "Account": "160074121640",
#     "Arn": "arn:aws:iam::160074121640:user/devsecops-admin"
# }
```

Tạo SSH key riêng cho lab:

```powershell
ssh-keygen -t ed25519 -C "devsecops-lab" -f C:\devsecops-lab\devsecops-key
```

Xong. Sân chơi đã sẵn sàng.

---

## Terraform — Tạo VM bằng code

Tôi không tạo VM bằng tay trên AWS Console. Dùng **Terraform** — viết file `.tf`, chạy `terraform apply`, VM lên. Chạy `terraform destroy`, VM biến mất. Không sợ quên tắt tốn tiền.

Một mẹo nhỏ: **AMI ID thay đổi theo thời gian**. Đừng hardcode. Query AMI mới nhất từ Canonical:

```powershell
aws ec2 describe-images --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
  --query "sort_by(Images, &CreationDate)[-1].ImageId" \
  --output text --region ap-southeast-1
```

Chạy `terraform apply` → EC2 instance Ubuntu 22.04, t3.medium, Singapore. SSH vào. Bắt đầu phần khó.

---

## kubeadm — Hành trình gian nan

Cài Kubernetes "đúng chuẩn" bằng kubeadm. Nghe đơn giản: cài containerd, cài kubeadm, chạy `kubeadm init`. Thực tế thì...

### Lỗi 1: Kernel settings reset sau reboot

Mỗi lần stop/start EC2, kernel settings bị reset → `kubeadm init` fail:

```
[ERROR FileContent--proc-sys-net-bridge-bridge-nf-call-iptables]: does not exist
[ERROR FileContent--proc-sys-net-ipv4-ip_forward]: contents are not set to 1
```

Lý do: tôi chỉ chạy `echo 1 > /proc/sys/net/ipv4/ip_forward` — lệnh này không persistent qua reboot. Phải lưu vào `/etc/sysctl.d/k8s.conf`. Bài học xương máu: **kernel settings chạy bằng lệnh thì chỉ tồn tại trong session hiện tại**.

### Lỗi 2: SSH bị chặn ở công ty

```
ssh: connect to host 54.254.223.162 port 22: Connection timed out
```

Firewall công ty chặn port 22. Fix: dùng **AWS CloudShell** — terminal chạy trong browser, nằm trong AWS network nên bypass được firewall.

### Lỗi 3: CrashLoopBackOff — cơn ác mộng thực sự

Đây là lỗi tôi debug lâu nhất. Sau khi `kubeadm init` thành công, cluster liên tục crash:

```
kube-apiserver            CrashLoopBackOff   13 restarts
kube-controller-manager   CrashLoopBackOff   14 restarts
kube-scheduler            CrashLoopBackOff   15 restarts
```

Tôi đã thử:
- Tăng leader election timeout cho scheduler → scheduler ổn, nhưng apiserver vẫn crash
- Tăng livenessprobe timeout cho apiserver → vẫn không đủ
- Upgrade instance t3.medium → t3.large (4GB → 8GB RAM) → vẫn crash
- Upgrade kubeadm 1.29 → 1.30 → vẫn crash

**Root cause:** etcd transaction timeout 10–28 giây → apiserver livenessprobe kill process trước khi hoàn thành → toàn bộ cluster crash theo vòng lặp. Trên cloud, disk I/O không ổn định như bare metal, etcd rất nhạy cảm với điều này.

Sau nhiều ngày debug, tôi quyết định bỏ kubeadm.

Nghe thì như thất bại. Nhưng thật ra quá trình troubleshoot này dạy tôi nhiều hơn bất kỳ tutorial nào — tôi hiểu được cách các component của Kubernetes giao tiếp với nhau, tại sao etcd quan trọng, livenessprobe hoạt động ra sao. Những thứ này không có trong sách.

---

## k3s — Ánh sáng cuối đường hầm

Reset sạch kubeadm, cài k3s bằng đúng 1 lệnh:

```bash
curl -sfL https://get.k3s.io | sh -
```

30 giây sau:

```bash
kubectl get nodes
# NAME               STATUS   ROLES           AGE   VERSION
# ip-172-31-47-131   Ready    control-plane   49s   v1.34.6+k3s1
```

Hoạt động ngay. Không crash. Không CrashLoopBackOff. k3s tự cài sẵn CoreDNS, Traefik, metrics-server — những thứ mà kubeadm bắt tôi cài thủ công từng cái một.

k3s là lightweight Kubernetes — nó vẫn là K8s thật, vẫn có đầy đủ API, chỉ là gọn hơn, nhẹ hơn, và **ổn định hơn rất nhiều trên cloud instance nhỏ**.

---

## Mở rộng: Multi-node cluster

Một node thì chưa gọi là cluster. Tôi thêm 2 worker nodes bằng Terraform, mỗi node là t3.small.

Cập nhật security group — mở thêm port cho k3s:
- **6443** — K8s API server
- **8472** — Flannel VXLAN (giao tiếp giữa các node)
- **10250** — kubelet API (cần cho `kubectl logs/exec`)

Join worker vào cluster:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://172.31.47.131:6443 \
  K3S_TOKEN=<TOKEN> sh -
```

Một mẹo quan trọng: **dùng private IP cho k3s join**, không dùng public IP. Private IP của EC2 cố định suốt vòng đời instance, trong khi public IP đổi mỗi lần stop/start.

Deploy nginx 3 replicas để test:

```bash
kubectl create deployment nginx --image=nginx --replicas=3
kubectl get pods -o wide
# nginx-66686b6766-d9sf4   1/1   Running   10.42.2.3    ip-172-31-15-101
# nginx-66686b6766-p8z25   1/1   Running   10.42.1.3    ip-172-31-12-29
# nginx-66686b6766-s7f8b   1/1   Running   10.42.0.20   ip-172-31-47-131
```

3 pods, 3 nodes khác nhau. Kubernetes scheduler tự động spread pods ra. Multi-node cluster hoạt động thực sự.

---

## Chi phí — rẻ hơn bạn nghĩ

Tôi chỉ học khoảng 3h/ngày, 20 ngày/tháng. Stop instance khi không dùng. Tổng chi phí:

| Hạng mục | Chi phí |
|---|---|
| t3.medium (control plane) | ~$2.8/tháng |
| EBS storage 8GB | ~$0.64/tháng |
| Elastic IP | Miễn phí khi instance đang chạy |
| **Tổng** | **~$3.5–5/tháng** |

Rẻ hơn một ly cà phê ở Starbucks mỗi tuần.

Mẹo phòng tránh quên tắt: set spending limit trong AWS Billing, hoặc dùng `terraform destroy` luôn khi học xong — `terraform apply` lại chỉ mất ~5 phút.

---

## Bài học rút ra

1. **Cloud phù hợp hơn on-prem cho người mới** — bớt lo phần cứng, tập trung vào thứ cần học
2. **k3s > kubeadm cho lab** — ổn định, nhẹ, nhanh, đủ để học đầy đủ K8s concepts
3. **Terraform là thiết yếu** — infrastructure as code, tạo/xóa bằng 1 lệnh
4. **Debug là học** — hành trình troubleshoot kubeadm dạy nhiều thứ hơn cài thành công ngay lần đầu
5. **Kernel settings phải persistent** — lưu vào config files, đừng chỉ chạy lệnh một lần
6. **Private IP là cố định, public IP thì không** — dùng private IP cho giao tiếp nội bộ
7. **Không dùng root account** — tạo IAM user riêng, bật MFA, nguyên tắc cơ bản nhưng quan trọng

---

## Tiếp theo

Cluster đã sẵn sàng. Giờ là lúc cài security stack lên: **Helm, ArgoCD, Vault, Falco, OPA Gatekeeper, Prometheus, Grafana**... Hành trình DevSecOps thực sự bắt đầu từ đây.

Nếu bạn cũng đang muốn dựng lab DevSecOps — đừng ngại bắt đầu. Không cần máy xịn, không cần nhiều tiền. Chỉ cần một tài khoản AWS và sự kiên nhẫn.
