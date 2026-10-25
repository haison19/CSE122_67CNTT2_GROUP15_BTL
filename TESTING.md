# Kiểm thử & Bàn giao — FixFlow

Tài liệu này ghi lại **cách kiểm thử**, **kết quả kiểm thử thực tế trên trình duyệt**, **cách dữ liệu được lưu**, và **các hạn chế đã biết** của FixFlow.

- Kết quả mới nhất: **35/35 test PASS** (chạy trên Microsoft Edge, chế độ headless).
- Bộ test: `tests/kiem_thu_ui.py` — tự bật HTTP server, tự bấm nút như người dùng thật, in PASS/FAIL và ghi `tests/ket_qua_kiem_thu.json`.

---

## 1. Cách chạy kiểm thử

Yêu cầu: Python 3.9+ và Microsoft Edge (có sẵn trên Windows 10/11).

```powershell
cd d:\learn\web\BTL\Fix-Flow
python -m pip install playwright
python tests/kiem_thu_ui.py
```

Kết quả in ra màn hình dạng:

```
PASS T01 - Trang Hang doi ve du ticket o cot Cho nhan va Dang xu ly
...
===== KET QUA: 35/35 PASS =====
```

Chi tiết từng case (kèm số liệu thực tế) được ghi vào `tests/ket_qua_kiem_thu.json`.

**Vì sao phải chạy qua HTTP server?** `localStorage` bị chặn khi mở file bằng `file://`. Script tự mở `http.server` ở cổng **8765** (đúng như khi dùng Live Server của VS Code) để môi trường test giống môi trường chấm bài.

**Nếu máy chưa cài Playwright trình duyệt:** script dùng `channel="msedge"` nên tận dụng Edge có sẵn, không cần `playwright install`.

---

## 2. Phạm vi kiểm thử

Bộ test đi theo đúng luồng nghiệp vụ chính, không chỉ kiểm tra "trang có mở được":

1. **Hàng đợi** → nhận việc → ticket sang cột *Đang xử lý*.
2. **Đang sửa** (mở bằng `?ticket=...`) → xem gợi ý AI → chấp nhận/tạo lại/từ chối/sửa/dùng thủ công → thêm bước thủ công → tick checklist → ghi chú → tạm dừng → hoàn thành.
3. **Lịch sử** → ticket vừa xong xuất hiện đúng 1 dòng, lọc theo mã, xuất CSV.
4. **Bền vững dữ liệu** → tải lại trang (F5) ở cả 3 trang, dữ liệu và tiến độ không mất, không nhân đôi.
5. **Không lỗi JavaScript** khi mở cả 6 trang HTML.
6. **Chế độ sáng/tối** → nút trên thanh trên cùng đổi màu toàn bộ giao diện, lựa chọn được ghi nhớ và giữ nguyên khi chuyển trang.

---

## 3. Dữ liệu được lưu ở đâu (localStorage)

Toàn bộ trạng thái nằm trong 4 khoá của `localStorage` (khai báo ở đầu `js/script.js`):

| Khoá | Nội dung | Ai ghi |
| --- | --- | --- |
| `fixflowTicketDangXuLy` | Ticket đang mở ở trang *Đang sửa* (để trang 02 biết hiển thị ticket nào) | Trang Hàng đợi khi bấm *Nhận việc* / *Tiếp tục* |
| `fixflowDuLieuTicket` | Kho dữ liệu theo **mã ticket**: trạng thái, checklist, ghi chú, thời gian xử lý, số lần tạo lại gợi ý, trạng thái gợi ý AI | Trang Đang sửa (mỗi lần tick/thêm bước/lưu ghi chú/hoàn thành) |
| `fixflowPhienBanDuLieu` | Phiên bản dữ liệu mẫu (`"3"`) — dùng để xoá dữ liệu cũ khi cấu trúc mẫu thay đổi | Lần tải trang đầu tiên |
| `fixflowGiaoDien` | Chế độ màu đang chọn: `"sang"` hoặc `"toi"` | Nút chuyển chế độ sáng/tối trên thanh trên cùng |

Hai điểm quan trọng để trả lời khi bảo vệ:

- **Mỗi ticket có dữ liệu riêng** vì kho được đánh khoá theo `maTicket` (`kho[maTicket] = duLieu`), nên ticket A không ghi đè checklist của ticket B.
- **Lịch sử không lưu thành một mảng riêng.** Bảng lịch sử được **dựng lại mỗi lần tải trang** từ `fixflowDuLieuTicket`: ticket nào có `trangThai === "Hoàn thành"` thì được đưa vào bảng qua `themVaoLichSu()`, và hàm này **bỏ qua nếu mã ticket đã có** trong bảng. Vì vậy tải lại trang Lịch sử 10 lần vẫn chỉ có 1 dòng (test T16 kiểm chứng đúng điều này).

Thứ tự ưu tiên khi dựng lại trang: dữ liệu mẫu trong JS → ghi đè bằng dữ liệu đã lưu trong `localStorage` (`apDungDuLieuDaLuu()`), nên dữ liệu thật của người dùng luôn thắng dữ liệu mẫu.

---

## 4. Kết quả kiểm thử (35/35 PASS)

Cột **Bằng chứng** là số liệu script đọc trực tiếp từ DOM sau khi thao tác, không phải mô tả cảm tính.

| Mã | Nội dung kiểm thử | Bằng chứng đo được | Kết quả |
| --- | --- | --- | --- |
| T01 | Trang Hàng đợi vẽ đủ ticket ở cột *Chờ nhận* và *Đang xử lý* | `chờ=11, đang=2` | PASS |
| T02 | Bấm *Nhận việc* chuyển ticket sang cột *Đang xử lý* | TK-2025-001: `2 → 3` | PASS |
| T03 | Mở trang Đang sửa bằng `?ticket=` hiển thị đúng ticket | `Máy lạnh không mát · TK-2025-001 · AC-023` | PASS |
| T04 | Hộp *Gợi ý AI* hiển thị kèm danh sách bước | `hiện=True, 5 bước` | PASS |
| T05 | Nhãn độ tin cậy và số bước có dữ liệu thật | `85% tin cậy`, `5 bước` | PASS |
| T06 | Checklist ticket mới bắt đầu 0 bước + có thông điệp trống | `0 bước`, `li.thong-diep-trong = 1` | PASS |
| T07 | Chặn *Hoàn thành* khi checklist trống | hiện lỗi, vẫn ở trang 02 | PASS |
| T08 | Bấm *Chấp nhận* đưa gợi ý AI vào checklist | `gợi ý=5 → checklist=5` | PASS |
| T09 | Tiến độ hiển thị đúng dạng `n/tổng` và % | `0/5`, `0%` | PASS |
| T10 | Chặn *Hoàn thành* khi còn bước chưa xong | "Còn 4/5 bước chưa hoàn thành…" | PASS |
| T11 | Tick hết checklist thì tiến độ đạt 100% | `5/5`, `100%` | PASS |
| T12 | Ghi chú được lưu và còn sau khi tải lại | nội dung ghi chú giữ nguyên | PASS |
| T13 | Trạng thái tick được giữ sau khi tải lại | `5/5` vẫn tick | PASS |
| T14 | Hoàn thành ticket thì chuyển sang trang Lịch sử | URL → `history.html` | PASS |
| T15 | Ticket vừa xong xuất hiện đúng 1 dòng trong Lịch sử | `số lần = 1` | PASS |
| T16 | Tải lại trang Lịch sử không tạo dòng trùng lặp | `số lần = 1` | PASS |
| T17 | Ticket đã hoàn thành thì nút *Hoàn thành* bị khoá | `disabled = True` | PASS |
| T18 | Checklist ticket đã xong chỉ còn xem, không tick được | 5/5 checkbox bị khoá | PASS |
| T19 | Đồng hồ không bị reset về `00:00:00` sau khi hoàn thành | `01:24:20` | PASS |
| T20 | Ticket đã xong chỉ nằm ở cột *Hoàn thành* của Hàng đợi | cột Hoàn thành = có, 2 cột kia = không | PASS |
| T21 | Gợi ý AI sinh theo đúng loại thiết bị và khác nhau giữa 2 ticket | router: "cáp mạng/WAN"; máy lạnh: "gas/bộ lọc gió" | PASS |
| T22 | Tạm dừng giữ nguyên tiến độ checklist | nhãn `Tạm dừng`, tiến độ `1/5` | PASS |
| T23 | Ticket tạm dừng nằm ở cột *Đang xử lý*, không phải *Hoàn thành* | `đang=True, xong=False` | PASS |
| T24 | Nút *Thêm bước* thêm được bước thủ công | checklist tăng thêm 1 bước | PASS |
| T25 | Bấm *Tạo lại* không ghi đè checklist đang làm | `trước=6, sau=6` | PASS |
| T26 | Bấm *Từ chối* giữ nguyên checklist hiện tại | `6 bước` không đổi | PASS |
| T27 | Tải lại trang Hàng đợi không làm mất dữ liệu đã lưu | `1 → 1` dòng Lịch sử | PASS |
| T28 | Không có lỗi JavaScript khi mở cả 6 trang | 0 lỗi console/pageerror | PASS |
| T29 | Nút xuất CSV tạo được file tải về | `lich-su-sua-chua.csv` | PASS |
| T30 | Lọc lịch sử theo mã ticket trả về đúng 1 dòng | `1 dòng` | PASS |
| T31 | Chấp nhận gợi ý AI: hộp gợi ý ẩn + báo "Đã áp dụng" (chặn chấp nhận lặp) | `5 bước`, hộp ẩn, trạng thái "Đã áp dụng…" | PASS |
| T32 | *Dùng thủ công* chuyển sang chế độ tự thêm bước, không mất checklist | trạng thái "…thủ công…", `5 bước` giữ nguyên | PASS |
| T33 | Tên người dùng "Bùi Huy Quân" + avatar "BQ" hiển thị giống nhau ở cả 6 trang | 6/6 trang đúng, không trang nào lệch tên | PASS |
| T34 | `css/responsive.css` được nạp ở cả 6 trang và đổi bố cục đúng breakpoint | 6/6 trang nạp CSS; 1400px = 4 cột/sticky, 1000px = 2 cột, 500px = 1 cột/fixed | PASS |
| T35 | Nút chuyển chế độ sáng/tối có ở cả 6 trang, đổi màu nền và ghi nhớ lựa chọn | 6/6 trang có `#nutGiaoDien`; độ sáng nền `741 → 69`; `localStorage = "toi"`; mở `queue.html` vẫn ở chế độ tối (`69`); bấm lại về `"sang"` | PASS |

---

## 5. Những lỗi gặp trong quá trình kiểm thử và cách xử lý

### 5.1. Lỗi của bộ test (đã sửa, app không sai)

| Hiện tượng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| Script dừng giữa chừng với `UnicodeEncodeError: 'charmap' codec can't encode…` | Console Windows mặc định dùng bảng mã cp1252, không in được chữ Việt có dấu | Gọi `sys.stdout.reconfigure(encoding="utf-8", errors="replace")` ở đầu script; `print(..., flush=True)` để log ra ngay |
| Test báo ticket mới có **1 bước** dù checklist trống | Khi checklist trống, app render một dòng giữ chỗ `<li class="thong-diep-trong">`, và selector `#danhSachBuocXuLy li` đếm luôn dòng này | Đổi selector sang `li.dong-buoc` (chỉ bước thật) ở T06/T08/T25/T26, đồng thời **thêm assertion** kiểm tra đúng 1 dòng thông điệp trống — vừa sửa test vừa khoá được hành vi đúng của app |
| T21 "gợi ý AI" luôn giống nhau giữa mọi ticket | Assertion cũ so sánh 2 ticket **cùng loại thiết bị**, mà gợi ý của app sinh theo tiền tố mã thiết bị nên giống nhau là đúng | Viết lại T21: so sánh ticket router (`RT-…`) với ticket máy lạnh (`AC-…`) và bắt buộc hai danh sách phải khác nhau |
| File test bị lỗi cú pháp/BOM sau khi tạo bằng PowerShell | `Set-Content` của PowerShell chèn BOM `\uFEFF` vào đầu file | Đọc bằng `utf-8-sig` rồi ghi lại bằng UTF-8 không BOM; kiểm tra bằng `ast.parse` |

### 5.2. Các hành vi của app từng bị nghi ngờ và đã được kiểm chứng là đúng

- **Không nhân đôi lịch sử:** `themVaoLichSu()` bỏ qua nếu mã ticket đã có → tải lại trang Lịch sử nhiều lần vẫn 1 dòng (T15, T16, T27).
- **Không ghi đè checklist đang làm:** *Tạo lại* chỉ đổi danh sách gợi ý, *Từ chối* chỉ đổi trạng thái gợi ý, không ai chạm vào checklist (T25, T26).
- **Chặn chấp nhận lặp:** sau khi chấp nhận, `trangThaiGoiYAI` chuyển `da-chap-nhan`, hộp gợi ý ẩn và `chapNhanGoiYAI()` return sớm → checklist không bị nhân đôi (T31).
- **Ticket đã xong là "chỉ đọc":** mọi nút bị `disabled` qua danh sách `nutThemBuoc, nutChapNhan, nutTaoLai, nutTuChoiChecklist, nutSuaChecklist, nutDungThuCong, nutTamDung, nutHoanThanh, nutLuuGhiChu`; checkbox bị khoá (T17, T18).
- **Đồng hồ không reset:** thời gian xử lý được chốt vào `thoiGianXuLy` khi bấm Hoàn thành và đọc lại từ `localStorage` khi tải lại, nên không quay về `00:00:00` (T19).
- **Tạm dừng ≠ Hoàn thành:** ticket tạm dừng vẫn nằm ở cột *Đang xử lý* của Hàng đợi và giữ nguyên tiến độ (T22, T23).

---

## 6. Hạn chế đã biết (nên nói trước khi bị hỏi)

1. **Không có backend.** Toàn bộ dữ liệu nằm trong `localStorage` của trình duyệt: đổi máy, đổi trình duyệt, xoá dữ liệu duyệt web, hoặc dùng chế độ ẩn danh → mất dữ liệu. Đây là lựa chọn có chủ đích để bài tập chạy được mà không cần server.
2. **"Gợi ý AI" là mô phỏng.** Không gọi API nào; danh sách bước sinh bằng luật dựa trên **tiền tố mã thiết bị** (`AC-`, `RT-`, `PR-`, `PC-`…) cộng với tên sự cố, có nhánh dự phòng chung. Độ tin cậy `85%` là con số minh hoạ, giảm 3% mỗi lần bấm *Tạo lại* (sàn 70%). App tự ghi rõ điều này trong thông báo khi bấm *Tạo lại*.
3. **Một kỹ thuật viên, không có đăng nhập.** Không phân quyền, không đồng bộ nhiều người, không có dữ liệu thời gian thực.
4. **Điểm đánh giá của ticket vừa hoàn thành là "Chưa chấm"** (`danhGia = 0`) vì chưa có luồng khách hàng chấm điểm.
5. **Chỉ kiểm thử tự động trên Edge.** Chưa có test tự động cho Firefox/Safari; CSS dùng thuộc tính phổ thông nhưng chưa kiểm chứng trên Safari.
6. **Chưa chạy được `node --check`** để kiểm tra cú pháp `script.js` (máy không cài Node). Thay vào đó T28 mở cả 6 trang và bắt `console`/`pageerror`: 0 lỗi, tức là file JS parse và chạy được trên toàn bộ các trang.
7. **Bộ test chạy tuần tự trong một trình duyệt dùng chung.** Mỗi lần chạy, script tạo context mới nên vẫn bắt đầu từ dữ liệu mẫu; nếu sửa dữ liệu mẫu thì một số con số trong bảng kết quả (ví dụ `chờ=11`) sẽ thay đổi theo.

---

## 7. Checklist kiểm thử thủ công (nếu không chạy được Python)

Mở dự án bằng **Live Server** (đừng mở trực tiếp `file://`, `localStorage` sẽ bị chặn), rồi làm theo thứ tự:

1. **Hàng đợi** → chọn một ticket ở cột *Chờ nhận* → bấm **Nhận việc** → ticket chuyển sang *Đang xử lý*.
2. Bấm vào ticket → mở trang **Đang sửa** đúng ticket vừa nhận.
3. Xem hộp **Gợi ý AI**: có nhãn `% tin cậy`, số bước, danh sách bước đúng loại thiết bị.
4. Bấm **Chấp nhận** → checklist có đúng số bước, hộp gợi ý ẩn, trạng thái báo "Đã áp dụng…".
5. Tick vài bước → tiến độ đổi `n/tổng` và `%` → **F5** → tiến độ vẫn giữ.
6. Bấm **Hoàn thành** khi còn bước chưa xong → phải bị chặn kèm thông báo.
7. Tick hết → **Hoàn thành** → tự chuyển sang trang **Lịch sử**, ticket xuất hiện đúng 1 dòng.
8. **F5** trang Lịch sử 2–3 lần → vẫn 1 dòng (không nhân đôi).
9. Quay lại **Hàng đợi** → ticket đã xong nằm ở cột *Hoàn thành*, không còn ở *Chờ nhận*.
10. Mở lại ticket đã xong → nút *Hoàn thành* bị khoá, checkbox không tick được.
11. Thử **Tạm dừng** một ticket khác → vẫn ở cột *Đang xử lý*, tiến độ giữ nguyên.
12. Bấm **Xuất CSV** → tải về `lich-su-sua-chua.csv`, mở bằng Excel thấy đúng tiếng Việt (file có BOM UTF-8).
13. Bấm nút **mặt trăng** trên thanh trên cùng → cả trang chuyển sang nền tối, nút đổi thành **mặt trời** → **F5** vẫn ở chế độ tối → sang trang khác (ví dụ *Hàng đợi*) vẫn tối → bấm lại để về chế độ sáng.

---

## 8. Câu hỏi thường gặp khi bảo vệ

**Dữ liệu lưu ở đâu, có mất khi tải lại trang không?**
Lưu trong `localStorage` với 3 khoá (mục 3). Tải lại trang không mất vì mỗi trang khi load đều gọi `apDungDuLieuDaLuu()` để ghi đè dữ liệu mẫu bằng dữ liệu đã lưu.

**Vì sao mỗi ticket có checklist riêng?**
Kho dữ liệu là một object đánh khoá theo mã ticket (`kho[maTicket]`), nên checklist, ghi chú, thời gian của từng ticket độc lập.

**Làm sao chắc chắn không bị trùng dòng lịch sử?**
Lịch sử không phải mảng được thêm mỗi lần hoàn thành; nó được dựng lại từ dữ liệu đã lưu và `themVaoLichSu()` kiểm tra mã ticket đã tồn tại thì bỏ qua.

**Tiến độ tính thế nào?**
`số bước đã tick / tổng số bước`, làm tròn phần trăm; checklist trống thì không cho hoàn thành nên không có trường hợp chia cho 0.

**Vì sao phải chạy qua HTTP server?**
`localStorage` gắn với origin; `file://` bị chặn nên app chỉ chạy tạm trong bộ nhớ. Vì vậy cả Live Server khi demo và `http.server` trong bộ test đều dùng `http://127.0.0.1`.

**Bộ test có kiểm tra "AI thật" không?**
Không. T21 kiểm tra gợi ý **đúng theo loại thiết bị và khác nhau giữa các thiết bị**, tức kiểm tra phần luật sinh gợi ý — đúng với thiết kế "mô phỏng AI" của đề tài.

**Muốn đổi tên kỹ thuật viên thì sửa ở đâu?**
Chỉ cần sửa **một chỗ**: hằng `tenKyThuatVien` ở đầu `js/script.js` (dòng 9). Hàm `hienThiThongTinNguoiDung()` sẽ tự ghi tên này vào `#tenNguoiDung` ở cả 6 trang và tự lấy 2 chữ cái đầu (`layChuCaiDau`) để hiển thị avatar; câu chào ở `index.html` cũng được ghi đè theo cùng hằng số này. Test T33 kiểm tra 6/6 trang hiển thị giống nhau, nên nếu ai đó hard-code một tên khác vào HTML thì test sẽ báo FAIL ngay.

**Muốn reset dữ liệu để demo lại từ đầu?**
Mở DevTools → Application → Local Storage → xoá 3 khoá `fixflowTicketDangXuLy`, `fixflowDuLieuTicket`, `fixflowPhienBanDuLieu` → F5. Hoặc tăng `PHIEN_BAN_DU_LIEU_MAU` trong `js/script.js` để app tự xoá dữ liệu phiên bản cũ.

---

## 9. Tệp liên quan

| Tệp | Vai trò |
| --- | --- |
| `tests/kiem_thu_ui.py` | Bộ 35 test tự động (Playwright + Edge, tự bật `http.server` cổng 8765) |
| `tests/ket_qua_kiem_thu.json` | Kết quả lần chạy gần nhất: mã, tên, đạt/không đạt, số liệu đo được |
| `js/script.js` | Toàn bộ logic: dữ liệu mẫu, `localStorage`, checklist, gợi ý AI mô phỏng, lịch sử, thống kê |
| `queue.html` … `analytics.html`, `index.html` | 6 trang giao diện |
| `css/style.css` | Toàn bộ style dùng chung: biến màu `:root`, layout, component, và bảng màu **chế độ tối** (`html[data-giao-dien="toi"]`) |
| `css/responsive.css` | Các khối `@media` (1280 / 1100 / 900 / 560px) — nạp **sau** `style.css`, xếp theo bề rộng giảm dần |
