# 🚀 Hướng dẫn Deploy Blog AppSec lên GitHub Pages

## 📋 Yêu cầu

- Git đã cài sẵn
- Tài khoản GitHub
- Hugo (cài bên dưới)

---

## Bước 1: Cài Hugo

### macOS
```bash
brew install hugo
```

### Windows (dùng Chocolatey)
```bash
choco install hugo-extended
```

### Linux (Ubuntu/Debian)
```bash
sudo apt install hugo
# Hoặc tải bản mới nhất:
wget https://github.com/gohugoio/hugo/releases/latest/download/hugo_extended_linux_amd64.tar.gz
tar -xzf hugo_extended_linux_amd64.tar.gz
sudo mv hugo /usr/local/bin/
```

Kiểm tra:
```bash
hugo version
# hugo v0.x.x ...
```

---

## Bước 2: Khởi tạo Git

Mở terminal, vào thư mục blog vừa tải về:

```bash
cd cybersec-blog

# Khởi tạo git
git init
git add .
git commit -m "feat: initial blog setup"
```

---

## Bước 3: Tạo GitHub Repository

1. Truy cập https://github.com/new
2. Đặt tên repo: `appsec-blog` (hoặc tên bất kỳ)
3. Để **Public** (bắt buộc để dùng GitHub Pages miễn phí)
4. **Không** tick vào "Add README"
5. Nhấn **Create repository**

---

## Bước 4: Push code lên GitHub

Sau khi tạo repo, GitHub sẽ hiện lệnh — chạy các lệnh này:

```bash
git remote add origin https://github.com/YOUR_USERNAME/appsec-blog.git
git branch -M main
git push -u origin main
```

> ⚠️ Thay `YOUR_USERNAME` bằng username GitHub của bạn.

---

## Bước 5: Bật GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**
2. Phần **Source**: chọn **GitHub Actions**
3. Nhấn **Save**

GitHub sẽ tự động chạy workflow deploy mỗi khi bạn push code mới!

---

## Bước 6: Cập nhật URL trong config

Mở file `hugo.toml`, sửa dòng đầu:

```toml
baseURL = "https://YOUR_USERNAME.github.io/appsec-blog/"
```

Thay `YOUR_USERNAME` và `appsec-blog` bằng thực tế.

Cũng sửa thông tin cá nhân:
```toml
[params]
  author = "Tên của bạn"
  github = "https://github.com/YOUR_USERNAME"
```

Rồi push lại:
```bash
git add hugo.toml
git commit -m "config: update baseURL and author info"
git push
```

---

## Bước 7: Xem blog online

Sau khoảng 1-2 phút, truy cập:
```
https://YOUR_USERNAME.github.io/appsec-blog/
```

Kiểm tra quá trình deploy: **Actions** tab trong GitHub repo.

---

## ✍️ Cách viết bài mới

### Tạo bài nhanh bằng lệnh
```bash
hugo new posts/ten-bai-viet.md
```

File mới sẽ được tạo tại `content/posts/ten-bai-viet.md` với template sẵn.

### Chỉnh sửa front matter (phần đầu file)
```yaml
---
title: "Tên bài viết của bạn"
date: 2026-03-01
description: "Mô tả ngắn hiện ra ở card preview"
categories: ["Lab Writeup"]
tags: ["xss", "burpsuite", "portswigger"]
draft: false          # ← Đổi thành false khi muốn publish
---
```

### Các categories gợi ý
| Category | Dùng khi nào |
|----------|-------------|
| `Lab Writeup` | Giải lab PortSwigger, HackTheBox |
| `Tool Deep Dive` | Khám phá công cụ (Burp, Semgrep...) |
| `Code Review` | Audit mã nguồn, tìm lỗi trong code |
| `DevSecOps` | CI/CD pipeline, SAST/DAST |
| `Pentest Notes` | Ghi chú kỹ thuật, tips & tricks |

---

## 🖥️ Xem trước ở local trước khi publish

```bash
hugo server -D
```

Mở trình duyệt: http://localhost:1313

Flag `-D` cho phép xem cả bài `draft: true`.

---

## 📤 Publish bài viết

1. Đổi `draft: false` trong file bài viết
2. Chạy:
```bash
git add .
git commit -m "post: tên bài viết"
git push
```
3. Chờ ~60 giây → blog tự cập nhật!

---

## 🌐 Thêm custom domain (tuỳ chọn)

Nếu bạn có domain riêng (ví dụ `appsecblog.io`):

1. Tạo file `static/CNAME` với nội dung:
```
appsecblog.io
```

2. Vào GitHub → Settings → Pages → Custom domain → điền domain của bạn

3. Ở DNS provider, thêm CNAME record:
```
www → YOUR_USERNAME.github.io
```

---

## 🗂️ Cấu trúc thư mục

```
cybersec-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← Auto deploy khi push
├── content/
│   ├── posts/                ← Bài viết của bạn
│   │   └── *.md
│   └── about.md
├── layouts/
│   ├── _default/             ← HTML templates
│   └── partials/             ← Header, footer
├── static/
│   ├── css/main.css          ← Toàn bộ style
│   └── js/main.js            ← JavaScript
├── archetypes/
│   └── posts.md              ← Template bài viết mới
└── hugo.toml                 ← Config chính
```

---

## 💡 Mẹo viết tốt hơn

**Code block với syntax highlight:**
````markdown
```python
import requests
r = requests.get("https://target.com/?id=1'")
print(r.status_code)
```
````

**Blockquote nổi bật:**
```markdown
> **TIP:** Luôn test IDOR với cả authenticated và unauthenticated session.
```

**Bảng so sánh tool:**
```markdown
| Tool | Dùng cho | Miễn phí |
|------|----------|----------|
| Burp Suite Community | Web pentest | ✅ |
| Semgrep | SAST | ✅ |
| ZAP | DAST | ✅ |
```

---

## 🆘 Troubleshoot thường gặp

**Blog hiện 404 sau khi deploy:**
→ Kiểm tra `baseURL` trong `hugo.toml` — phải khớp với URL thực tế

**GitHub Actions bị fail:**
→ Vào tab **Actions** xem log lỗi cụ thể

**Bài viết không hiện:**
→ Kiểm tra `draft: false` và `date` không phải tương lai

**Hình ảnh không load:**
→ Đặt ảnh trong `static/images/` và dùng đường dẫn `/images/file.png`

---

*Happy hacking & writing! 🔐*
