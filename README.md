# FixFlow – Administrator System

## 1. Giới thiệu
FixFlow là hệ thống hỗ trợ quản lý các yêu cầu sửa chữa và bảo trì thiết bị.
Phần Administrator (Quản trị hệ thống) giúp quản trị viên giám sát tổng quan hoạt động, quản lý tài khoản người dùng, thiết bị, danh mục lỗi và cấu hình các thiết lập hệ thống (SLA).

---

## 2. Đối tượng sử dụng
- Quản trị viên hệ thống (Administrator / System Admin)[cite: 4].

---

## 3. Danh sách 5 trang / màn hình chức năng

### 3.1. Dashboard – Tổng quan hệ thống (`admin-system-manage.html`)
- Hiển thị các thẻ thống kê tổng quan hệ thống và sức khỏe hoạt động[cite: 4].
- Theo dõi nhật ký hoạt động gần đây và biểu đồ trạng thái thiết bị (Hoạt động, Bảo trì, Ngừng dùng)[cite: 4].
- Thống kê tỷ lệ người dùng theo từng vai trò: Nhân viên, Kỹ thuật viên, Quản trị viên[cite: 4].
- Cung cấp các nút thao tác nhanh hệ thống[cite: 4].

### 3.2. Quản lý Thiết bị (`admin-device-manage.html`)
- Hiển thị danh sách toàn bộ thiết bị trong hệ thống[cite: 4].
- Hỗ trợ tìm kiếm, lọc thiết bị theo mã, loại, vị trí và trạng thái[cite: 4].
- Cho phép thêm mới, cập nhật thông tin và thay đổi trạng thái hoạt động của thiết bị[cite: 4].

### 3.3. Quản lý Danh mục Lỗi (`admin-issue-category-manage.html`)
- Hiển thị và quản lý danh sách các loại/danh mục lỗi chuẩn hóa[cite: 4].
- Hỗ trợ phân loại sự cố, điều chỉnh tên danh mục, mô tả và cấp độ ảnh hưởng[cite: 4].

### 3.4. Cấu hình SLA (`admin-sla-configure.html`)
- Thiết lập và quản lý quy định về thời gian phản hồi/xử lý (Service Level Agreement) cho từng mức độ sự cố[cite: 4].
- Cho phép chỉnh sửa các mốc thời gian tối đa để bảo đảm cam kết chất lượng dịch vụ[cite: 4].

### 3.5. Quản lý Người dùng (`users.json` / Tích hợp hệ thống)
- Quản lý dữ liệu danh sách người dùng và phân quyền tài khoản[cite: 4].
- Phân loại tài khoản theo vai trò: Nhân viên, Kỹ thuật viên, Quản lý và Quản trị viên[cite: 4].

---

## 4. Công nghệ sử dụng
- **HTML5**: Xây dựng cấu trúc giao diện ứng dụng phẳng (dùng các thẻ ngữ nghĩa `<main>`, `<aside>`, `<header>`, `<template>`)[cite: 4].
- **CSS3**: Thiết kế giao diện responsive và bố cục điều hướng phẳng (`admin-system-manage.css`, `admin-system-manage-responsive.css`)[cite: 4].
- **JavaScript (ES6 Modules)**: Xử lý logic theo từng module độc lập (`overview.js`, `devices.js`, `issue-categories.js`, `sla-settings.js`, `unified-data.js`)[cite: 4].

---

## 5. Khai báo công cụ AI  Nền tảng hỗ trợ

Trong quá trình phát triển phân hệ Quản trị hệ thống FixFlow, các công cụ AI và nền tảng hỗ trợ được sử dụng như sau:

### 5.1. ChatGPT
- **Mục đích:** Nghiên cứu thông tin, làm rõ yêu cầu chức năng, xây dựng và tối ưu prompt, hỗ trợ soạn thảo tài liệu dự án (README, Proposal, Screen Inventory).
- **Vai trò:** Trợ lý phân tích yêu cầu và chuẩn bị prompt cho quá trình phát triển.

### 5.2. Mimo 2.6
- **Mục đích:** Xây dựng bộ khung giao diện frontend ban đầu, tạo cấu trúc HTML/CSS/JS mẫu và định hình bố cục các trang quản trị.
- **Vai trò:** Hỗ trợ tạo code nền tảng ban đầu để phát triển các màn hình chức năng.

### 5.3. Google Gemini
- **Mục đích:** Tư vấn giải pháp kỹ thuật, tối ưu hóa cấu trúc mã nguồn (ES6 Modules), sửa lỗi (debugging) và hoàn thiện các logic tương tác dữ liệu.
- **Vai trò:** Hỗ trợ tinh chỉnh, kiểm sửa lỗi và tối ưu hóa mã nguồn.

*Lưu ý: Toàn bộ mã nguồn do AI gợi ý đều được kiểm tra, chỉnh sửa và thử nghiệm trực tiếp để đảm bảo hoạt động đúng với yêu cầu của hệ thống.*

---

## 6. Cách chạy dự án
Dự án sử dụng JavaScript module (`import`/`export`) và nạp dữ liệu bằng `fetch()` từ file JSON, nên bắt buộc phải chạy qua Web Server tĩnh[cite: 4].

**Cách 1: Chạy bằng Live Server trong VS Code**
1. Mở thư mục `TH2` bằng Visual Studio Code[cite: 4].
2. Bấm chuột phải vào `admin-system-manage.html` → chọn **Open with Live Server**[cite: 4].
3. Trình duyệt tự mở địa chỉ `http://127.0.0.1:5500/admin-system-manage.html`[cite: 4].

**Cách 2: Chạy bằng Python**
```bash
python -m http.server 8000
# Sau đó mở trình duyệt truy cập: http://localhost:8000/admin-system-manage.html

---

## 7. Cấu trúc thư mục
```text
TH2/
├── admin-system-manage.html          Trang Tổng quan / Quản lý hệ thống chính
├── js/
│   ├── admin-system-manage.js        Khởi tạo và điều phối trang hệ thống
│   ├── unified-data.js               Quản lý dữ liệu hợp nhất
│   └── modules/
│       ├── overview.js               Module logic Tổng quan hệ thống
│       ├── devices.js                Module logic Quản lý Thiết bị
│       ├── issue-categories.js       Module logic Danh mục Lỗi
│       └── sla-settings.js           Module logic Cấu hình SLA
└── assets/
    └── data/                         Dữ liệu mẫu chuẩn (JSON)
        ├── overview.json             Dữ liệu tổng quan hệ thống
        ├── devices.json              Dữ liệu danh sách thiết bị
        ├── issue-categories.json     Dữ liệu danh mục lỗi
        ├── sla-settings.json         Dữ liệu cấu hình SLA
        └── users.json                Dữ liệu danh sách người dùng
```
---

## 8. Phạm vi triển khai & Vai trò hệ thống
Phạm vi: Phân hệ Administrator tập trung vào giao diện quản trị và xử lý logic phía client. Toàn bộ dữ liệu được quản lý hợp nhất qua unified-data.js kết hợp với file JSON mẫu và localStorage[cite: 4].
Vai trò: Administrator đóng vai trò trung tâm kết nối cùng các phân hệ khác[cite: 4]:
User – Người dùng gửi yêu cầu.
Technician – Kỹ thuật viên xử lý sự cố.
Manager – Quản lý giám sát và báo cáo.
Figma Design: https://www.figma.com/design/ZSMpHOH5EC4JlVNlwfqSmN/Untitled?node-id=0-1&t=kWQW3sBJ7VZF1ZPi-0
GitHub Repository: https://github.com/haison19/CSE122_67CNTT2_GROUP15_BTL.git
Link youtube: https://youtube.com/playlist?list=PLVtZqCVkOqS4&si=q40f5bgLTZG7Oodv
