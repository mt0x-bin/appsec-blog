---
title: "DevSecOps Lab — Building a Kubernetes Cluster from Zero on AWS"
date: 2026-04-12
description: "From knowing nothing about cloud to a multi-node K8s cluster. A journey full of errors, debugging, and hard-earned lessons."
categories: ["DevSecOps"]
tags: ["kubernetes", "aws", "terraform", "k3s", "devsecops"]
draft: false
---

In the AppSec roadmap I'm following, phase 3 is **DevSecOps & SDLC** — integrating security into the software development lifecycle. Sounds great on paper, but to actually learn DevSecOps hands-on, you need a lab to break things in.

Problem is: I had never built a Kubernetes cluster before.

So I just started.

---

## Choosing the Playground

The guide I followed was the **"DevSecOps Homelab – Complete Setup & Operations Guide"**, which runs on physical hardware with Proxmox VE or KVM. I have a ThinkPad P52 with 64GB RAM — more than enough. But I figured cloud would be better:

- No hypervisor setup, no driver headaches
- Can study from anywhere — even at the office via SSH
- Closer to real-world enterprise environments

I first tried signing up for **Hetzner** since it's the cheapest (~$4/month). Got rejected. Hetzner tends to decline accounts from Vietnam — I knew this but tried anyway, and still got rejected :3.

Ended up going with **AWS** — slightly more expensive, but easy to sign up, and it's the most widely used in enterprises. Might as well learn AWS along the way.

---

## AWS Setup — IAM, CLI, SSH

First rule: **don't use the root account**. Created an IAM user `devsecops-admin` with AdministratorAccess, enabled MFA on both root and IAM. Basic principle, but many people skip it.

Installed AWS CLI on Windows, configured region to `ap-southeast-1` (Singapore, closest to Vietnam), tested the connection:

```powershell
aws sts get-caller-identity
# {
#     "UserId": "AIDASKRJJIGUIQ4YJGOJD",
#     "Account": "160074121640",
#     "Arn": "arn:aws:iam::160074121640:user/devsecops-admin"
# }
```

Generated a dedicated SSH key for the lab:

```powershell
ssh-keygen -t ed25519 -C "devsecops-lab" -f C:\devsecops-lab\devsecops-key
```

Done. Playground ready.

---

## Terraform — Infrastructure as Code

I didn't create VMs manually through the AWS Console. Used **Terraform** — write a `.tf` file, run `terraform apply`, VM goes up. Run `terraform destroy`, VM gone. No worrying about forgetting to shut things down and racking up bills.

One small tip: **AMI IDs change over time**. Don't hardcode them. Query the latest from Canonical:

```powershell
aws ec2 describe-images --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
  --query "sort_by(Images, &CreationDate)[-1].ImageId" \
  --output text --region ap-southeast-1
```

Ran `terraform apply` → EC2 instance running Ubuntu 22.04, t3.medium, Singapore. SSH'd in. Now came the hard part.

---

## kubeadm — The Painful Journey

Installing Kubernetes "the proper way" with kubeadm. Sounds simple: install containerd, install kubeadm, run `kubeadm init`. In reality though...

### Error 1: Kernel settings reset after reboot

Every time I stopped/started the EC2 instance, kernel settings would reset → `kubeadm init` fails:

```
[ERROR FileContent--proc-sys-net-bridge-bridge-nf-call-iptables]: does not exist
[ERROR FileContent--proc-sys-net-ipv4-ip_forward]: contents are not set to 1
```

The reason: I only ran `echo 1 > /proc/sys/net/ipv4/ip_forward` — this doesn't persist across reboots. Had to save it to `/etc/sysctl.d/k8s.conf`. Hard lesson learned: **kernel settings set via command line only last for the current session**.

### Error 2: SSH blocked at the office

```
ssh: connect to host 54.254.223.162 port 22: Connection timed out
```

Office firewall blocking port 22. Fix: use **AWS CloudShell** — a browser-based terminal that runs inside AWS's network, bypassing the corporate firewall entirely.

### Error 3: CrashLoopBackOff — the real nightmare

This was the bug I spent the longest debugging. After `kubeadm init` succeeded, the cluster kept crashing in a loop:

```
kube-apiserver            CrashLoopBackOff   13 restarts
kube-controller-manager   CrashLoopBackOff   14 restarts
kube-scheduler            CrashLoopBackOff   15 restarts
```

Things I tried:
- Increased leader election timeout for scheduler → scheduler stabilized, but apiserver still crashed
- Increased livenessprobe timeout for apiserver → still not enough
- Upgraded instance from t3.medium → t3.large (4GB → 8GB RAM) → still crashed
- Upgraded kubeadm 1.29 → 1.30 → still crashed

**Root cause:** etcd transaction timeouts of 10–28 seconds → apiserver livenessprobe kills the process before completion → entire cluster crashes in a loop. On cloud instances, disk I/O isn't as stable as bare metal, and etcd is extremely sensitive to this.

After days of debugging, I decided to ditch kubeadm.

Sounds like a failure. But the troubleshooting process actually taught me more than any tutorial could — I understood how Kubernetes components communicate with each other, why etcd matters so much, how livenessprobe works under the hood. You can't find that stuff in textbooks.

---

## k3s — Light at the End of the Tunnel

Reset kubeadm cleanly, installed k3s with exactly one command:

```bash
curl -sfL https://get.k3s.io | sh -
```

30 seconds later:

```bash
kubectl get nodes
# NAME               STATUS   ROLES           AGE   VERSION
# ip-172-31-47-131   Ready    control-plane   49s   v1.34.6+k3s1
```

Just worked. No crashes. No CrashLoopBackOff. k3s comes with CoreDNS, Traefik, and metrics-server pre-installed — things that kubeadm made me set up manually one by one.

k3s is a lightweight Kubernetes distribution — it's still real K8s with the full API, just leaner and **much more stable on small cloud instances**.

---

## Scaling Up: Multi-node Cluster

A single node isn't really a cluster. I added 2 worker nodes via Terraform, each running t3.small.

Updated the security group — opened additional ports for k3s:
- **6443** — K8s API server
- **8472** — Flannel VXLAN (node-to-node communication)
- **10250** — kubelet API (needed for `kubectl logs/exec`)

Joined workers to the cluster:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://172.31.47.131:6443 \
  K3S_TOKEN=<TOKEN> sh -
```

An important tip: **use private IPs for k3s join**, not public IPs. EC2 private IPs stay the same for the entire instance lifetime, while public IPs change every time you stop/start.

Deployed nginx with 3 replicas to test:

```bash
kubectl create deployment nginx --image=nginx --replicas=3
kubectl get pods -o wide
# nginx-66686b6766-d9sf4   1/1   Running   10.42.2.3    ip-172-31-15-101
# nginx-66686b6766-p8z25   1/1   Running   10.42.1.3    ip-172-31-12-29
# nginx-66686b6766-s7f8b   1/1   Running   10.42.0.20   ip-172-31-47-131
```

3 pods, 3 different nodes. Kubernetes scheduler automatically spreads them out. A real, functioning multi-node cluster.

---

## Cost — Cheaper Than You Think

I only study about 3 hours a day, 20 days a month. I stop the instances when I'm done. Total cost:

| Item | Cost |
|---|---|
| t3.medium (control plane) | ~$2.8/month |
| EBS storage 8GB | ~$0.64/month |
| Elastic IP | Free while instance is running |
| **Total** | **~$3.5–5/month** |

Cheaper than a Starbucks coffee per week.

Tip to avoid surprise bills: set a spending limit in AWS Billing, or just `terraform destroy` when you're done — `terraform apply` only takes ~5 minutes to bring everything back.

---

## Lessons Learned

1. **Cloud beats on-prem for beginners** — less hardware hassle, more focus on what actually matters
2. **k3s > kubeadm for labs** — stable, lightweight, fast, and covers all K8s concepts
3. **Terraform is essential** — infrastructure as code, create/destroy with a single command
4. **Debugging is learning** — the kubeadm troubleshooting journey taught more than succeeding on the first try ever could
5. **Kernel settings must be persistent** — save to config files, don't just run commands once
6. **Private IPs are fixed, public IPs are not** — use private IPs for internal cluster communication
7. **Never use the root account** — create a dedicated IAM user, enable MFA, basic but critical

---

## What's Next

The cluster is ready. Now it's time to install the security stack: **Helm, ArgoCD, Vault, Falco, OPA Gatekeeper, Prometheus, Grafana**... The real DevSecOps journey starts here.

If you're thinking about building a DevSecOps lab — just start. You don't need expensive hardware or a big budget. Just an AWS account and some patience.
