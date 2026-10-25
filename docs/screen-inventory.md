
# Screen Inventory — FixFlow

## 1. Tổng quan (Dashboard)

- Hiển thị số lượng ticket đang chờ nhận, đang xử lý và đã hoàn thành.
- Hiển thị danh sách công việc cần xử lý trong ngày.
- Hiển thị thống kê hiệu suất làm việc của kỹ thuật viên.
- Cho phép chuyển nhanh đến màn hình Hàng đợi và Đang sửa.

## 2. Hàng đợi (Queue)

- Hiển thị danh sách ticket theo các trạng thái: Chờ nhận, Đang xử lý và Hoàn thành.
- Cho phép tìm kiếm ticket theo thông tin liên quan.
- Cho phép lọc ticket theo danh mục và mức độ ưu tiên.
- Hiển thị thông tin chi tiết của ticket được chọn.
- Cho phép kỹ thuật viên nhận việc và bắt đầu xử lý ticket.
- Khi nhấn **Bắt đầu xử lý**, hệ thống chuyển sang màn hình Đang sửa và hiển thị đúng ticket được chọn.
- Cho phép tiếp tục xử lý ticket đang thực hiện.

## 3. Đang sửa (In Progress)

- Hiển thị thông tin sự cố, thiết bị và người yêu cầu.
- Hiển thị checklist các bước sửa chữa.
- Cho phép thêm bước, chỉnh sửa và đánh dấu hoàn thành từng bước checklist.
- Có chức năng AI đề xuất checklist sửa chữa, được mô phỏng bằng JavaScript và dữ liệu mẫu.
- Cho phép chấp nhận, tạo lại, từ chối hoặc chỉnh sửa checklist đề xuất.
- Cho phép nhập và lưu ghi chú sửa chữa.
- Hiển thị tiến độ xử lý và thời gian SLA.
- Có nút **Đã hoàn thành** để kết thúc công việc.
- Khi hoàn thành, hệ thống cập nhật trạng thái ticket và các số liệu liên quan.
