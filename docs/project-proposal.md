# PROJECT PROPOSAL — FIXFLOW

> **Tên dự án:** FixFlow – Hệ thống quản lý hàng đợi sửa chữa thiết bị  
> **Học phần:** CSE122 – Phát triển ứng dụng Web cơ bản  
> **Phiên bản tài liệu:** 1.0  
> **Công nghệ:** HTML5, CSS3, JavaScript thuần, localStorage  
> **Phạm vi triển khai:** Frontend-only, không có backend hoặc cơ sở dữ liệu máy chủ.

---

## 1. Tổng quan dự án

### 1.1. Giới thiệu

FixFlow là website hỗ trợ quản lý các yêu cầu sửa chữa thiết bị, giúp người dùng theo dõi tình trạng yêu cầu và giúp kỹ thuật viên quản lý công việc từ lúc tiếp nhận đến khi hoàn thành.

Hệ thống tập trung vào việc quản lý ticket sửa chữa, phân loại mức độ ưu tiên, theo dõi tiến độ, thực hiện checklist kiểm tra thiết bị và lưu lịch sử sửa chữa.

Bên cạnh các chức năng quản lý thông thường, FixFlow có các tính năng đề xuất hỗ trợ kỹ thuật viên lựa chọn checklist phù hợp với loại thiết bị và mô tả sự cố.

Dự án được xây dựng bằng HTML, CSS và JavaScript thuần. Dữ liệu được quản lý trên trình duyệt bằng `localStorage` nhằm mô phỏng các luồng nghiệp vụ mà không cần xây dựng backend.

### 1.2. Bối cảnh thực tế

Trong môi trường trường học, văn phòng hoặc đơn vị cung cấp dịch vụ kỹ thuật, nhiều thiết bị như máy tính, máy in, máy lạnh và router cần được kiểm tra, bảo trì hoặc sửa chữa thường xuyên.

Nếu yêu cầu sửa chữa chỉ được quản lý bằng giấy tờ, tin nhắn hoặc các danh sách rời rạc, người phụ trách có thể gặp khó khăn trong việc xác định yêu cầu nào cần xử lý trước, ai đang phụ trách, công việc đã thực hiện đến đâu và thiết bị đã từng gặp sự cố gì.

FixFlow được đề xuất nhằm mô phỏng một hệ thống quản lý tập trung, trong đó thông tin ticket, trạng thái xử lý và lịch sử sửa chữa được liên kết với nhau.

*Lưu ý: Đây là bối cảnh nghiệp vụ được sử dụng để thiết kế bài tập lớn, không phải kết quả khảo sát thực tế tại một doanh nghiệp cụ thể.*

---

## 2. Phân tích vấn đề

### 2.1. Các vấn đề cần giải quyết

| Mã | Vấn đề | Ảnh hưởng đến người dùng |
|---|---|---|
| P1 | Khó theo dõi các yêu cầu sửa chữa đang chờ tiếp nhận và mức độ ưu tiên. | Kỹ thuật viên có thể bỏ sót ticket hoặc xử lý chưa đúng thứ tự ưu tiên. |
| P2 | Trạng thái ticket không được cập nhật thống nhất giữa các màn hình. | Người dùng khó xác định ticket đang chờ, đang sửa hay đã hoàn thành. |
| P3 | Quá trình kiểm tra và sửa chữa chưa có checklist theo dõi rõ ràng. | Kỹ thuật viên có thể bỏ sót bước kiểm tra và khó đánh giá tiến độ. |
| P4 | Thông tin sửa chữa và lịch sử thiết bị khó theo dõi nếu không được lưu tập trung. | Khó tra cứu công việc đã thực hiện và thông tin xử lý trước đó. |

### 2.2. Mục tiêu giải quyết

FixFlow hướng đến việc giải quyết các vấn đề trên thông qua quản lý ticket có trạng thái rõ ràng, checklist có thể đánh dấu hoàn thành, chức năng đề xuất bước kiểm tra và lịch sử sửa chữa có thể tra cứu.

Mỗi thay đổi trạng thái cần được lưu lại để các màn hình sử dụng cùng một nguồn dữ liệu, hạn chế tình trạng một ticket xuất hiện đồng thời trong nhiều nhóm trạng thái không phù hợp.

---

## 3. Mục tiêu dự án

| Mã | Mục tiêu | Kết quả mong đợi |
|---|---|---|
| O1 | Quản lý danh sách ticket sửa chữa. | Hiển thị thông tin ticket, thiết bị và mức độ ưu tiên. |
| O2 | Hỗ trợ tiếp nhận và bắt đầu xử lý. | Ticket chuyển từ `pending` sang `in_progress`. |
| O3 | Theo dõi quá trình sửa chữa bằng checklist. | Người dùng đánh dấu từng bước và theo dõi tiến độ thực tế. |
| O4 | Đề xuất checklist theo thiết bị và sự cố. | Hiển thị các bước kiểm tra phù hợp với dữ liệu đầu vào. |
| O5 | Hoàn thành ticket theo điều kiện nghiệp vụ. | Chỉ hoàn thành khi các bước bắt buộc đã hoàn tất. |
| O6 | Quản lý lịch sử sửa chữa. | Tra cứu ticket đã hoàn thành và ghi chú liên quan. |
| O7 | Duy trì tính nhất quán của dữ liệu. | Trạng thái, checklist và ghi chú được lưu bằng `localStorage` và tồn tại sau khi tải lại trang. |

Các mục tiêu trên được sử dụng làm căn cứ đánh giá chức năng. Mục tiêu chỉ được xem là hoàn thành sau khi chức năng tương ứng đã được triển khai và kiểm thử.

---

## 4. Đối tượng sử dụng và vai trò

Để phù hợp với bài toán quản lý sửa chữa, hệ thống có thể được phân chia thành các vai trò nghiệp vụ sau.

| Vai trò | Mục tiêu | Nhiệm vụ chính |
|---|---|---|
| Người yêu cầu (Requester) | Gửi yêu cầu sửa chữa và theo dõi kết quả. | Tạo yêu cầu, cung cấp thông tin thiết bị, xem trạng thái và lịch sử yêu cầu của mình. |
| Kỹ thuật viên (Technician) | Tiếp nhận và hoàn thành công việc sửa chữa. | Xem hàng đợi, bắt đầu xử lý, thực hiện checklist, ghi chú và hoàn thành ticket. |
| Quản lý (Manager/Admin) | Theo dõi hoạt động sửa chữa. | Quản lý ticket, theo dõi mức độ ưu tiên, phân công công việc và xem thống kê. |

### Phạm vi triển khai vai trò

Các màn hình đã có trong giao diện tham khảo tập trung chủ yếu vào vai trò Kỹ thuật viên, gồm Hàng đợi, Đang sửa, Lịch sử, Checklist và Thống kê.

Hai vai trò Người yêu cầu và Quản lý là phạm vi nghiệp vụ đề xuất cho toàn hệ thống. Chỉ được xem là đã triển khai khi có màn hình, chức năng và luồng dữ liệu tương ứng trong source code.

Do dự án không có backend, việc mô phỏng nhiều vai trò trên trình duyệt không thay thế được cơ chế xác thực, phân quyền và bảo mật thực tế.

---

## 5. Phạm vi chức năng

### 5.1. Chức năng quản lý ticket

- Hiển thị danh sách ticket và thông tin cơ bản.
- Tìm kiếm ticket theo mã, tên thiết bị hoặc nội dung sự cố.
- Lọc theo trạng thái, danh mục thiết bị và mức độ ưu tiên.
- Xem thông tin chi tiết của ticket.
- Bắt đầu xử lý ticket.
- Cập nhật ghi chú sửa chữa.
- Hoàn thành ticket khi đủ điều kiện.
- Tra cứu lịch sử các ticket đã hoàn thành.

### 5.2. Chức năng checklist

- Sinh checklist đề xuất dựa trên loại thiết bị và nội dung sự cố.
- Chấp nhận hoặc từ chối checklist đề xuất.
- Tạo lại phương án đề xuất.
- Chỉnh sửa nội dung các bước.
- Tự tạo checklist thủ công.
- Thêm bước kiểm tra mới.
- Đánh dấu từng bước đã hoàn thành.
- Tự động cập nhật số bước và phần trăm tiến độ.

### 5.3. Chức năng hỗ trợ khác

- Hiển thị mức độ ưu tiên và thời gian SLA theo dữ liệu mẫu.
- Hiển thị tiến độ xử lý.
- Lưu ghi chú và lịch sử sửa chữa.
- Duy trì dữ liệu khi tải lại trang.
- Hiển thị thông báo khi thao tác thành công hoặc thất bại.
- Hỗ trợ giao diện trên máy tính, máy tính bảng và điện thoại.

Các chức năng phải được kiểm tra trên giao diện thực tế trước khi được xác nhận là hoàn thành.

---

## 6. Luồng nghiệp vụ chính

### 6.1. Luồng xử lý ticket

```text
Hàng đợi
   |
   v
Chọn ticket cần xử lý
   |
   v
Xem thông tin chi tiết
   |
   v
Nhấn "Bắt đầu xử lý"
   |
   v
Cập nhật trạng thái: in_progress
   |
   v
Chuyển sang trang Đang sửa
   |
   v
Kiểm tra và thực hiện checklist
   |
   v
Cập nhật ghi chú và tiến độ
   |
   v
Tất cả bước bắt buộc đã hoàn thành?
   |
   +---- Chưa ----> Tiếp tục xử lý checklist
   |
   +---- Rồi -----> Nhấn "Hoàn thành"
                         |
                         v
                Cập nhật trạng thái:
                    completed
                         |
                         v
                 Lưu thông tin xử lý
                         |
                         v
                   Chuyển sang
                     Lịch sử
```

### 6.2. Quy tắc nghiệp vụ

1. Mỗi ticket phải có mã định danh riêng.
2. Thao tác bắt đầu xử lý phải áp dụng cho đúng ticket được chọn.
3. Ticket đang xử lý phải có trạng thái `in_progress`.
4. Checklist và ghi chú phải gắn với đúng ticket, không bị lẫn giữa các ticket.
5. Không cho phép hoàn thành ticket khi còn bước checklist bắt buộc chưa hoàn thành.
6. Khi hoàn thành, ticket chuyển sang `completed` và xuất hiện trong Lịch sử.
7. Ticket đã hoàn thành không được hiển thị như một ticket đang chờ nhận hoặc đang xử lý.
8. Không tạo thêm bản ghi lịch sử trùng lặp khi tải lại trang hoặc thực hiện thao tác lặp.
9. Các thao tác không hợp lệ phải có thông báo phù hợp.
10. Dữ liệu phải được cập nhật nhất quán giữa các trang.

---

## 7. Thực thể dữ liệu

### 7.1. Ticket

Lưu thông tin chính của yêu cầu sửa chữa.

| Thuộc tính | Ý nghĩa |
|---|---|
| `id` | Mã ticket duy nhất. |
| `title` | Tiêu đề sự cố. |
| `description` | Mô tả chi tiết sự cố. |
| `deviceId` | Mã thiết bị liên quan. |
| `category` | Danh mục thiết bị. |
| `priority` | Mức độ ưu tiên. |
| `status` | Trạng thái ticket. |
| `requesterId` | Người tạo yêu cầu. |
| `technicianId` | Kỹ thuật viên phụ trách. |
| `createdAt` | Thời điểm tạo ticket. |
| `startedAt` | Thời điểm bắt đầu xử lý. |
| `completedAt` | Thời điểm hoàn thành. |
| `repairNote` | Ghi chú sửa chữa. |
| `checklist` | Danh sách các bước kiểm tra. |

### 7.2. Device

Lưu thông tin thiết bị được yêu cầu sửa chữa.

| Thuộc tính | Ý nghĩa |
|---|---|
| `id` | Mã thiết bị. |
| `name` | Tên thiết bị. |
| `type` | Loại thiết bị. |
| `location` | Vị trí lắp đặt. |
| `status` | Tình trạng thiết bị. |

### 7.3. Checklist Item

Lưu từng bước kiểm tra trong quá trình sửa chữa.

| Thuộc tính | Ý nghĩa |
|---|---|
| `id` | Mã bước kiểm tra. |
| `ticketId` | Mã ticket sở hữu bước kiểm tra. |
| `content` | Nội dung bước kiểm tra. |
| `completed` | Đã hoàn thành hay chưa. |
| `source` | Nguồn tạo bước: đề xuất hoặc thủ công. |
| `required` | Bước có bắt buộc hoàn thành hay không. |

### 7.4. Repair History

Lưu thông tin tổng kết quá trình sửa chữa.

| Thuộc tính | Ý nghĩa |
|---|---|
| `id` | Mã bản ghi lịch sử. |
| `ticketId` | Ticket liên quan. |
| `technicianId` | Kỹ thuật viên thực hiện. |
| `repairNote` | Nội dung xử lý. |
| `completedAt` | Thời điểm hoàn thành. |

Mỗi ticket chỉ có một bản ghi tổng kết hoàn thành chính thức. Nếu cần lưu nhiều lần thay đổi trong quá trình xử lý, có thể bổ sung thực thể nhật ký hoạt động riêng.

### 7.5. Quan hệ giữa các thực thể

- Một người yêu cầu có thể tạo nhiều ticket.
- Một thiết bị có thể phát sinh nhiều ticket theo thời gian.
- Một ticket có thể có nhiều bước checklist.
- Một kỹ thuật viên có thể xử lý nhiều ticket.
- Một ticket đã hoàn thành có một bản ghi tổng kết lịch sử chính thức.

Các quan hệ này được mô phỏng bằng mã định danh trong các đối tượng JavaScript. Chúng không phải quan hệ khóa ngoại của cơ sở dữ liệu thực tế.

---

## 8. Vòng đời trạng thái ticket

### 8.1. Danh sách trạng thái

| Trạng thái | Mã | Ý nghĩa |
|---|---|---|
| Chờ nhận | `pending` | Ticket chưa được kỹ thuật viên bắt đầu xử lý. |
| Đang xử lý | `in_progress` | Ticket đã được tiếp nhận và đang sửa chữa. |
| Hoàn thành | `completed` | Ticket đã hoàn tất các bước bắt buộc. |
| Từ chối | `rejected` | Ticket bị từ chối tiếp nhận theo quy tắc nghiệp vụ. |
| Đã hủy | `cancelled` | Ticket đã bị hủy theo quy tắc nghiệp vụ. |

### 8.2. Ma trận chuyển trạng thái

| Trạng thái hiện tại | Trạng thái tiếp theo | Điều kiện |
|---|---|---|
| `pending` | `in_progress` | Kỹ thuật viên nhấn Bắt đầu xử lý. |
| `pending` | `rejected` | Kỹ thuật viên từ chối và cung cấp lý do phù hợp. |
| `pending` | `cancelled` | Người có quyền thực hiện thao tác hủy. |
| `in_progress` | `completed` | Tất cả bước checklist bắt buộc đã hoàn thành. |
| `in_progress` | `cancelled` | Có lý do hủy hợp lệ và người dùng được phép thực hiện. |
| `completed` | Không chuyển trạng thái | Không cho hoàn thành lặp lại hoặc tiếp tục sửa như ticket đang mở. |
| `rejected` | Không chuyển trạng thái mặc định | Muốn xử lý lại cần có quy tắc mở lại ticket rõ ràng. |
| `cancelled` | Không chuyển trạng thái mặc định | Muốn xử lý lại cần có quy tắc mở lại ticket rõ ràng. |

Trong phạm vi chức năng hiện tại, luồng chính cần ưu tiên hoàn thiện là:

`pending → in_progress → completed`

Các trạng thái từ chối và hủy cần được triển khai theo cùng quy tắc dữ liệu nếu xuất hiện trong giao diện.

---

## 9. Tính năng AI đề xuất

### 9.1. Định hướng

FixFlow sử dụng các quy tắc JavaScript và bộ checklist mẫu để mô phỏng tính năng hỗ trợ kỹ thuật viên. Hệ thống lựa chọn nội dung đề xuất dựa trên loại thiết bị và mô tả sự cố.

Phiên bản frontend-only không gọi mô hình AI bên ngoài. Vì vậy, các kết quả được gọi là **đề xuất mô phỏng theo quy tắc**, không phải kết quả suy luận của mô hình AI thực sự.

### 9.2. Các tính năng đề xuất

| Mã | Tính năng | Đầu vào | Kết quả |
|---|---|---|---|
| AI-01 | Đề xuất checklist sửa chữa | Loại thiết bị và mô tả sự cố. | Danh sách bước kiểm tra phù hợp. |
| AI-02 | Cảnh báo nguy cơ vi phạm SLA | Thời hạn SLA, thời gian còn lại, mức độ ưu tiên và trạng thái ticket. | Mức cảnh báo và hành động nên ưu tiên. |
| AI-03 | Hỗ trợ tổng kết sửa chữa | Ghi chú kỹ thuật viên, checklist đã hoàn thành và thông tin ticket. | Bản tổng kết dạng mẫu để kỹ thuật viên xem và chỉnh sửa. |

AI-02 có thể được mô phỏng bằng các ngưỡng thời gian rõ ràng. AI-03 có thể sử dụng mẫu câu và dữ liệu đã nhập để tạo bản tổng kết theo quy tắc. Không được tự bịa kết quả chẩn đoán hoặc khẳng định nội dung chưa được kiểm chứng.

Ba tính năng trên là định hướng đề xuất để đáp ứng yêu cầu AI UX ở cấp dự án. Cần xác nhận từng tính năng đã được triển khai đầy đủ trước khi đưa vào danh sách tính năng hoàn thành.

### 9.3. Sáu bước trải nghiệm cho mỗi tính năng

Mỗi tính năng đề xuất cần có đủ các bước:

1. **Input:** Người dùng cung cấp hoặc chọn dữ liệu đầu vào.
2. **Processing:** Giao diện hiển thị trạng thái đang phân tích hoặc tạo đề xuất.
3. **Output:** Hiển thị kết quả dưới dạng checklist, cảnh báo hoặc bản tổng kết.
4. **Explainability:** Giải thích quy tắc, dữ liệu hoặc điều kiện dẫn đến kết quả.
5. **User Control:** Cho phép người dùng chấp nhận, chỉnh sửa, từ chối hoặc tạo lại.
6. **Save/Apply:** Khi chấp nhận hoặc lưu, kết quả được áp dụng vào dữ liệu ticket thực tế.

### 9.4. Xử lý trường hợp thiếu dữ liệu

Nếu mô tả sự cố trống hoặc loại thiết bị không được nhận diện, hệ thống phải:

- Hiển thị cảnh báo rằng dữ liệu chưa đủ để tạo đề xuất cụ thể.
- Yêu cầu người dùng bổ sung thông tin khi cần.
- Cung cấp checklist chung nếu phù hợp.
- Không tự nhận rằng đã xác định chính xác nguyên nhân sự cố.
- Cho phép người dùng chỉnh sửa hoặc từ chối kết quả đề xuất.

Đối với các kết quả chưa chắc chắn, giao diện cần giải thích giới hạn của đề xuất thay vì chỉ hiển thị một tỷ lệ tin cậy giả định.

---

## 10. Công nghệ và kiến trúc

### 10.1. Công nghệ

| Công nghệ | Vai trò |
|---|---|
| HTML5 | Xây dựng cấu trúc và thành phần giao diện. |
| CSS3 | Định dạng giao diện, bố cục và Responsive. |
| JavaScript | Xử lý sự kiện, nghiệp vụ, kiểm tra dữ liệu và cập nhật DOM. |
| localStorage | Lưu dữ liệu trên trình duyệt. |
| JSON | Biểu diễn dữ liệu ticket, thiết bị và checklist. |
| Git/GitHub | Quản lý phiên bản mã nguồn theo quy trình của nhóm. |

### 10.2. Cách lưu trữ dữ liệu

Dữ liệu được lưu trong `localStorage` dưới dạng chuỗi JSON thông qua `JSON.stringify()` và được đọc lại bằng `JSON.parse()`.

Các thao tác chính bao gồm:

- Đọc dữ liệu khi mở trang.
- Khởi tạo dữ liệu mẫu nếu chưa có dữ liệu lưu trữ.
- Cập nhật đối tượng ticket khi thay đổi trạng thái.
- Lưu checklist và ghi chú sau khi chỉnh sửa.
- Đọc lại dữ liệu khi chuyển trang.
- Cập nhật danh sách hiển thị dựa trên trạng thái mới.

Không được ghi đè dữ liệu đã lưu bằng dữ liệu mẫu mỗi khi tải trang.

### 10.3. Giới hạn kiến trúc

Vì không có backend hoặc database:

- Dữ liệu chỉ được lưu trong trình duyệt tương ứng.
- Các trình duyệt hoặc thiết bị khác nhau không tự động đồng bộ dữ liệu.
- Người dùng có thể mất dữ liệu khi xóa dữ liệu website của trình duyệt.
- `localStorage` không cung cấp cơ chế xác thực hoặc phân quyền an toàn.
- Dữ liệu mẫu chỉ phục vụ mô phỏng và kiểm thử.

Đây là những giới hạn được chấp nhận trong phạm vi bài tập frontend, không phải đặc điểm của một hệ thống sửa chữa triển khai thực tế.

---

## 11. Yêu cầu giao diện và trải nghiệm người dùng

### 11.1. Định hướng thiết kế

Giao diện FixFlow sử dụng thanh điều hướng xanh đậm, nền nội dung sáng, thẻ thông tin bo góc và nút thao tác màu xanh dương. Khu vực checklist đề xuất được nhấn mạnh bằng màu tím.

Các trang cần thống nhất về màu sắc, kiểu chữ, khoảng cách, cách hiển thị trạng thái và phong cách nút bấm.

### 11.2. Responsive

Kiểm tra tối thiểu trên các kích thước:

- Điện thoại: 320–375px.
- Máy tính bảng: 768px.
- Máy tính: từ 1024px trở lên.
- Phóng to trình duyệt 200%.

Trên màn hình nhỏ, các cột ticket có thể chuyển thành bố cục dọc. Khu vực chi tiết ticket phải có thể truy cập mà không bị che khuất.

### 11.3. Khả năng tiếp cận

- Sử dụng phần tử HTML có ngữ nghĩa phù hợp.
- Các ô nhập liệu cần có nhãn.
- Nút bấm có tên dễ hiểu.
- Hiển thị trạng thái bằng chữ và màu sắc, không chỉ bằng màu.
- Đảm bảo có viền focus khi điều hướng bằng bàn phím.
- Các hộp thoại cần hỗ trợ đóng bằng phím Esc khi phù hợp.
- Thông báo lỗi phải nêu rõ vấn đề và cách xử lý.

### 11.4. Trạng thái giao diện

Các trang cần xem xét đầy đủ:

- Normal: Có dữ liệu và hoạt động bình thường.
- Loading: Đang tải hoặc chuẩn bị dữ liệu.
- Empty: Không có ticket hoặc không có kết quả phù hợp.
- Error: Có lỗi khi đọc hoặc xử lý dữ liệu.

Loading có thể được mô phỏng bằng JavaScript để minh họa trải nghiệm, nhưng phải phân biệt rõ mô phỏng độ trễ với việc tải dữ liệu từ máy chủ thực tế.

---

## 12. Phạm vi kiểm thử và tiêu chí nghiệm thu

### 12.1. Tiêu chí nghiệm thu nghiệp vụ

| Mã | Điều kiện nghiệm thu |
|---|---|
| AC-01 | Bắt đầu xử lý ticket A phải mở đúng ticket A trên trang Đang sửa. |
| AC-02 | Trạng thái ticket được cập nhật và lưu đúng. |
| AC-03 | Checklist được lưu theo từng ticket và không bị lẫn dữ liệu. |
| AC-04 | Tiến độ được tính theo số bước đã hoàn thành thực tế. |
| AC-05 | Không cho hoàn thành khi còn bước checklist bắt buộc chưa hoàn thành. |
| AC-06 | Khi hoàn thành, ticket xuất hiện trong Lịch sử. |
| AC-07 | Ticket hoàn thành không còn nằm trong nhóm Chờ nhận hoặc Đang xử lý. |
| AC-08 | Không tạo lịch sử hoàn thành trùng lặp. |
| AC-09 | Dữ liệu vẫn chính xác sau khi tải lại trang. |
| AC-10 | Tìm kiếm và lọc trả về kết quả đúng. |
| AC-11 | Đề xuất checklist có thể được chấp nhận, chỉnh sửa, từ chối và áp dụng. |
| AC-12 | Các lỗi hoặc trường hợp thiếu dữ liệu được thông báo rõ ràng. |

### 12.2. Kiểm thử kỹ thuật và giao diện

- Kiểm tra Console để phát hiện lỗi JavaScript.
- Kiểm tra các đường dẫn giữa những trang HTML.
- Kiểm tra dữ liệu trước và sau thao tác.
- Kiểm tra F5 và khả năng duy trì dữ liệu.
- Kiểm tra nhiều ticket liên tiếp.
- Kiểm tra mã ticket không tồn tại.
- Kiểm tra checklist rỗng và trường hợp nhập dữ liệu không hợp lệ.
- Kiểm tra Responsive, bàn phím và trạng thái giao diện.

Kết quả kiểm thử phải được ghi nhận bằng `PASS`, `FAIL` hoặc `CHƯA KIỂM THỬ`. Chỉ đánh dấu PASS khi đã thực hiện hoặc xác minh thực tế.

---

## 13. Tài liệu và sản phẩm bàn giao

Các sản phẩm bàn giao dự kiến gồm:

- Source code HTML, CSS và JavaScript.
- `README.md`: Hướng dẫn cài đặt, chạy và sử dụng.
- `docs/project-proposal.md`: Tài liệu đề xuất và phân tích dự án.
- `docs/screen-inventory.md`: Bảng kiểm kê màn hình theo vai trò và chức năng.
- Thiết kế Wireframe và Mockup trên Figma hoặc Canva.
- Tài liệu kiểm thử chức năng.
- `docs/ai-usage-report.md`: Báo cáo việc sử dụng AI và phần mã nguồn đã được hỗ trợ.
- Lịch sử Git, các nhánh phát triển và Pull Request theo quy trình nhóm.
- Video OBS minh chứng quá trình thực hiện và giải thích code theo yêu cầu học phần.
- Bản triển khai để kiểm tra sản phẩm nếu phạm vi bài tập yêu cầu.

Các sản phẩm trên được xem là hoàn thành khi đã có tệp hoặc minh chứng thực tế tương ứng.

---

## 14. Giới hạn và rủi ro

| Rủi ro | Biện pháp xử lý |
|---|---|
| Dữ liệu giữa các trang không đồng bộ | Dùng chung quy tắc đọc và ghi `localStorage`, kiểm tra sau mỗi thao tác. |
| Dữ liệu bị ghi đè bởi dữ liệu mẫu | Chỉ khởi tạo dữ liệu mẫu khi chưa tồn tại dữ liệu hợp lệ. |
| Checklist không phù hợp với sự cố | Dùng quy tắc rõ ràng, cung cấp checklist chung và cho phép chỉnh sửa thủ công. |
| Tiến độ hiển thị sai | Tính từ số bước hoàn thành thực tế thay vì dùng giá trị cố định. |
| Lịch sử có bản ghi trùng | Dùng mã ticket để kiểm soát việc tạo bản ghi hoàn thành. |
| Người dùng hiểu nhầm AI mô phỏng là AI thực | Công khai rằng đề xuất được tạo bằng quy tắc JavaScript. |
| Mất dữ liệu trình duyệt | Thông báo giới hạn của localStorage và hướng dẫn xuất dữ liệu nếu chức năng này được triển khai. |
| Giao diện không phù hợp với màn hình nhỏ | Kiểm tra Responsive và điều chỉnh bố cục. |

---

## 15. Kết luận

FixFlow hướng đến việc xây dựng một ứng dụng web quản lý hàng đợi sửa chữa thiết bị với quy trình nghiệp vụ rõ ràng, dữ liệu nhất quán và giao diện dễ sử dụng.

Trọng tâm của dự án là hoàn thiện luồng từ tiếp nhận ticket, xử lý bằng checklist đến hoàn thành và tra cứu lịch sử. Các tính năng đề xuất hỗ trợ kỹ thuật viên được triển khai theo hướng đơn giản, có giải thích và cho phép người dùng kiểm soát kết quả.

Với phạm vi HTML, CSS và JavaScript thuần, dự án ưu tiên khả năng hiểu, kiểm thử và giải thích mã nguồn. Những giới hạn của việc lưu trữ trên trình duyệt và sử dụng AI mô phỏng được công khai để bảo đảm tính trung thực của sản phẩm.

**Nguyên tắc hoàn thành:** Mọi chức năng được mô tả là đã triển khai phải có mã nguồn tương ứng, hoạt động trên giao diện và có kết quả kiểm thử xác minh được.
