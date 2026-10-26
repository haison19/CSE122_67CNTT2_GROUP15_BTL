
# FixFlow – Technician

## 1. Giới thiệu

FixFlow là hệ thống hỗ trợ quản lý các yêu cầu sửa chữa và bảo trì thiết bị.

Phần Technician (Kỹ thuật viên) giúp kỹ thuật viên theo dõi công việc, tiếp nhận yêu cầu, thực hiện sửa chữa và cập nhật trạng thái xử lý.

## 2. Đối tượng sử dụng

- Kỹ thuật viên bảo trì và sửa chữa thiết bị.

## 3. Danh sách 6 trang

### 3.1. Dashboard – Tổng quan
- Hiển thị tổng quan công việc.
- Thống kê số lượng yêu cầu theo trạng thái.
- Theo dõi tình hình xử lý công việc.

### 3.2. Queue – Hàng đợi
- Hiển thị danh sách yêu cầu sửa chữa.
- Tìm kiếm và lọc yêu cầu.
- Xem thông tin yêu cầu.
- Cho phép bắt đầu xử lý yêu cầu.

### 3.3. In Progress – Đang sửa
- Hiển thị yêu cầu đang được xử lý.
- Theo dõi tiến độ sửa chữa.
- Quản lý checklist công việc.
- Ghi chú quá trình sửa chữa.
- Cập nhật trạng thái hoàn thành.

### 3.4. Repair Details – Chi tiết sửa chữa
- Hiển thị thông tin chi tiết của yêu cầu.
- Xem thông tin thiết bị và mô tả sự cố.
- Theo dõi thông tin cần thiết trước khi sửa chữa.

### 3.5. AI Suggestions – AI đề xuất
- Hiển thị các bước sửa chữa được đề xuất.
- Cho phép xem xét và chỉnh sửa checklist đề xuất.
- Hỗ trợ kỹ thuật viên tham khảo hướng xử lý.

### 3.6. Profile – Hồ sơ cá nhân
- Hiển thị thông tin kỹ thuật viên.
- Xem thông tin tài khoản cá nhân.
- Cập nhật thông tin cá nhân nếu chức năng được hỗ trợ.

## 4. Công nghệ sử dụng

- HTML: Xây dựng cấu trúc giao diện.
- CSS: Thiết kế giao diện và bố cục.
- JavaScript: Xử lý tương tác và chức năng trên trang.

## 5. Cách chạy dự án

Dự án dùng JavaScript module (`import`/`export`) và đọc dữ liệu mẫu bằng `fetch()`, nên **phải chạy qua một máy chủ tĩnh**. Mở trực tiếp file `index.html` bằng `file://` sẽ không tải được dữ liệu và không chạy được module.

Cách chạy bằng VS Code:

1. Mở thư mục dự án bằng Visual Studio Code.
2. Cài extension **Live Server** (tác giả Ritwick Dey) nếu chưa có.
3. Bấm chuột phải vào `index.html` → chọn **Open with Live Server**.
4. Trình duyệt tự mở địa chỉ `http://127.0.0.1:5500/index.html`. Từ menu trái có thể mở 5 trang còn lại.

Cách chạy không cần extension (nếu đã cài Python):

```bash
python -m http.server 8000
# sau đó mở http://localhost:8000/index.html
```

## 6. Cấu trúc thư mục

```text
FixFlow/
├── index.html               Trang Tổng quan
├── queue.html               Trang Hàng đợi
├── fixing.html              Trang Đang sửa
├── history.html             Trang Lịch sử sửa chữa
├── checklist.html           Trang Mẫu checklist
├── analytics.html           Trang Thống kê
├── css/
│   ├── style.css            Giao diện chính + chế độ sáng/tối
│   └── responsive.css       Giao diện cho màn hình nhỏ
├── js/
│   ├── main.js              Khởi động trang, nạp dữ liệu, gọi module theo trang
│   ├── api.js               Đọc JSON + đọc/ghi localStorage + kho dữ liệu dùng chung
│   └── modules/
│       ├── theme.js         Chế độ sáng/tối
│       ├── utils.js         Hàm dùng chung (thông báo, menu, nhãn mức độ)
│       ├── dashboard.js     Trang Tổng quan
│       ├── queue.js         Trang Hàng đợi
│       ├── repair.js        Trang Đang sửa (checklist, đồng hồ, hoàn thành)
│       ├── ai-suggestion.js Gợi ý sửa chữa (mô phỏng bằng quy tắc)
│       ├── history.js       Trang Lịch sử + xuất CSV
│       ├── checklist.js     Trang Mẫu checklist
│       └── analytics.js     Trang Thống kê
├── assets/
│   └── data/                Dữ liệu mẫu (JSON)
│       ├── tickets-tong-quan.json
│       ├── tickets-hang-doi.json
│       ├── lich-su.json
│       ├── thong-ke.json
│       └── checklist.json
└── docs/                    Tài liệu của bài tập
```

Dữ liệu người dùng nhập (checklist đã làm, ghi chú, trạng thái ticket, chế độ sáng/tối) được lưu trong `localStorage` của trình duyệt với các khóa `fixflowDuLieuTicket`, `fixflowTicketDangXuLy`, `fixflowGiaoDien`. Các khóa này **giữ nguyên tên** so với phiên bản trước nên dữ liệu đang có vẫn đọc được.

## 7. Phạm vi triển khai

Phần Technician tập trung vào giao diện và các chức năng hỗ trợ kỹ thuật viên xử lý yêu cầu sửa chữa.

Nếu chưa có backend hoặc dịch vụ AI thực tế, dữ liệu và chức năng đề xuất được mô phỏng bằng JavaScript và dữ liệu mẫu.

## 8. Vai trò trong hệ thống

Technician là một trong bốn luồng của FixFlow, bên cạnh:
- User – Người dùng.
- Administrator – Quản trị viên.
- Manager – Quản lý.


---

* **Figma Design:** [Xem bản thiết kế trên Figma](https://www.figma.com/design/ZSMpHOH5EC4JlVNlwfqSmN/Untitled?node-id=0-1&p=f&t=wgEVbN2wAMDnNZtV-0)

* **Video Demo / Reference (YouTube):** [Xem video trên YouTube](https://www.youtube.com/playlist?list=PLFNl8_VXRO0w)

* **GitHub Repository:**[Truy cập Mã nguồn trên GitHub](https://github.com/hwqrave/FixFlow)
