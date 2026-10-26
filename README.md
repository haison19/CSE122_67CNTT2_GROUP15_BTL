# FixFlow – Hệ thống quản lý yêu cầu sửa chữa

## 1. Giới thiệu dự án

FixFlow là website mô phỏng hệ thống quản lý yêu cầu sửa chữa thiết bị. Hệ thống hỗ trợ tiếp nhận yêu cầu, phân công công việc, theo dõi quá trình sửa chữa và quản lý kết quả xử lý.

Dự án được thực hiện trong khuôn khổ bài tập lớn môn CSE122.

### 1.1. Mục tiêu dự án

- Số hóa quy trình tiếp nhận và xử lý yêu cầu sửa chữa.
- Giúp người yêu cầu theo dõi tình trạng yêu cầu của mình.
- Hỗ trợ kỹ thuật viên quản lý công việc và cập nhật tiến độ.
- Giúp quản trị viên quản lý thông tin và hoạt động của hệ thống.
- Giúp quản lý theo dõi số liệu và hiệu quả xử lý công việc.

## 2. Công nghệ sử dụng

- **HTML:** Xây dựng cấu trúc trang web.
- **CSS:** Thiết kế giao diện, bố cục và hiệu ứng.
- **JavaScript:** Xử lý sự kiện, tìm kiếm, cập nhật trạng thái và các chức năng nghiệp vụ.
- **LocalStorage:** Lưu dữ liệu trên trình duyệt nếu được sử dụng.
- **JSON:** Tổ chức dữ liệu mẫu nếu được sử dụng.

Dự án tập trung vào frontend bằng HTML, CSS và JavaScript thuần, không có backend. Vì vậy, dữ liệu được xử lý phía trình duyệt và chưa có khả năng đồng bộ thực sự giữa nhiều người dùng trên các thiết bị khác nhau.

## 3. Các vai trò trong hệ thống

FixFlow mô phỏng bốn vai trò chính:

### 3.1. Người yêu cầu

Người yêu cầu là người gửi yêu cầu sửa chữa khi thiết bị gặp sự cố.

Các chức năng chính:

- Tạo yêu cầu sửa chữa mới.
- Nhập thông tin thiết bị và mô tả lỗi.
- Theo dõi trạng thái yêu cầu.
- Xem thông tin chi tiết yêu cầu.
- Theo dõi kết quả xử lý khi yêu cầu hoàn thành.
- Xem lịch sử các yêu cầu đã gửi nếu chức năng được triển khai.

### 3.2. Kỹ thuật viên

Kỹ thuật viên là người tiếp nhận và trực tiếp thực hiện công việc sửa chữa.

Các chức năng chính:

- Xem danh sách yêu cầu đang chờ xử lý.
- Tìm kiếm và lọc Ticket.
- Bắt đầu xử lý yêu cầu.
- Theo dõi thời gian và tiến độ sửa chữa.
- Sử dụng chức năng AI đề xuất để tham khảo hướng xử lý lỗi.
- Hoàn thành yêu cầu sau khi sửa chữa.
- Tra cứu lịch sử công việc đã thực hiện.
- Xem thông báo và thông tin cá nhân nếu được triển khai.

### 3.3. Quản trị viên

Quản trị viên phụ trách quản lý thông tin và hoạt động của hệ thống.

Các chức năng chính:

- Theo dõi tình hình hoạt động của hệ thống.
- Quản lý thông tin tài khoản người dùng.
- Quản lý thông tin kỹ thuật viên.
- Theo dõi danh sách yêu cầu sửa chữa.
- Quản lý dữ liệu và trạng thái yêu cầu theo quyền được cấp.
- Theo dõi thông báo và các thông tin liên quan đến hệ thống.

### 3.4. Quản lý

Quản lý theo dõi tình hình công việc và đánh giá hiệu quả hoạt động sửa chữa.

Các chức năng chính:

- Xem tổng quan hoạt động sửa chữa.
- Theo dõi số lượng yêu cầu theo trạng thái.
- Theo dõi công việc của kỹ thuật viên.
- Xem thống kê và biểu đồ theo thời gian.
- Theo dõi tiến độ xử lý yêu cầu.
- Đánh giá tình hình hoàn thành công việc dựa trên dữ liệu thống kê.

## 4. Quy trình nghiệp vụ chính

Quy trình xử lý yêu cầu sửa chữa được mô phỏng như sau:

1. **Người yêu cầu:** Tạo Ticket và cung cấp thông tin về thiết bị, lỗi gặp phải.
2. **Tiếp nhận:** Ticket được đưa vào danh sách chờ xử lý.
3. **Kỹ thuật viên:** Xem thông tin Ticket và bắt đầu sửa chữa.
4. **Xử lý:** Kỹ thuật viên kiểm tra lỗi, thực hiện sửa chữa và có thể tham khảo AI đề xuất.
5. **Hoàn thành:** Kỹ thuật viên cập nhật kết quả và chuyển Ticket sang trạng thái hoàn thành.
6. **Lịch sử:** Ticket đã hoàn thành được lưu vào danh sách lịch sử nếu hệ thống triển khai luồng này.
7. **Quản trị viên:** Theo dõi và quản lý thông tin, dữ liệu hệ thống.
8. **Quản lý:** Theo dõi thống kê, tiến độ và hiệu quả xử lý công việc.

Quy trình trên mô tả luồng nghiệp vụ tổng quát. Việc phân công Ticket tự động hay thủ công phụ thuộc vào chức năng thực tế của dự án.

## 5. Các chức năng chính của hệ thống

### 5.1. Quản lý yêu cầu sửa chữa

- Tạo và hiển thị Ticket.
- Theo dõi thông tin thiết bị và mô tả lỗi.
- Cập nhật trạng thái xử lý.
- Tra cứu yêu cầu theo thông tin liên quan.

### 5.2. Tìm kiếm, lọc và sắp xếp

- Tìm kiếm Ticket theo từ khóa.
- Lọc danh sách theo các tiêu chí được hỗ trợ.
- Sắp xếp danh sách để thuận tiện theo dõi.

### 5.3. Theo dõi tiến độ

- Hiển thị số lượng yêu cầu theo trạng thái.
- Theo dõi các công việc đang chờ và đang xử lý.
- Hiển thị lịch sử các yêu cầu đã hoàn thành.

### 5.4. Thống kê và báo cáo

- Tổng hợp số lượng yêu cầu sửa chữa.
- Theo dõi tiến độ xử lý.
- Hiển thị biểu đồ thống kê nếu được triển khai.

### 5.5. AI đề xuất

Hỗ trợ kỹ thuật viên tham khảo hướng xử lý lỗi. Nếu chức năng sử dụng các gợi ý được lập trình sẵn bằng JavaScript, đây là tính năng mô phỏng, chưa phải hệ thống AI thực sự được kết nối với mô hình bên ngoài.

## 6. Cách chạy dự án

1. Tải hoặc sao chép mã nguồn FixFlow về máy tính.
2. Mở thư mục dự án bằng Visual Studio Code.
3. Mở file `index.html` bằng trình duyệt hoặc sử dụng tiện ích Live Server.
4. Truy cập giao diện và kiểm tra các chức năng được triển khai.

Cần giữ nguyên cấu trúc thư mục và đường dẫn các file để website hoạt động đúng.

## 7. Cấu trúc thư mục

Cấu trúc tham khảo, cần điều chỉnh theo mã nguồn thực tế:

```text
FixFlow/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── api.js
│   └── modules/
├── assets/
│   └── data/
└── README.md
```

- `index.html`: Cấu trúc giao diện chính.
- `css/`: Chứa các file CSS.
- `js/main.js`: Khởi chạy và kết nối các chức năng JavaScript.
- `js/api.js`: Xử lý dữ liệu mô phỏng nếu được sử dụng.
- `js/modules/`: Chứa các module JavaScript theo chức năng.
- `assets/data/`: Chứa dữ liệu mẫu nếu có.
- `README.md`: Giới thiệu dự án và hướng dẫn sử dụng.

## 8. Phạm vi và hạn chế

- Dự án phục vụ học tập và mô phỏng quy trình quản lý sửa chữa.
- Chưa xây dựng backend và cơ sở dữ liệu máy chủ.
- Dữ liệu LocalStorage chỉ được lưu trên trình duyệt hiện tại.
- Dữ liệu chưa được đồng bộ thực sự giữa nhiều người dùng hoặc thiết bị.
- Chức năng AI có thể chỉ sử dụng gợi ý được lập trình sẵn.
- Chức năng đăng nhập, phân quyền và quản lý tài khoản phụ thuộc vào phạm vi triển khai thực tế.

## 9. Hướng phát triển

- Hoàn thiện các chức năng cho cả bốn vai trò.
- Bổ sung kiểm tra dữ liệu và xử lý các trường hợp lỗi.
- Hoàn thiện quy trình kiểm tra lại sau sửa chữa.
- Nâng cao chức năng tìm kiếm, lọc và sắp xếp.
- Cải thiện giao diện trên máy tính và thiết bị di động.
- Có thể phát triển backend và cơ sở dữ liệu để hỗ trợ nhiều người dùng.
- Nghiên cứu tích hợp AI thực tế để hỗ trợ chẩn đoán lỗi.

## 10. Kết luận

FixFlow là dự án mô phỏng hệ thống quản lý yêu cầu sửa chữa, hướng đến việc kết nối quy trình làm việc giữa người yêu cầu, kỹ thuật viên, quản trị viên và quản lý.

Thông qua dự án, nhóm vận dụng kiến thức HTML, CSS và JavaScript để xây dựng giao diện, xử lý dữ liệu và mô phỏng quy trình nghiệp vụ trong một hệ thống quản lý sửa chữa.



* **Figma Design:** [Xem bản thiết kế trên Figma](https://www.figma.com/design/ZSMpHOH5EC4JlVNlwfqSmN/Untitled?node-id=0-1&p=f&t=wgEVbN2wAMDnNZtV-0)

