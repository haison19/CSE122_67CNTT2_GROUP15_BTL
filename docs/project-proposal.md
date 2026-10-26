
# PROJECT PROPOSAL — FixFlow

## 1. Tổng quan dự án

### 1.1. Giới thiệu

FixFlow là website hỗ trợ kỹ thuật viên quản lý và theo dõi công việc sửa chữa thiết bị.

Hệ thống gồm 3 màn hình chính:
- **Tổng quan:** Hiển thị tình hình công việc và các thống kê cơ bản.
- **Hàng đợi:** Hiển thị danh sách ticket, cho phép tìm kiếm, lọc và bắt đầu xử lý công việc.
- **Đang sửa:** Hiển thị thông tin ticket, checklist sửa chữa, ghi chú và chức năng hoàn thành công việc.

Ngoài ra, hệ thống có chức năng AI đề xuất các bước sửa chữa để kỹ thuật viên tham khảo. Chức năng này được mô phỏng bằng JavaScript và dữ liệu mẫu.

Dự án chỉ sử dụng HTML, CSS và JavaScript thuần, không có backend.

### 1.2. Bối cảnh thực tế

Trong quá trình quản lý và sửa chữa thiết bị, kỹ thuật viên cần tiếp nhận yêu cầu, xác định mức độ ưu tiên và theo dõi tiến độ xử lý.

Nếu thông tin công việc không được tổ chức rõ ràng, kỹ thuật viên có thể gặp khó khăn khi xác định công việc cần làm trước, theo dõi các bước sửa chữa và cập nhật trạng thái ticket.

Vì vậy, FixFlow được xây dựng nhằm mô phỏng một giao diện quản lý công việc sửa chữa đơn giản, giúp thông tin được trình bày rõ ràng và dễ theo dõi hơn.

## 2. Phân tích vấn đề

### 2.1. Các vấn đề cần giải quyết

Dự án tập trung giải quyết các vấn đề sau:

- **Khó theo dõi công việc:** Kỹ thuật viên cần biết những ticket đang chờ xử lý và những ticket đang thực hiện.
- **Khó xác định mức độ ưu tiên:** Khi có nhiều yêu cầu, kỹ thuật viên cần dễ dàng nhận biết công việc quan trọng.
- **Khó quản lý tiến độ sửa chữa:** Các bước sửa chữa cần được trình bày thành checklist để dễ theo dõi.
- **Thiếu hướng dẫn sửa chữa:** Kỹ thuật viên cần có gợi ý về các bước kiểm tra thiết bị khi xử lý sự cố.
- **Khó cập nhật trạng thái:** Trạng thái ticket cần được cập nhật khi bắt đầu hoặc hoàn thành công việc.

### 2.2. Mục tiêu giải quyết

FixFlow hướng đến các mục tiêu sau:

- Hiển thị thông tin công việc trên một giao diện dễ sử dụng.
- Giúp kỹ thuật viên tìm kiếm, lọc và lựa chọn ticket cần xử lý.
- Hỗ trợ theo dõi các bước sửa chữa bằng checklist.
- Mô phỏng chức năng AI đề xuất checklist để hỗ trợ kỹ thuật viên tham khảo.
- Cho phép ghi chú quá trình sửa chữa và cập nhật trạng thái ticket.
- Giúp người dùng dễ dàng theo dõi tiến độ công việc thông qua màn hình Tổng quan.

## 3. Mục tiêu dự án

Dự án được thực hiện nhằm xây dựng một website frontend có các chức năng cơ bản phục vụ việc quản lý và theo dõi công việc sửa chữa thiết bị.

Các mục tiêu cụ thể:

- Hoàn thiện 3 màn hình: Tổng quan, Hàng đợi và Đang sửa.
- Xây dựng giao diện đơn giản, rõ ràng và dễ thao tác.
- Đảm bảo các chức năng tìm kiếm, lọc, checklist, ghi chú và cập nhật trạng thái hoạt động đúng.
- Xây dựng chức năng AI đề xuất checklist ở mức mô phỏng bằng JavaScript.
- Kiểm thử lại các chức năng sau khi hoàn thiện.
- Giữ code dễ đọc, dễ bảo trì và phù hợp với kiến thức HTML, CSS, JavaScript cơ bản.

**Phạm vi dự án:** Chỉ xây dựng frontend, sử dụng dữ liệu mẫu và không triển khai backend, cơ sở dữ liệu máy chủ hoặc AI thực tế.

## 4. Đối tượng sử dụng và vai trò

Đối tượng sử dụng chính của FixFlow là kỹ thuật viên phụ trách tiếp nhận và sửa chữa thiết bị.

### Phạm vi triển khai vai trò

**Kỹ thuật viên**

- Xem tổng quan tình hình công việc.
- Xem danh sách ticket đang chờ xử lý.
- Tìm kiếm và lọc ticket theo thông tin hoặc mức độ ưu tiên.
- Bắt đầu xử lý và theo dõi thông tin ticket.
- Sử dụng checklist để thực hiện các bước sửa chữa.
- Tham khảo checklist do chức năng AI mô phỏng đề xuất.
- Ghi chú quá trình sửa chữa.
- Cập nhật trạng thái khi hoàn thành công việc.

**Lưu ý:** Vì dự án chỉ có frontend và không có backend, các vai trò trên được mô phỏng trong giao diện. Hệ thống chưa triển khai đăng nhập, phân quyền hoặc xác thực người dùng thực tế.
