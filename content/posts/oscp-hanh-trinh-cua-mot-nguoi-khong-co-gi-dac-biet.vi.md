---
title: "OSCP — Hành trình của một người không có gì đặc biệt"
date: 2026-02-26
description: "Không có thiên tài, không có đường tắt. Chỉ có lab, note, và nỗ lực + kỷ luật."
categories: ["Pentest Notes"]
tags: ["oscp", "hackthebox", "roadmap", "kinh nghiệm"]
draft: false
---

Hồi còn là sinh viên (và là 1 vozer), OSCP với tôi là thứ gì đó to lớn lắm. Kiểu như nhìn lên trời thấy một ngôi sao rồi tự nhủ *"ừ, đẹp đấy"* — không dám nghĩ đến chuyện chạm vào.

Ra trường. Đi làm. Có tiền. Rồi một ngày tôi mở trang đăng ký của OffSec và nghĩ: *thôi thử xem sao*.

Thế là bắt đầu.

---

## Thật ra tôi cũng hay chểnh mảng lắm

Nói thật, khoảng thời gian từ lúc tôi "bắt đầu học OSCP" đến lúc thực sự ngồi vào học nghiêm túc khá dài. Có khá nhiều buổi tối lẽ ra nên cày lab nhưng lại dành cho những thứ vô bổ.

Thời gian tôi thực sự nghiêm túc vào khoảng **6 tháng** sau khi tự kiểm điểm lại bản thân. Không phải 6 tháng liên tục không nghỉ — mà là 6 tháng mà mỗi ngày tôi đều mở máy ra làm *một cái gì đó*, dù ít dù nhiều.

Tôi không có tài năng thiên bẩm gì. Tôi học chậm, có những bài lab đọc writeup xong vẫn không hiểu tại sao người ta làm vậy, phải đọc lại lần hai lần ba. Nhưng tôi vẫn cày. Đó là thứ duy nhất tôi có thể làm.

---

## Lab — và chuyện lệ thuộc writeup

Tôi luyện theo danh sách **OffSec Exam HTB List của 0xdf** — đây là điểm xuất phát tốt nếu bạn chưa biết bắt đầu từ đâu.

Lúc đầu tôi đọc writeup rất nhiều. Nhiều đến mức bản thân cũng thấy ngại — stuck một lúc là mở writeup, xem hint rồi tiếp tục. Cứ thế.

Mãi sau tôi mới nhận ra vấn đề không phải ở chỗ *đọc writeup* mà ở chỗ tôi đọc xong rồi...thì thôi. Không tự hỏi tại sao. Không thử lại từ đầu. Không ghi lại gì cả.

Thay đổi lớn nhất của tôi là bắt đầu **tự làm note**.

---

## Về cái note đó

Tôi dùng Notion. Không phải vì Notion tốt hơn các tool khác — mà vì tôi quen với nó.

Cấu trúc tôi chia ra theo từng mảng: Windows, Linux, Active Directory, rồi checklist cho từng giai đoạn — recon, đấm dịch vụ, đấm web, leo quyền, v.v. Nhỏ thôi, nhưng rõ ràng.

Mỗi lần chạy một lệnh mới, tôi ghi lại. Mỗi lần lệnh bị lỗi và tôi tìm ra nguyên nhân, tôi cũng ghi lại — kể cả cái lý do tại sao nó lỗi, không chỉ cách fix. Nhiều người hay copy lỗi hỏi AI cho nhanh rồi chạy tiếp mà không thực sự hiểu chuyện gì đang xảy ra. Tôi cũng từng làm vậy. Sau này tôi bỏ thói quen đó.

Sau 6 tháng, cái cheatsheet tự tay làm đó trở thành thứ tôi tra nhanh hơn cả Google. Vì tôi biết mình đã để nó ở đâu, và tôi nhớ ngữ cảnh khi viết nó ra.

Trên mạng có rất nhiều note OSCP được chia sẻ miễn phí, cũng có những bộ note được bán với giá không rẻ. Tôi không nói những thứ đó không có giá trị — nhưng note của người khác không bao giờ thay thế được note của chính mình. Quá trình tự ngồi phân loại, chọn lọc, ghi lại — đó chính là học. Cái cheatsheet tốt nhất là cái bạn tự làm ra, vì nó phục vụ đúng cách bạn suy nghĩ, và nó dùng được mãi — không chỉ cho OSCP mà cho cả công việc sau này.

Người thành công chưa chắc đã siêng năng hơn bạn — nhưng người lười thì rất khó để thành công. Tôi hay tự nhắc mình câu này, vì tôi cũng khá lười :3.

---

## Tìm một người đi cùng

Có một giai đoạn tôi cày cùng một người bạn. Cùng giải lab, cùng stuck, cùng chửi tác giả của lab khi không ra flag, rồi cùng mừng khi root được máy.

Các cụ có câu: "Muốn đi nhanh thì đi một mình, muốn đi xa thì đi cùng nhau". Quả thật thấm thía.

---

## Chuyện không được dùng AI khi thi

OffSec không cho dùng AI trong lúc thi. Lần đầu nghe tôi cũng thấy hơi bất tiện — quen tra AI rồi, giờ phải Google lại như ngày xưa.

Nhưng nghĩ lại thì đó là một điều tốt.

Nếu bạn chỉ quen copy lỗi hỏi AI rồi làm theo, bạn sẽ không biết mình thực sự hiểu đến đâu — cho đến khi vào phòng thi và AI không còn ở đó nữa. Tập không dùng AI trong lúc ôn luyện không phải tự hành xác — mà là tập một kỹ năng cơ bản hơn: **biết cách tự tìm kiếm và đọc tài liệu**. Đó là thứ một hacker thực sự cần, không phải khả năng prompt AI cho khéo.

---

Vậy thôi. Không có bí quyết gì đặc biệt. Cày lab, tự làm note, tìm người đi cùng, và đừng quá phụ thuộc vào AI.

Nếu bạn đang trên con đường này — chúc may mắn. Và nếu có gì muốn hỏi, cứ hỏi.
