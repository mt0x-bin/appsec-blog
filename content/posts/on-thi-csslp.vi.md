---
title: "Ôn thi CSSLP theo cách của tôi — tài nguyên, kinh nghiệm, và những thứ tôi ước mình biết sớm hơn"
date: 2026-03-03
description: "Tôi chưa thi CSSLP. Nhưng tôi đang ôn — và đây là cách tôi làm, kèm bộ tài nguyên tiếng Việt tôi tự tổng hợp để đóng góp cho cộng đồng."
categories: ["Pentest Notes"]
tags: ["csslp", "appsec", "isc2", "chứng chỉ", "devsecops", "ôn thi"]
draft: false
---

Nói thật luôn: tôi chưa thi CSSLP.

Bài này không phải "kinh nghiệm thi đậu" — mà là cách tôi đang ôn, những tài nguyên tôi tìm thấy (và tự làm ra), và lý do tôi nghĩ chứng chỉ này đáng để theo đuổi nếu bạn đang đi theo hướng AppSec hoặc DevSecOps.

Tôi viết vì khi bắt đầu tìm hiểu về CSSLP, tài nguyên tiếng Việt gần như không có. Hy vọng bài này có ích cho ai đó đang ở cùng điểm xuất phát với tôi.

---

## CSSLP là gì và tại sao tôi theo đuổi nó

CSSLP — Certified Secure Software Lifecycle Professional — là chứng chỉ của ISC2, xác nhận rằng bạn có đủ năng lực tích hợp bảo mật vào từng giai đoạn của vòng đời phát triển phần mềm: từ thiết kế, lập trình, kiểm thử, đến triển khai và vận hành.

Với ai làm pentest thuần túy thì nghe có vẻ xa lạ. Nhưng nếu bạn đang muốn chuyển dần sang AppSec hoặc DevSecOps — tức là không chỉ *tìm lỗi* mà còn *tham gia vào quy trình làm ra phần mềm an toàn hơn* — thì CSSLP là một trong những chứng chỉ phù hợp nhất để đặt mục tiêu.

Với tôi, nó nằm trong lộ trình dài hạn: sau OSCP là đi sâu vào AppSec, và CSSLP là cái cột mốc để buộc mình phải học đúng và học đủ.

**Một lưu ý thực tế:** để được cấp chứng chỉ CSSLP, bạn cần có ít nhất 4 năm kinh nghiệm thực tế trong SDLC. Nếu chưa đủ kinh nghiệm, bạn vẫn có thể thi — và nếu đậu, sẽ trở thành Associate of ISC2, sau đó có 5 năm để tích lũy đủ kinh nghiệm. Tôi đang đi theo hướng đó.

---

## Cấu trúc kỳ thi

Kỳ thi gồm 125 câu hỏi trắc nghiệm, thời gian 3 tiếng, điểm đậu là 700/1000. Kỳ thi được làm mới lần gần nhất vào tháng 9/2023.

Nội dung chia thành 8 domain, bao gồm: Secure Software Concepts, Secure Software Requirements, Secure Software Design, Secure Software Implementation, Secure Software Testing, Software Acceptance, Secure Software Deployment/Operations/Maintenance, và Supply Chain & Software Acquisition.

Tám domain nghe nhiều, nhưng thực ra chúng liên kết với nhau khá tự nhiên — đều xoay quanh một câu hỏi: *ở mỗi bước trong vòng đời phần mềm, bạn cần làm gì để nó an toàn hơn?*

---

## Tài nguyên ôn tập

Đây là phần chính của bài. Tôi chia thành hai nhóm: lý thuyết và thực hành — vì chỉ đọc sách mà không luyện câu hỏi thì đến lúc thi rất dễ bị hỏng.

### 📚 Lý thuyết — đọc gì?

**Sách chính:**

*CSSLP Certified Secure Software Lifecycle Professional All-in-One Exam Guide, Third Edition* của **Wm. Arthur Conklin** và **Daniel Paul Shoemaker** — bao phủ toàn bộ 8 domain, có learning objectives đầu mỗi chương, exam tips, và câu hỏi thực hành kèm giải thích. Đây là cuốn tôi dùng làm tài liệu gốc.

Cuốn này khá dày và đọc tiếng Anh chuyên ngành mất nhiều thời gian. Vì vậy tôi đã tổng hợp thêm một tài nguyên tiếng Việt để hỗ trợ:

> **📥 Ebook tóm tắt tiếng Việt** — tôi dùng NotebookLM của Google để tổng hợp nội dung từ cuốn AIO CSSLP 3rd Edition thành bản tiếng Việt súc tích hơn. Tải về: **[PDF](https://mt0x-bin.github.io/appsec-blog/downloads/CSSLP_ebook.pdf)** · **[MOBI](https://mt0x-bin.github.io/appsec-blog/downloads/CSSLP_ebook.mobi)**
>
> ⚠️ *Lưu ý quan trọng: đây chỉ là bản tóm tắt — nên coi như tài liệu đọc nhanh hoặc ôn lại, không thay thế được cuốn gốc. Những phân tích, ví dụ thực tế, và giải thích sâu của tác giả trong bản gốc mới là thứ thực sự giúp bạn hiểu, không chỉ nhớ.*

### 🧠 Thực hành — luyện câu hỏi như thế nào?

Đọc xong một domain, tôi luyện câu hỏi ngay — không đợi đọc hết cả cuốn rồi mới làm. Lý do: CSSLP test tư duy ứng dụng nhiều hơn thuộc lòng định nghĩa, nên phải luyện song song mới hiệu quả.

**Bộ flashcard Anki:**

> **📥 Bộ Anki CSSLP** — tôi tự tạo theo từng domain, phù hợp để ôn nhanh hàng ngày, đặc biệt hữu ích với những khái niệm hay nhầm lẫn như các mô hình threat modeling, SDL phases, hay các loại testing. **[Tải về (.apkg)](https://mt0x-bin.github.io/appsec-blog/downloads/CSSLP.apkg)**
>
> Anki dùng thuật toán spaced repetition — tức là nó tự điều chỉnh để nhắc bạn ôn lại đúng lúc bạn sắp quên. Nếu chưa quen với Anki thì nên thử, mất khoảng 30 phút để làm quen nhưng đáng.

**Bộ câu hỏi trực tuyến:**

Một số nguồn tôi đang dùng để luyện thêm, cả miễn phí lẫn mất phí:

| Nguồn | Ghi chú |
|-------|---------|
| [itexams.com/exam/CSSLP](https://www.itexams.com/exam/CSSLP) | Có phiên bản miễn phí |
| [edusum.com](https://www.edusum.com/isc2/csslp-isc2-secure-software-lifecycle-professional) | Tôi cũng chưa xem qua nhưng chắc là sẽ "đắt sắt ra miếng" |
| [flashgenius.net/csslp-cheat-sheet](https://flashgenius.net/csslp-cheat-sheet) | Có phiên bản miễn phí |

Tôi thường làm theo kiểu: đọc xong 1 domain → luyện câu hỏi liên quan domain đó → ghi lại những chỗ sai vào note → hôm sau ôn lại bằng Anki.

---

## Cách tôi chia thời gian ôn

Không có công thức chuẩn, nhưng đây là cách tôi đang làm với lịch đi làm ban ngày:

- **Buổi tối ngày thường (~45 phút):** đọc 1 chương hoặc ôn lại chapter notes, sau đó làm 15–20 câu hỏi.
- **Cuối tuần (~2–3 tiếng):** làm mock exam full domain, review sai, cập nhật note.
- **Hàng ngày (~10 phút):** ôn Anki, không bỏ ngày nào.

Tổng cộng tôi dự kiến ôn trong khoảng 4–5 tháng trước khi đặt lịch thi. Sau khi thi xong tôi sẽ cập nhật lại bài này.

---

## Những thứ tôi ước mình biết sớm hơn

**CSSLP không test kiến thức kỹ thuật thuần tuý.** Câu hỏi thường đặt bạn vào vai một manager, một architect, hay một security lead — hỏi *bạn sẽ làm gì* trong tình huống này, không phải *điều gì là đúng về mặt kỹ thuật*. Tư duy "best practice" và "risk-based decision" quan trọng hơn nhớ định nghĩa.

**8 domain không bằng nhau về trọng số.** Một vài domain như Secure Software Design và Secure Software Implementation chiếm phần lớn câu hỏi — nên phân bổ thời gian theo đó, không cần học đều tất cả.

---

Tôi sẽ tiếp tục cập nhật bài này khi có thêm tài nguyên hoặc sau khi có kết quả thi.

---

Có một thứ tôi đang trăn trở khi ôn: đọc và làm bài thi nhiều rồi, nhưng liệu mình có thực sự *làm được* những gì CSSLP dạy không — hay chỉ đang học để thi?

Tôi đang nghĩ đến việc tự dựng một hệ thống nhỏ và thực hành áp dụng những gì học được vào thực tế — từ threat modeling, secure design, đến tích hợp bảo mật vào pipeline — thay vì chỉ dừng lại ở lý thuyết. Chưa biết sẽ làm như thế nào, nhưng nếu hành trình đó đáng viết thành bài, tôi sẽ viết.
