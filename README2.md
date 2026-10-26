FixFlow – Technician Module
Tài liệu đặc tả kỹ thuật và mô tả biểu mẫu Kỹ thuật viên bảo trì thiết bị
1. Giới thiệu
FixFlow là hệ thống hỗ trợ quản lý toàn diện các yêu cầu sửa chữa và bảo trì thiết bị. Phân hệ
Technician (Kỹ thuật viên) đóng vai trò cốt lõi giúp kỹ thuật viên dễ dàng theo dõi công việc được
phân công, tiếp nhận yêu cầu, thực hiện quy trình sửa chữa theo chuẩn SLA và cập nhật trạng thái
xử lý nhanh chóng.
2. Đối tượng sử dụng
Kỹ thuật viên bảo trì, chuyên viên kỹ thuật hệ thống và đội ngũ vận hành thiết bị cơ sở.
3. Danh sách 6 trang giao diện chính
• 3.1. Dashboard – Tổng quan: Hiển thị tổng quan công việc cá nhân, thống kê số lượng yêu
cầu theo trạng thái và theo dõi tiến độ xử lý.
• 3.2. Queue – Hàng đợi: Hiển thị danh sách yêu cầu sửa chữa đang chờ, hỗ trợ tìm kiếm, lọc
theo mức độ ưu tiên và cho phép bắt đầu xử lý yêu cầu.
• 3.3. In Progress – Đang sửa: Hiển thị yêu cầu đang được xử lý trực tiếp, quản lý checklist
công việc chi tiết, ghi chú quá trình sửa và cập nhật hoàn thành.
• 3.4. Repair Details – Chi tiết sửa chữa: Cung cấp thông tin chi tiết về thiết bị, mô tả sự cố và
các thông số kỹ thuật cần thiết trước khi tiến hành sửa chữa.
• 3.5. AI Suggestions – AI đề xuất: Tích hợp AI phân tích lỗi lặp lại, đề xuất các bước sửa chữa
tối ưu, kiểm tra lịch sử thiết bị và gợi ý lịch bảo trì định kỳ.
• 3.6. Profile – Hồ sơ cá nhân: Hiển thị thông tin kỹ thuật viên, chuyên môn kỹ thuật, chỉ số hiệu
suất SLA cá nhân và tùy chọn cập nhật thông tin.
4. Công nghệ &amp; Cấu trúc dự án
HTML5, Tailwind CSS, JavaScript (ES6 Modules), LocalStorage để lưu trữ trạng thái cục bộ và file
JSON mẫu.
5. Đặc tả biểu mẫu Cập nhật Trạng thái &amp; Xử lý Ticket
Dưới đây là cấu trúc chi tiết của form thao tác đang được triển khai trên phân hệ Kỹ thuật viên:
Thành phần Form Kiểu dữ liệu / Control Mô tả chức năng

Mã Ticket &amp; Thiết bị Readonly Text / Input Hiển thị mã định danh ticket
(VD: TK-2025-001) và tên thiết bị liên quan.

Trạng thái xử lý Dropdown (Select) Cho phép KTV chuyển đổi giữa
các trạng thái: Chờ phân công,
Đang xử lý, Chờ linh kiện, Hoàn thành.

Mức độ ưu tiên Dropdown (Select) Phân loại mức độ khẩn cấp của
sự cố: Khẩn, Cao, Trung bình,Thấp.

Ghi chú sửa chữa Textarea (Multi-line) Ghi lại chi tiết quá trình kiểm tra,
nguyên nhân và giải pháp đã thực hiện.

Checklist bảo trì Checkbox List Danh sách các bước kiểm tra
tiêu chuẩn cần hoàn thành trước khi nghiệm thu.

Figma Design: https://www.figma.com/design/ZSMpHOH5EC4JlVNlwfqSmN/Untitled?node-id=0-1&t=jnF2FcK1VlykcEsI-0

Video Demo / Reference (YouTube): https://www.youtube.com/playlist?list=PLL6sVltZu6Ck

GitHub Repository:https://github.com/haison19/CSE122_67CNTT2_GROUP15_BTL/blob/ferature/quan-ly/README.md
