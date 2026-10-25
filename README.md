
# 🛠️ FixFlow - Hệ thống Quản lý & Điều phối Bảo trì Thiết bị

**FixFlow** là hệ thống hỗ trợ quản lý, điều phối công việc bảo trì và sửa chữa thiết bị dành cho kỹ thuật viên và bộ phận vận hành. Dự án giúp tối ưu hóa quy trình tiếp nhận sự cố, theo dõi tiến độ xử lý và đánh giá hiệu suất làm việc.

---

## 📌 Thông tin Đề tài
* **Tên đề tài:** Hệ thống Quản lý & Điều phối Công việc Bảo trì / Sửa chữa Thiết bị (FixFlow)
* **Trang đã thực hiện:** Trang Tổng quan (Dashboard) dành cho Kỹ thuật viên 

---

## 🎯 Mục đích của Trang Tổng quan
* **Dành cho Kỹ thuật viên:** Theo dõi, tiếp nhận và quản lý danh sách các công việc/ticket bảo trì được giao trong ngày theo mức độ ưu tiên.
* **Đánh giá hiệu suất:** Theo dõi các chỉ số làm việc cá nhân (số công việc hoàn thành, thời gian xử lý trung bình, tỷ lệ tuân thủ cam kết chất lượng SLA).

---

## ✨ Các Chức năng Chính


1. **Quản lý Danh sách Công việc / Ticket hôm nay:**
   * Hiển thị mốc thời gian, tên sự cố, mã thiết bị và vị trí/phòng ban.
   * Phân loại mức độ ưu tiên trực quan (Khẩn, Cao, Trung bình, Thấp).


2. **Bảng điều khiển & Tương tác:**
   * Thanh tìm kiếm nhanh ticket, thiết bị hoặc người dùng.
   * Chuyển đổi trạng thái làm việc cá nhân (*Rảnh / Bận / Không online*).
   * Thanh điều hướng sidebar truy cập các chức năng: *Hàng đợi, Đang sửa, Lịch sử, Checklist, Thống kê*.
   * Chuyển đổi giao diện **Sáng / Tối** bằng nút mặt trăng – mặt trời trên thanh trên cùng; lựa chọn được ghi nhớ (`localStorage`) và áp dụng cho cả 6 trang.

---

## 🛠️ Công nghệ Sử dụng

* **Front-end:**
  * `HTML5`: Cấu trúc semantic cho trang web.
  * `CSS3`: Thiết kế giao diện Dashboard hiện đại, linh hoạt với Flexbox & CSS Grid.
    * `css/style.css`: toàn bộ style dùng chung (biến màu, layout, component) + bảng màu **chế độ tối** qua `html[data-giao-dien="toi"]`.
    * `css/responsive.css`: các khối `@media` (1280 / 1100 / 900 / 560px), tách riêng cho dễ bảo trì — **luôn nạp sau** `style.css`.
  * `JavaScript`: Xử lý tương tác người dùng và hiển thị dữ liệu/biểu đồ.
* **Môi trường phát triển:**
  * **Visual Studio Code** với Extension **Live Server**.
  * **Git / GitHub** quản lý mã nguồn và phiên bản.

---



---

## 🧪 Kiểm thử

Bộ kiểm thử tự động (Playwright + Microsoft Edge) gồm **35 test** đi hết luồng *Hàng đợi → Đang sửa → Lịch sử*, kiểm tra cả việc lưu dữ liệu bằng `localStorage`:

```powershell
python -m pip install playwright
python tests/kiem_thu_ui.py
```

Kết quả mới nhất: **35/35 PASS** — xem chi tiết cách chạy, bảng kết quả, hạn chế đã biết và checklist kiểm thử thủ công trong [TESTING.md](TESTING.md).

---

* **Figma Design:** [Xem bản thiết kế trên Figma](https://www.figma.com/design/ZSMpHOH5EC4JlVNlwfqSmN/Untitled?node-id=0-1&p=f&t=wgEVbN2wAMDnNZtV-0)

* **Video Demo / Reference (YouTube):** [Xem video trên YouTube](https://www.youtube.com/watch?v=PFMi9wCNk5Y)

* **GitHub Repository:**[Truy cập Mã nguồn trên GitHub](https://github.com/hwqrave/FixFlow)