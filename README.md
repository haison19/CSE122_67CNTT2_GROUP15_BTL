# FixFlow · Phân hệ Người yêu cầu

Website quản lý yêu cầu bảo trì thiết bị (đồ án CSE122). Đây là phân hệ **Người yêu cầu**:
tạo ticket, theo dõi trạng thái, xem SLA, bình luận, đánh giá, đọc thông báo, hồ sơ và cài đặt.

Toàn bộ chạy **chỉ trên trình duyệt** — không có máy chủ, không có cơ sở dữ liệu, không dùng
framework hay build tool.

---

## 1. Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Khung trang | HTML5 |
| Giao diện | CSS3 (custom properties, Flexbox, Grid, media query) |
| Logic | JavaScript thuần (ES Modules, ES2020 `async/await`) |
| Dữ liệu mẫu | JSON tĩnh (`assets/data/*.json`) |
| Lưu trữ | LocalStorage của trình duyệt |

**Không có:** backend, Node.js server, React/Vue/jQuery, Tailwind/Bootstrap, npm/bundler.

File `js/api.js` **không phải API mạng**. Tên "api" theo nghĩa *lớp giao tiếp dữ liệu*: mọi module
gọi dữ liệu qua file này, không tự đọc LocalStorage hay tự fetch JSON. Nhờ đó sau này thay bằng
API thật thì chỉ sửa một file.

---

## 2. Cấu trúc thư mục

```
.
├── index.html                  Trang Tổng quan
├── tao-ticket.html             Trang Tạo Ticket
├── ticket-cua-toi.html         Trang danh sách Ticket của tôi
├── chi-tiet-ticket.html        Trang Chi tiết ticket (?id=TK-...)
├── thong-bao.html              Trang Thông báo (?loai=...)
├── ho-so.html                  Trang Hồ sơ cá nhân (?tab=...)
├── cai-dat.html                Trang Cài đặt
├── README.md
├── css/
│   ├── style.css               Giao diện dùng chung + biến màu + chủ đề tối
│   └── responsive.css          Toàn bộ media query và kiểu khi in
├── js/
│   ├── main.js                 Bộ khởi động (bootstrap) — route theo data-trang
│   ├── api.js                  Lớp dữ liệu: JSON mẫu + LocalStorage
│   └── modules/
│       ├── storage.js          Đọc/ghi/xóa key LocalStorage, kiểm tra dữ liệu hỏng
│       ├── utils.js            Hằng số, định dạng ngày/SLA, thông báo nhỏ
│       ├── layout.js           Thanh bên, thanh trên, hộp thoại, số thông báo chưa đọc
│       ├── theme.js            Áp chủ đề sáng/tối/hệ thống và cỡ chữ
│       ├── search.js           Lọc danh sách ticket theo từ khóa
│       ├── dashboard.js        Trang Tổng quan
│       ├── ticket-form.js      Form tạo ticket + ảnh đính kèm
│       ├── ai-suggestion.js    Mô phỏng phân loại sự cố bằng từ khóa
│       ├── ticket-list.js      Danh sách: bộ lọc, tab, phân trang
│       ├── ticket-detail.js    Chi tiết: sửa, hủy, bình luận, đánh giá, in
│       ├── notifications.js    Trang Thông báo: tab lọc + khung chi tiết
│       ├── profile.js          Trang Hồ sơ: 3 tab, ảnh đại diện
│       └── settings.js         Trang Cài đặt: lưu chủ đề, toggle, đặt lại dữ liệu
└── assets/
    └── data/
        ├── tickets.json        12 ticket mẫu
        ├── thong-bao-mau.json  5 thông báo mẫu
        └── technicians.json    Danh sách kỹ thuật viên + chuyên môn
```

---

## 3. Luồng dữ liệu

```
  HTML (data-trang, id các ô nhập)
        │
        ▼
  main.js ──── gọi ────► api.js ──── đọc/ghi ────► LocalStorage
        │                    ▲                          (4 key fixflow_nguoi_yeu_cau_*)
        │                    │
        │                    └──── fetch ─── assets/data/*.json  (chỉ khi trống)
        ▼
  js/modules/*.js ── dùng ──► utils.js / storage.js / theme.js / search.js
        │
        └──────── vẽ lại DOM (bảng, thẻ, biểu mẫu) ────────┘
```

Chi tiết một lượt tạo ticket:

1. `main.js` đọc JSON mẫu qua `api.js` (lần đầu chỉ) → lưu vào LocalStorage.
2. Người dùng nhập form → `ticket-form.js` gọi `ai-suggestion.js` gợi ý danh mục.
3. Bấm "Chấp nhận" → `ticket-form.js` gọi `api.js.themTicket()`.
4. `api.js` ghi qua `storage.js.ghi()` → `localStorage.setItem(...)`.
5. Trang khác (Tổng quan, Ticket của tôi) đọc lại bằng `api.js.layDanhSachTicket()`.

**Không module nào tự gọi `localStorage` trực tiếp** — tất cả đi qua `api.js` → `storage.js`.

---

## 4. Khóa LocalStorage

| Khóa | Nội dung |
| --- | --- |
| `fixflow_nguoi_yeu_cau_tickets_v1` | Mảng ticket của phân hệ Người yêu cầu |
| `fixflow_nguoi_yeu_cau_thong_bao_v1` | Mảng thông báo (`loai`: ticket / sla / he-thong) |
| `fixflow_nguoi_yeu_cau_ho_so_v1` | Hồ sơ: tên, email, mã nhân viên, SĐT, phòng ban, ảnh |
| `fixflow_nguoi_yeu_cau_cai_dat_v1` | Cài đặt: chủ đề, cỡ chữ, tần suất, các toggle |

Các khóa đều có tiền tố `fixflow_nguoi_yeu_cau_` để **không ghi đè dữ liệu của phân hệ khác**
trong cùng trình duyệt. Nút "Đặt lại dữ liệu" chỉ xóa đúng 2 khóa ticket và thông báo của phân hệ
này, không đụng tới khóa `fixflow.unified.*` hay `fixflow.hangDoi` của thành viên khác.

---

## 5. Cách chạy

ES Modules bị trình duyệt chặn khi mở bằng `file://`, vì vậy **phải chạy qua máy chủ tĩnh**.

**Cách 1 — Live Server (khuyến nghị)**
1. Mở thư mục dự án trong VS Code.
2. Cài extension **Live Server**, bấm **Go Live**.
3. Vào `http://127.0.0.1:5500/index.html`.

**Cách 2 — Python** (nếu không có VS Code)
```bash
cd "duong/dan/thu-muc-project"
python -m http.server 8000
# mở http://127.0.0.1:8000/index.html
```

**Nếu mở trực tiếp bằng đúp chuột (`file://`)**: trang vẫn chạy, nhưng dữ liệu mẫu JSON không nạp
được (fetch bị chặn). Console sẽ báo rõ: phải chạy qua máy chủ tĩnh. Khi đó danh sách trống, muốn
dùng thử thì bấm "Đặt lại dữ liệu" ở trang Cài đặt sau khi đã chạy đúng cách.

**Dữ liệu mẫu không bị ghi đè**: `api.js` chỉ nạp JSON khi chưa có dữ liệu trong LocalStorage.
Tải lại trang nhiều lần vẫn giữ nguyên ticket đã tạo. Muốn quay về trạng thái ban đầu:
**Cài đặt → Đặt lại dữ liệu** (có hộp thoại xác nhận vì hành động không hoàn tác được).

---

## 6. Chức năng đã kiểm thử

Kiểm thử thủ công trên trình duyệt qua máy chủ tĩnh (`python -m http.server`), console không lỗi:

- [x] Nạp dữ liệu mẫu từ JSON: 12 ticket, 5 thông báo; tải lại không nhân bản dữ liệu.
- [x] Tạo ticket: chặn form trống (4 thông báo lỗi + focus lỗi đầu tiên), chọn mức độ ưu tiên,
      kéo-thả/chọn ảnh PNG-JPG (chặn sai định dạng, chặn ảnh > 1,5 MB), phân loại mô phỏng,
      4 nhánh Chấp nhận / Sửa / Từ chối / Tạo lại, mã ticket tự sinh không trùng (đã tạo thật `TK-2026-013`, `TK-2026-014`).
- [x] Danh sách: 8 dòng/trang, phân trang, bộ lọc từ khóa + trạng thái + mức độ + thời gian,
      3 tab đếm số liệu, nút "Đặt lại", ô "Không tìm thấy ticket phù hợp" khi lọc hết.
- [x] Chi tiết: sửa tiêu đề/mô tả/thiết bị/vị trí/mức độ và giới hạn SLA tính lại theo mức độ mới,
      bình luận, đánh giá sao (chỉ mở khi ticket **Hoàn thành**), hủy kèm lý do bắt buộc, nút in.
- [x] Thông báo: 5 tab lọc theo loại, khung chi tiết bên phải kèm link mở ticket,
      "Đánh dấu đã đọc" cập nhật số ở thanh bên và thanh trên.
- [x] Hồ sơ: lưu thông tin, ảnh đại diện (PNG/JPG ≤ 1,5 MB), kiểm tra email, tab Mật khẩu mô phỏng,
      tab Hoạt động lấy từ thông báo, tên sau khi lưu hiển thị ngay ở thanh trên mọi trang.
- [x] Cài đặt: chủ đề tối áp dụng tức thì và **giữ nguyên sau khi tải lại / sang trang khác**,
      cỡ chữ lớn, chỉ báo "Thay đổi chưa lưu", hộp thoại xác nhận đặt lại dữ liệu.
- [x] Responsive: tại 515px thanh bên thu thành menu trượt, nút hamburger hoạt động, bảng cuộn ngang.
- [x] Console sạch (không error/warning) trên cả 7 trang.

**Chưa kiểm tự động**: dự án không có bộ test. Không kiểm tra đạt chuẩn W3C bằng công cụ,
chỉ viết HTML theo cấu trúc hợp lệ (doctype, `lang`, `charset`, thẻ đóng đầy đủ, `alt` cho ảnh).

---

## 7. Mô phỏng so với thật

| Hiện tượng | Bản chất |
| --- | --- |
| "Phân tích AI" | Đếm từ khóa trong tiêu đề + mô tả bằng JavaScript, tin cậy 55% + 13%/từ khóa, trần 95%. Không gọi mô hình nào. |
| Phân loại bằng ảnh | **Không có.** Ảnh chỉ lưu kèm ticket dưới dạng data URL. |
| Đổi mật khẩu | Chỉ kiểm tra biểu mẫu rồi báo kết quả; **mật khẩu không được lưu hay gửi đi đâu**. |
| "Đăng xuất tất cả thiết bị" | Chỉ là thông báo trên màn hình, không có phiên thật. |
| Tần suất / bản tin email | Chỉ lưu sở thích, **không có lịch hay email thật**. |
| Kỹ thuật viên được phân công | Lấy từ `technicians.json`; việc phân công do phân hệ Kỹ thuật viên quyết định. |

Các giới hạn này được ghi ngay trên giao diện để người dùng không hiểu nhầm.

---

## 8. Trả lời câu hỏi vấn đáp

**Vì sao tách `app.js` cũ (1363 dòng) thành nhiều module?**
Một file chứa logic của cả 4 trang nên mỗi lần sửa một trang phải tìm trong hơn nghìn dòng và
dễ xung đột khi ghép code các thành viên. Tách theo trang giúp mỗi file ~100–300 dòng, chỉ nạp
logic của trang đang mở.

**Vì sao `api.js` không phải là API thật?**
Dự án không được dùng backend. `api.js` là lớp trung gian: module chỉ gọi hàm, không tự đụng
`localStorage` hay `fetch`. Sau này có server thật thì chỉ thay phần thân các hàm trong `api.js`.

**Vì sao dữ liệu mẫu đặt ở JSON thay vì hard-code trong JS?**
Để người dùng sửa được dữ liệu mà không đụng code, và để `api.js` nạp bằng `fetch` — cách duy nhất
 đọc file tĩnh mà không cần build tool.

**Vì sao ticket mẫu dùng `soGioTruoc` thay vì ngày cố định?**
Nếu ghi ngày tuyệt đối, sau vài tuần mọi SLA đều "Quá hạn" và demo hỏng. Khi nạp, `api.js` đổi
"X giờ trước" thành mốc ISO tính tại lúc mở trang, nên dữ liệu luôn tươi.

**Vì sao giữ nguyên tên khóa LocalStorage (`_v1`)?**
Thay khóa sẽ làm mất dữ liệu người dùng đã tạo từ bản trước. Thay vì đổi khóa, `layDanhSachThongBao()`
bổ sung field thiếu (`loai`, `maTicket`) theo giá trị mặc định khi đọc — gọi là tương thích ngược.

**Vì sao main.js phải là `type="module"` và không còn `onclick="..."`?**
Phạm vi của module không phải global, nên chuỗi `onclick="tenHam()"` không tìm thấy hàm và báo lỗi.
Toàn bộ đã chuyển sang `addEventListener`.

**SLA tính thế nào?**
`laySoGioSLA()`: Khẩn 8h, Cao 72h, Trung bình 96h, Thấp 120h. `hanXuLy = ngayTao + SLA`.
Còn lại `= hanXuLy - hiện tại`; dưới 12h nhãn đỏ, dưới 36h nhãn vàng. Ticket Hoàn thành hiển thị
"Đúng hạn"/"Trễ hạn" theo `ngayCapNhat` so với `hanXuLy`.

**Vấn đề gặp khi refactor?**
Chuỗi `onclick` hỏng trong module; và trang Hồ sơ từng gắn lại sự kiện "Lưu" mỗi lần chuyển tab
làm hàm chạy nhiều lần — sửa thành nạp giá trị khi chuyển tab, gắn sự kiện một lần lúc khởi tạo.

**Ảnh lớn làm đầy LocalStorage thì sao?**
Ảnh chuyển thành data URL (~1,3 KB cho ảnh thử), giới hạn 1,5 MB/ảnh; `storage.js.ghi()` bắt lỗi
hết dung lượng và báo "Không lưu được dữ liệu, bộ nhớ trình duyệt có thể đã đầy."
