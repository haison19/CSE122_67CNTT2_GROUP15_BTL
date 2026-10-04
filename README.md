BTL-15 – FixFlow – Điều phối yêu cầu bảo trì thiết bị
Học phần: PHÁT TRIỂN ỨNG DỤNG WEB CƠ BẢN – CSE122
Nhóm thực hiện: 3 sinh viên
Loại sản phẩm: Sản phẩm Web Frontend (nguyên mẫu) có nhiều vai trò, CRUD, responsive, tương tác JavaScript và trải nghiệm AI
Nguyên tắc minh chứng: Mỗi giao diện thực tế đã được duyệt trong bảng kiểm kê màn hình = 1 video OBS có mặt sinh viên + commit/PR GitHub tương ứng.
1. Lĩnh vực
Bảo trì kỹ thuật / Field Service
2. Tóm tắt sản phẩm
FixFlow – Điều phối yêu cầu bảo trì thiết bị là một sản phẩm Frontend giải quyết bài toán thực tế trong lĩnh vực Bảo trì kỹ thuật / Field Service, được thiết kế như một mini-product có nhiều role, nhiều luồng nghiệp vụ và các tính năng AI có thể mô phỏng ngay ở phía Frontend.
3. Ngữ cảnh
Yêu cầu sửa chữa trong trường học/doanh nghiệp thường gửi qua điện thoại hoặc chat, thiếu lịch sử và SLA.
4. Phát biểu vấn đề
P1. Ticket thiếu thông tin chuẩn.
P2. Khó phân công đúng kỹ thuật viên.
P3. Người gửi không biết trạng thái.
P4. Thiết bị lỗi lặp lại khó nhận biết.
5. Mục tiêu
O1. Biến bài toán thực tế thành một sản phẩm Frontend có hành trình người dùng rõ ràng.
O2. Thiết kế đầy đủ giao diện cho từng vai trò, bảo đảm mỗi vai trò có ít nhất 3 màn hình.
O3. Thể hiện các thao tác CRUD hoặc trạng thái nghiệp vụ phù hợp thay vì CRUD hình thức.
O4. Sử dụng JavaScript/DOM cho tìm kiếm, lọc, kiểm tra hợp lệ, cửa sổ bật, thẻ, trạng thái và kết xuất dữ liệu.
O5. Sử dụng JSON giả lập / LocalStorage / MockAPI / API công khai khi phù hợp.
O6. Thiết kế ít nhất 3 trải nghiệm AI có thể mô phỏng được ở Frontend.
O7. Tổ chức làm việc nhóm bằng Trello/Jira/Notion và Git/GitHub theo nhánh + yêu cầu hợp nhất.
6. Các vai trò
Vai trò
Trách nhiệm chính
Người yêu cầu
Tạo và theo dõi ticket
Kỹ thuật viên
Nhận và xử lý ticket
Quản lý bảo trì
Phân công và theo dõi sla
Quản trị viên
Quản lý thiết bị và taxonomy

7. Hành trình người dùng tổng quát
Khám phá / đăng nhập
↓
Thực hiện nghiệp vụ chính theo vai trò
↓
Xem trạng thái / dữ liệu / phản hồi
↓
AI hỗ trợ phân tích hoặc gợi ý
↓
Người dùng Chấp nhận / Sửa / Từ chối / Lưu
↓
Vai trò vận hành duyệt / xử lý
↓
Bảng điều khiển / báo cáo / hoàn tất


BÁO CÁO CHI TIẾT SẢN PHẨM BÀN GIAO & NỘI DUNG ĐỀ TÀI BTL-15
A. DANH SÁCH BÀN GIAO SẢN PHẨM (DELIVERABLES)
Báo cáo đề tài (PDF): Đã biên soạn đầy đủ Ngữ cảnh, Phát biểu vấn đề, Mục tiêu, Vai trò, Luồng hành trình người dùng, Bảng kiểm kê màn hình và tính năng AI.
Bản mô phỏng Figma/Canva: Đường liên kết mô phỏng prototype cho toàn bộ các màn hình + Bộ ảnh export đầy đủ.
Mã nguồn giao diện Frontend: Repository GitHub chung chứa toàn bộ mã nguồn HTML/CSS/JS responsive cho 4 vai trò.
Dữ liệu Mock / API: File JSON / LocalStorage / MockAPI được tích hợp trực tiếp trong kho mã nguồn.
Bảng quản lý công việc (Task Board): Bảng Trello/Jira/Notion gồm đủ 5 cột (To Do, In Progress, Review, Done, Verified), gắn tag sinh viên và liên kết commit/PR.
Video OBS minh chứng: Mỗi màn hình thực tế có 1 video OBS quay góc mặt sinh viên + thao tác giao diện.
README & Khai báo AI: Đặt tại thư mục gốc repository tuân thủ mẫu Phụ lục E và Phụ lục F.
B. BẢNG KIỂM KÊ MÀN HÌNH THEO VAI TRÒ (SCREEN INVENTORY)
STT
Vai trò
Tên màn hình
Thao tác chính / Tính năng CRUD / Tương tác DOM
1
Người yêu cầu
Màn hình Tạo Ticket
Form nhập thông tin hỏng hóc, đính kèm ảnh, chọn vị trí. Tích hợp AI gợi ý phân loại sự cố & độ ưu tiên.
2
Người yêu cầu
Danh sách Ticket cá nhân
Bộ lọc tìm kiếm, phân trang, lọc theo trạng thái ticket (Mới, Đang xử lý, Hoàn thành).
3
Người yêu cầu
Chi tiết & Tiến độ Ticket
Timeline thời gian thực hiển thị tiến độ sửa chữa, nút nghiệm thu và đánh giá 5 sao.
4
Kỹ thuật viên
Bảng công việc (My Tasks)
Danh sách ticket được giao, sắp xếp theo độ ưu tiên SLA, tìm kiếm nhanh theo mã ticket.
5
Kỹ thuật viên
Cập nhật tiến độ xử lý
Form ghi chú kỹ thuật, đính kèm ảnh hoàn thành, cập nhật trạng thái "Đang xử lý" -> "Hoàn thành".
6
Kỹ thuật viên
Báo cáo vật tư & Hiệu suất
Thống kê số lượng ticket đã xử lý, thời gian trung bình, danh sách vật tư đã thay thế.
7
Quản lý bảo trì
Bảng điều phối (Dispatch Dashboard)
Xem toàn bộ ticket mới, chuyển trạng thái, mở Modal phân công KTV với AI gợi ý.
8
Quản lý bảo trì
Giám sát SLA & Cảnh báo
Theo dõi đồng hồ đếm ngược SLA, cảnh báo các ticket sắp quá hạn hoặc vi phạm cam kết.
9
Quản lý bảo trì
Báo cáo & Phân tích AI
Thống kê sự cố theo phòng ban, AI quét cảnh báo các thiết bị bị lỗi lặp lại nhiều lần.
10
Quản trị viên
Quản lý thiết bị (Asset CRUD)
Thêm mới, chỉnh sửa, xóa/vô hiệu hóa thiết bị, xuất dữ liệu JSON/CSV.
11
Quản trị viên
Cấu hình Taxonomy & SLA
Thiết lập danh mục sự cố (Điện, IT, Mạng) và thời gian SLA tối đa cho từng mức độ.
12
Quản trị viên
Quản lý người dùng & Phân quyền
Danh sách người dùng, thay đổi vai trò (Requester, Tech, Manager, Admin).

C. MÔ PHỎNG 3 TÍNH NĂNG AI TRÊN FRONTEND
