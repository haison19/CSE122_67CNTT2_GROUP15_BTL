/* =========================================================
   FixFlow - Phân hệ Người yêu cầu
   app.js: toàn bộ chức năng JavaScript của 4 trang
   ========================================================= */

// ---------- Khóa dữ liệu trên localStorage ----------
const KHOA_TICKET = "fixflow_nguoi_yeu_cau_tickets_v1";
const KHOA_THONG_BAO = "fixflow_nguoi_yeu_cau_thong_bao_v1";
const KHOA_HO_SO = "fixflow_nguoi_yeu_cau_ho_so_v1";

const DANH_SACH_MUC_DO = ["Thấp", "Trung bình", "Cao", "Khẩn"];
const NHOM_DANG_XU_LY = ["Mới", "Chờ nhận", "Chờ bổ sung", "Đang xử lý", "Chờ linh kiện"];
const SO_DONG_MOI_TRANG = 8;
const TEN_MAC_DINH = "Nguyễn Văn A";
const DINH_DANG_ANH = ["image/png", "image/jpeg"];
const KICH_THUOC_ANH_TOI_DA = 1.5 * 1024 * 1024; // 1,5 MB

/* =========================================================
   PHẦN 1: ĐỌC / GHI DỮ LIỆU
   ========================================================= */

// Đọc danh sách ticket từ localStorage, dữ liệu hỏng thì trả về mảng rỗng
function layDanhSachTicket() {
  const duLieu = localStorage.getItem(KHOA_TICKET);
  if (!duLieu) return [];
  try {
    const mang = JSON.parse(duLieu);
    return Array.isArray(mang) ? mang : [];
  } catch (e) {
    return [];
  }
}

// Lưu danh sách ticket xuống localStorage
function luuDanhSachTicket(danhSach) {
  try {
    localStorage.setItem(KHOA_TICKET, JSON.stringify(danhSach));
    return true;
  } catch (e) {
    hienThongBao("Không thể lưu dữ liệu, bộ nhớ trình duyệt có thể đã đầy.", "loi");
    return false;
  }
}

// Ghi đè một ticket đã có trong danh sách (tránh mất tham chiếu khi parse lại)
function luuMotTicket(ticket) {
  const danhSach = layDanhSachTicket();
  const viTri = danhSach.findIndex(function (t) { return t.id === ticket.id; });
  if (viTri === -1) return false;
  danhSach[viTri] = ticket;
  return luuDanhSachTicket(danhSach);
}

// Tìm ticket theo mã
function timTicketTheoMa(ma) {
  const danhSach = layDanhSachTicket();
  return danhSach.find(function (t) { return t.id === ma; });
}

/* =========================================================
   PHẦN 2: CÁC HÀM TIỆN ÍCH
   ========================================================= */

// Thoát ký tự đặc biệt để chèn dữ liệu người dùng vào HTML một cách an toàn
function anToan(chuoi) {
  if (chuoi === null || chuoi === undefined) return "";
  return String(chuoi)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dinhDangNgay(ngayISO) {
  const d = new Date(ngayISO);
  if (isNaN(d.getTime())) return "";
  const ngay = String(d.getDate()).padStart(2, "0");
  const thang = String(d.getMonth() + 1).padStart(2, "0");
  return ngay + "/" + thang + "/" + d.getFullYear();
}

function dinhDangGio(ngayISO) {
  const d = new Date(ngayISO);
  if (isNaN(d.getTime())) return "";
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function dinhDangNgayGio(ngayISO) {
  return dinhDangGio(ngayISO) + " · " + dinhDangNgay(ngayISO);
}

// Số SLA (giờ) theo mức độ ưu tiên
function laySoGioSLA(mucDo) {
  if (mucDo === "Khẩn") return 8;
  if (mucDo === "Cao") return 72;
  if (mucDo === "Trung bình") return 96;
  return 120;
}

function congGio(ngayISO, soGio) {
  const d = new Date(ngayISO);
  d.setHours(d.getHours() + soGio);
  return d.toISOString();
}

// Số giờ còn lại so với hạn xử lý
function tinhSoGioConLai(ticket) {
  if (!ticket.hanXuLy) return 0;
  const han = new Date(ticket.hanXuLy).getTime();
  return Math.round((han - Date.now()) / 3600000);
}

// Tạo chuỗi hiển thị cho cột SLA
function dinhDangSLA(ticket) {
  if (ticket.trangThai === "Hủy") return '<span class="nhan nhan-xam">Đã hủy</span>';
  if (ticket.trangThai === "Hoàn thành") {
    const dungHan = new Date(ticket.ngayCapNhat).getTime() <= new Date(ticket.hanXuLy).getTime();
    return dungHan
      ? '<span class="nhan nhan-xanh-la">Đúng hạn</span>'
      : '<span class="nhan nhan-vang">Trễ hạn</span>';
  }
  const gio = tinhSoGioConLai(ticket);
  if (gio >= 0) {
    const mau = gio <= 12 ? "nhan-do" : (gio <= 36 ? "nhan-vang" : "nhan-xanh");
    return '<span class="nhan ' + mau + '" title="Thời gian còn lại theo SLA">' + gio + "h</span>";
  }
  return '<span class="nhan nhan-do" title="Đã quá hạn SLA">Quá ' + Math.abs(gio) + "h</span>";
}

// Nhãn màu cho trạng thái
function nhanTrangThai(trangThai) {
  if (trangThai === "Hoàn thành") return "nhan-xanh-la";
  if (trangThai === "Hủy") return "nhan-xam";
  if (trangThai === "Chờ bổ sung") return "nhan-vang";
  if (trangThai === "Mới") return "nhan-xanh";
  return "nhan-vang";
}

// Nhãn màu cho mức độ ưu tiên
function nhanMucDo(mucDo) {
  if (mucDo === "Khẩn") return "nhan-do";
  if (mucDo === "Cao") return "nhan-vang";
  if (mucDo === "Trung bình") return "nhan-xanh";
  return "nhan-xam";
}

// Hiển thị thông báo nhỏ ở góc màn hình
function hienThongBao(noiDung, loai) {
  let o = document.getElementById("thong-bao-nho");
  if (!o) {
    o = document.createElement("div");
    o.id = "thong-bao-nho";
    document.body.appendChild(o);
  }
  o.className = "thong-bao-nho " + (loai || "");
  o.textContent = noiDung;
  o.classList.add("hien");
  clearTimeout(o.henGio);
  o.henGio = setTimeout(function () { o.classList.remove("hien"); }, 3500);
}

/* =========================================================
   PHẦN 3: THÔNG BÁO VÀ HỒ SƠ NGƯỜI DÙNG
   ========================================================= */

function layDanhSachThongBao() {
  try {
    const mang = JSON.parse(localStorage.getItem(KHOA_THONG_BAO));
    return Array.isArray(mang) ? mang : [];
  } catch (e) {
    return [];
  }
}

function luuDanhSachThongBao(danhSach) {
  localStorage.setItem(KHOA_THONG_BAO, JSON.stringify(danhSach));
}

function themThongBao(noiDung) {
  const danhSach = layDanhSachThongBao();
  danhSach.unshift({ noiDung: noiDung, thoiGian: new Date().toISOString(), daDoc: false });
  if (danhSach.length > 30) danhSach.length = 30;
  luuDanhSachThongBao(danhSach);
  capNhatSoThongBao();
}

// Cập nhật số thông báo chưa đọc ở mọi chỗ hiển thị (chuông trên đầu trang, nhãn trong menu)
function capNhatSoThongBao() {
  const soChuaDoc = layDanhSachThongBao().filter(function (t) { return !t.daDoc; }).length;
  const cacO = ["so-thong-bao", "so-thong-bao-dau"];
  for (const id of cacO) {
    const o = document.getElementById(id);
    if (!o) continue;
    o.textContent = soChuaDoc;
    o.classList.toggle("so-0", soChuaDoc === 0);
  }
}

function layHoSo() {
  try {
    const hoSo = JSON.parse(localStorage.getItem(KHOA_HO_SO));
    if (hoSo && hoSo.ten && hoSo.ten.trim()) return hoSo;
  } catch (e) { /* bỏ qua dữ liệu hỏng */ }
  return { ten: TEN_MAC_DINH, email: "nguyenvana@fixflow.vn" };
}

/* =========================================================
   PHẦN 4: KHỞI TẠO DỮ LIỆU MẪU
   ========================================================= */

function taoThoiDiemTruoc(soGio) {
  const d = new Date();
  d.setHours(d.getHours() - soGio);
  return d.toISOString();
}

function taoLichSuMacDinh(ticket) {
  const lichSu = [{ thoiGian: ticket.ngayTao, noiDung: "Ticket được tạo" }];
  lichSu.push({ thoiGian: ticket.ngayTao, noiDung: "Mô phỏng phân loại sự cố: " + ticket.danhMuc });
  if (ticket.trangThai !== "Mới") {
    lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Cập nhật trạng thái: " + ticket.trangThai });
  }
  if (ticket.trangThai === "Hủy") {
    lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Hủy ticket - Lý do: " + ticket.lyDoHuy });
  }
  return lichSu;
}

function taoDuLieuMau() {
  const nam = new Date().getFullYear();
  const nguon = [
    { so: 1, soGioTruoc: 50, thietBi: "AC-023 · Máy lạnh Daikin", viTri: "Phòng 101 – Tòa A", tieuDe: "Máy lạnh phòng 101 không mát", moTa: "Máy vẫn chạy và có gió nhưng phòng không mát, dàn lạnh rung nhẹ.", mucDo: "Cao", trangThai: "Đang xử lý", danhMuc: "Điện lạnh", nguoiPhuTran: "Trần Thị B", binhLuan: [{ nguoiViet: "Trần Thị B", noiDung: "Đang đo gas và cảm biến nhiệt.", thoiGian: taoThoiDiemTruoc(48) }] },
    { so: 2, soGioTruoc: 30, thietBi: "RT-201 · Router TP-Link", viTri: "Phòng 201 – Tòa A", tieuDe: "WiFi phòng 201 chập chờn", moTa: "Mạng WiFi lúc được lúc mất, nhiều người cùng truy cập.", mucDo: "Trung bình", trangThai: "Chờ nhận", danhMuc: "Mạng" },
    { so: 3, soGioTruoc: 2, thietBi: "PJ-005 · Máy chiếu Epson", viTri: "Phòng hội trường", tieuDe: "Máy chiếu mất hình", moTa: "Máy chiếu vẫn sáng đèn nguồn nhưng không hiển thị hình ảnh.", mucDo: "Khẩn", trangThai: "Mới", danhMuc: "Thiết bị trình chiếu" },
    { so: 4, soGioTruoc: 140, thietBi: "LG-12 · Đèn LED", viTri: "Hành lang tầng 1", tieuDe: "Đèn hành lang nhấp nháy", moTa: "Đèn nhấp nháy liên tục vào buổi tối.", mucDo: "Thấp", trangThai: "Hoàn thành", danhMuc: "Điện", nguoiPhuTran: "Lê Văn C", danhGia: 5 },
    { so: 5, soGioTruoc: 70, thietBi: "PR-008 · Máy in Canon", viTri: "Phòng kế toán", tieuDe: "Máy in kẹt giấy", moTa: "Máy in báo kẹt giấy ở khay 2, không thể in tiếp.", mucDo: "Trung bình", trangThai: "Đang xử lý", danhMuc: "Máy in", nguoiPhuTran: "Lê Văn C" },
    { so: 6, soGioTruoc: 95, thietBi: "EM-21 · Ổ cắm âm sàn", viTri: "Phòng 203 – Tòa A", tieuDe: "Ổ cắm phòng 203 mất điện", moTa: "Ổ cắm không có điện, đã thử thiết bị khác.", mucDo: "Cao", trangThai: "Chờ bổ sung", danhMuc: "Điện" },
    { so: 7, soGioTruoc: 120, thietBi: "CAM-07 · Camera Hikvision", viTri: "Sảnh tầng trệt", tieuDe: "Camera mất tín hiệu", moTa: "Camera không hiển thị hình ảnh trên màn hình giám sát.", mucDo: "Cao", trangThai: "Chờ linh kiện", danhMuc: "Camera", nguoiPhuTran: "Phạm D" },
    { so: 8, soGioTruoc: 40, thietBi: "SP-03 · Loa JBL", viTri: "Phòng hội trường", tieuDe: "Loa hội trường rè", moTa: "Loa phát ra tiếng rè khi mở âm lượng lớn.", mucDo: "Thấp", trangThai: "Mới", danhMuc: "Âm thanh" },
    { so: 9, soGioTruoc: 220, thietBi: "AC-031 · Máy lạnh Panasonic", viTri: "Phòng 205 – Tòa B", tieuDe: "Máy lạnh phòng 205 chảy nước", moTa: "Dàn lạnh nhỏ nước xuống sàn phòng.", mucDo: "Trung bình", trangThai: "Hoàn thành", danhMuc: "Điện lạnh", nguoiPhuTran: "Trần Thị B", danhGia: 4 },
    { so: 10, soGioTruoc: 20, thietBi: "SW-02 · Switch Cisco", viTri: "Tầng 2 – Tòa A", tieuDe: "Mạng văn phòng chậm", moTa: "Tốc độ mạng giảm rõ rệt, tải trang rất lâu.", mucDo: "Cao", trangThai: "Đang xử lý", danhMuc: "Mạng", nguoiPhuTran: "Phạm D" },
    { so: 11, soGioTruoc: 300, thietBi: "DR-11 · Cửa tự động", viTri: "Sảnh chính", tieuDe: "Cửa kính sảnh không đóng được", moTa: "Cửa tự động dừng giữa chừng, không khép kín.", mucDo: "Trung bình", trangThai: "Hoàn thành", danhMuc: "Cơ điện", nguoiPhuTran: "Lê Văn C", danhGia: 5 },
    { so: 12, soGioTruoc: 250, thietBi: "PC-14 · Máy tính Dell", viTri: "Phòng lab", tieuDe: "Máy tính phòng lab không khởi động", moTa: "Máy tính bật nguồn nhưng không vào được hệ điều hành.", mucDo: "Khẩn", trangThai: "Hủy", danhMuc: "Thiết bị văn phòng", lyDoHuy: "Không còn nhu cầu" }
  ];

  const danhSach = nguon.map(function (dong) {
    const ngayTao = taoThoiDiemTruoc(dong.soGioTruoc);
    const ticket = {
      id: "TK-" + nam + "-" + String(dong.so).padStart(3, "0"),
      thietBi: dong.thietBi,
      viTri: dong.viTri,
      tieuDe: dong.tieuDe,
      moTa: dong.moTa,
      mucDo: dong.mucDo,
      trangThai: dong.trangThai,
      danhMuc: dong.danhMuc,
      ngayTao: ngayTao,
      ngayCapNhat: congGio(ngayTao, 3),
      hanXuLy: congGio(ngayTao, laySoGioSLA(dong.mucDo)),
      nguoiPhuTran: dong.nguoiPhuTran || "Chưa phân công",
      binhLuan: dong.binhLuan || [],
      danhGia: dong.danhGia || 0,
      lyDoHuy: dong.lyDoHuy || "",
      anhDinhKem: []
    };
    ticket.lichSu = taoLichSuMacDinh(ticket);
    return ticket;
  });

  luuDanhSachTicket(danhSach);

  luuDanhSachThongBao([
    { noiDung: "Chào mừng bạn đến với phân hệ Người yêu cầu của FixFlow.", thoiGian: taoThoiDiemTruoc(30), daDoc: false },
    { noiDung: "Hệ thống đã nạp dữ liệu mẫu để bạn dùng thử.", thoiGian: taoThoiDiemTruoc(20), daDoc: false },
    { noiDung: "Ticket TK-" + nam + "-003 cần được xử lý trong 8 giờ.", thoiGian: taoThoiDiemTruoc(2), daDoc: false }
  ]);
}

// Chỉ khởi tạo dữ liệu mẫu khi CHƯA có dữ liệu hợp lệ trong localStorage
function khoiTaoDuLieuMau() {
  const duLieu = localStorage.getItem(KHOA_TICKET);
  if (duLieu) {
    try {
      if (Array.isArray(JSON.parse(duLieu))) return;
    } catch (e) { /* dữ liệu hỏng thì tạo lại */ }
  }
  taoDuLieuMau();
}

// Tạo mã ticket mới, không trùng với mã đã có
function taoMaTicketMoi() {
  const danhSach = layDanhSachTicket();
  const nam = new Date().getFullYear();
  let soLonNhat = 0;
  for (const ticket of danhSach) {
    const phan = String(ticket.id).split("-");
    const so = parseInt(phan[phan.length - 1], 10);
    if (!isNaN(so) && so > soLonNhat) soLonNhat = so;
  }
  return "TK-" + nam + "-" + String(soLonNhat + 1).padStart(3, "0");
}

/* =========================================================
   PHẦN 5: GIAO DIỆN DÙNG CHUNG (thanh bên, thanh trên, hộp thoại)
   ========================================================= */

function taoLopPhu() {
  let lop = document.getElementById("lop-phu");
  if (lop) return lop;
  lop = document.createElement("div");
  lop.id = "lop-phu";
  lop.className = "lop-phu";
  lop.innerHTML = '<div class="hop-thoai" id="hop-thoai"></div>';
  lop.addEventListener("click", function (e) { if (e.target === lop) dongHopThoai(); });
  document.body.appendChild(lop);
  return lop;
}

function moHopThoai(noiDungHTML) {
  const lop = taoLopPhu();
  document.getElementById("hop-thoai").innerHTML = noiDungHTML;
  lop.classList.add("hien");
}

function dongHopThoai() {
  const lop = document.getElementById("lop-phu");
  if (lop) lop.classList.remove("hien");
}

// Nội dung cho các mục chưa có trang riêng
function moChucNang(chucNang) {
  if (chucNang === "thong-bao") return moHopThoaiThongBao();
  if (chucNang === "ho-so") return moHopThoaiHoSo();
  if (chucNang === "cai-dat") return moHopThoaiCaiDat();
  if (chucNang === "tro-giup") {
    moHopThoai(
      '<h3 class="tieu-de-hop-thoai">Trợ giúp 24/7</h3>' +
      '<p>Đây là phân hệ mô phỏng chạy hoàn toàn trên trình duyệt, không có máy chủ.</p>' +
      '<ul>' +
      '<li>Tạo ticket: nhập thiết bị, vị trí, tiêu đề, mô tả rồi bấm <strong>Gửi &amp; Phân tích AI</strong>.</li>' +
      '<li>Dữ liệu được lưu trong localStorage của trình duyệt hiện tại.</li>' +
      '<li>Muốn dùng thử từ đầu, hãy mở phần <strong>Cài đặt</strong> và chọn đặt lại dữ liệu mẫu.</li>' +
      '</ul>' +
      '<button class="nut nut-chinh" onclick="dongHopThoai()">Đóng</button>'
    );
  }
}

function moHopThoaiThongBao() {
  const danhSach = layDanhSachThongBao();
  let noiDung = '<h3 class="tieu-de-hop-thoai">Thông báo</h3>';
  if (danhSach.length === 0) {
    noiDung += '<p class="thong-bao-trang">Chưa có thông báo nào.</p>';
  } else {
    noiDung += '<ul class="danh-sach-thong-bao">';
    for (const tb of danhSach) {
      noiDung += "<li>" + anToan(tb.noiDung) +
        '<span class="thoi-gian-nho">' + anToan(dinhDangNgayGio(tb.thoiGian)) + "</span></li>";
    }
    noiDung += "</ul>";
  }
  noiDung += '<div class="khung-nut" style="margin-top:16px">' +
    '<button class="nut nut-chinh" id="nut-da-doc">Đánh dấu đã đọc</button>' +
    '<button class="nut nut-phu" onclick="dongHopThoai()">Đóng</button></div>';
  moHopThoai(noiDung);

  const nutDaDoc = document.getElementById("nut-da-doc");
  if (nutDaDoc) {
    nutDaDoc.addEventListener("click", function () {
      const danhSachMoi = layDanhSachThongBao().map(function (tb) {
        tb.daDoc = true;
        return tb;
      });
      luuDanhSachThongBao(danhSachMoi);
      capNhatSoThongBao();
      dongHopThoai();
      hienThongBao("Đã đánh dấu tất cả thông báo là đã đọc.", "thanh-cong");
    });
  }
}

function moHopThoaiHoSo() {
  const hoSo = layHoSo();
  moHopThoai(
    '<h3 class="tieu-de-hop-thoai">Hồ sơ</h3>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ho-so-ten">Họ và tên</label>' +
    '<input class="o-nhap" id="ho-so-ten" value="' + anToan(hoSo.ten) + '"></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ho-so-email">Email</label>' +
    '<input class="o-nhap" id="ho-so-email" value="' + anToan(hoSo.email) + '"></div>' +
    '<div class="khung-nut"><button class="nut nut-chinh" id="nut-luu-ho-so">Lưu</button>' +
    '<button class="nut nut-phu" onclick="dongHopThoai()">Đóng</button></div>'
  );
  const nutLuu = document.getElementById("nut-luu-ho-so");
  if (nutLuu) {
    nutLuu.addEventListener("click", function () {
      const ten = document.getElementById("ho-so-ten").value.trim();
      const email = document.getElementById("ho-so-email").value.trim();
      if (!ten) {
        hienThongBao("Họ tên không được để trống.", "loi");
        return;
      }
      localStorage.setItem(KHOA_HO_SO, JSON.stringify({ ten: ten, email: email }));
      dongHopThoai();
      khoiTaoThanhTren();
      hienThongBao("Đã lưu thông tin hồ sơ.", "thanh-cong");
    });
  }
}

function moHopThoaiCaiDat() {
  moHopThoai(
    '<h3 class="tieu-de-hop-thoai">Cài đặt</h3>' +
    '<p>Mục này chỉ có tác dụng trong phạm vi frontend.</p>' +
    '<div class="khung-huy">' +
    '<strong>Đặt lại dữ liệu phân hệ</strong>' +
    '<p class="chu-thich">Xóa toàn bộ ticket, bình luận, đánh giá và thông báo hiện có trong trình duyệt này rồi nạp lại dữ liệu mẫu.</p>' +
    '<button class="nut nut-nguy-hiem" id="nut-dat-lai-du-lieu">Đặt lại dữ liệu</button>' +
    '</div>' +
    '<div class="khung-nut" style="margin-top:16px"><button class="nut nut-phu" onclick="dongHopThoai()">Đóng</button></div>'
  );
  const nutDatLai = document.getElementById("nut-dat-lai-du-lieu");
  if (nutDatLai) {
    nutDatLai.addEventListener("click", function () {
      localStorage.removeItem(KHOA_TICKET);
      localStorage.removeItem(KHOA_THONG_BAO);
      khoiTaoDuLieuMau();
      window.location.reload();
    });
  }
}

function khoiTaoThanhBen() {
  const cacChucNang = document.querySelectorAll("[data-chuc-nang]");
  for (const muc of cacChucNang) {
    muc.addEventListener("click", function (e) {
      e.preventDefault();
      moChucNang(muc.getAttribute("data-chuc-nang"));
      document.getElementById("thanh-ben").classList.remove("mo");
    });
  }
}

function khoiTaoThanhTren() {
  const oTim = document.getElementById("tim-kiem-toan-bo");
  if (oTim) {
    // Gõ Enter: chuyển sang trang Ticket của tôi và tìm theo từ khóa
    oTim.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const tuKhoa = oTim.value.trim();
        window.location.href = "ticket-cua-toi.html?tim=" + encodeURIComponent(tuKhoa);
      }
    });

    // Ở trang Tổng quan: gõ tới đâu lọc bảng Ticket gần đây tới đó
    if (document.body.getAttribute("data-trang") === "tong-quan") {
      oTim.addEventListener("input", function () {
        hienThiTicketGanDay(layDanhSachTicket(), oTim.value);
      });
    }
  }

  const nutChuong = document.getElementById("nut-thong-bao");
  if (nutChuong) nutChuong.addEventListener("click", moHopThoaiThongBao);

  const nutMenu = document.getElementById("nut-menu");
  if (nutMenu) {
    nutMenu.addEventListener("click", function () {
      document.getElementById("thanh-ben").classList.toggle("mo");
    });
  }

  const hoSo = layHoSo();
  const tenEl = document.getElementById("ten-nguoi-dung");
  if (tenEl) tenEl.textContent = hoSo.ten;
  const anhEl = document.getElementById("anh-dai-dien");
  if (anhEl) anhEl.textContent = hoSo.ten.trim().charAt(0).toUpperCase();
  capNhatSoThongBao();
}

/* =========================================================
   PHẦN 6: TRANG TỔNG QUAN
   ========================================================= */

function layLoiChao() {
  const gio = new Date().getHours();
  if (gio < 12) return "Chào buổi sáng";
  if (gio < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function hienThiTongQuan() {
  const danhSach = layDanhSachTicket();
  const soDangXuLy = danhSach.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); }).length;
  const soHoanThanh = danhSach.filter(function (t) { return t.trangThai === "Hoàn thành"; }).length;
  const soCanBoSung = danhSach.filter(function (t) { return t.trangThai === "Chờ bổ sung"; }).length;

  document.getElementById("tong-ticket").textContent = danhSach.length;
  document.getElementById("so-dang-xu-ly").textContent = soDangXuLy;
  document.getElementById("so-hoan-thanh").textContent = soHoanThanh;
  document.getElementById("so-can-bo-sung").textContent = soCanBoSung;

  const loiChao = document.getElementById("loi-chao");
  if (loiChao) loiChao.textContent = layLoiChao() + ", " + layHoSo().ten + "!";
  const tenChao = document.getElementById("ten-chao-trang");
  if (tenChao) tenChao.textContent = layHoSo().ten;

  hienThiTicketGanDay(danhSach);
  hienThiTiendDo(danhSach);
}

function hienThiTicketGanDay(danhSach, tuKhoa) {
  const tbody = document.getElementById("bang-ticket-gan-day");
  if (!tbody) return;

  // Lọc theo từ khóa (mã ticket, tiêu đề, thiết bị, vị trí) nếu người dùng có nhập
  let daLoc = danhSach;
  const tuKhoaTim = (tuKhoa || "").trim().toLowerCase();
  if (tuKhoaTim) {
    daLoc = danhSach.filter(function (ticket) {
      const chuoiTim = (ticket.id + " " + ticket.tieuDe + " " + ticket.thietBi + " " + ticket.viTri).toLowerCase();
      return chuoiTim.includes(tuKhoaTim);
    });
  }

  const moiNhat = daLoc.slice().sort(function (a, b) {
    return new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime();
  }).slice(0, 5);

  if (moiNhat.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="thong-bao-trang">' +
      (tuKhoaTim ? "Không tìm thấy ticket phù hợp với từ khóa." : "Chưa có ticket nào. Hãy tạo ticket đầu tiên.") +
      "</td></tr>";
    return;
  }

  tbody.innerHTML = moiNhat.map(function (ticket) {
    return '<tr data-ma="' + anToan(ticket.id) + '">' +
      '<td class="ma-ticket">' + anToan(ticket.id) + "</td>" +
      "<td>" + anToan(ticket.tieuDe) + "</td>" +
      '<td><span class="nhan ' + nhanMucDo(ticket.mucDo) + '">' + anToan(ticket.mucDo) + "</span></td>" +
      '<td><span class="nhan ' + nhanTrangThai(ticket.trangThai) + '">' + anToan(ticket.trangThai) + "</span></td>" +
      "<td>" + dinhDangSLA(ticket) + "</td></tr>";
  }).join("");

  const cacDong = tbody.querySelectorAll("tr[data-ma]");
  for (const dong of cacDong) {
    dong.addEventListener("click", function () {
      window.location.href = "chi-tiet-ticket.html?id=" + encodeURIComponent(dong.getAttribute("data-ma"));
    });
  }
}

function hienThiTiendDo(danhSach) {
  const khung = document.getElementById("khung-tien-do");
  if (!khung) return;

  const dangXuLy = danhSach.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); })
    .sort(function (a, b) { return tinhSoGioConLai(a) - tinhSoGioConLai(b); })
    .slice(0, 3);

  if (dangXuLy.length === 0) {
    khung.innerHTML = '<p class="thong-bao-trang">Không có ticket đang xử lý.</p>';
    return;
  }

  khung.innerHTML = dangXuLy.map(function (ticket) {
    const soGioToiDa = laySoGioSLA(ticket.mucDo);
    const conLai = tinhSoGioConLai(ticket);
    let phanTram = Math.round(100 - (conLai / soGioToiDa) * 100);
    if (phanTram < 0) phanTram = 0;
    if (phanTram > 100) phanTram = 100;
    const lop = phanTram >= 85 ? "nguy-hiem" : (phanTram >= 60 ? "canh-bao" : "");
    return '<div class="dong-tien-do">' +
      '<div class="ten-ticket">' + anToan(ticket.id) + " · " + anToan(ticket.tieuDe) + "</div>" +
      '<div class="thanh-tien-do"><span class="' + lop + '" style="width:' + phanTram + '%"></span></div>' +
      "</div>";
  }).join("");
}

/* =========================================================
   PHẦN 7: TRANG TẠO TICKET
   ========================================================= */

let mucDoDangChon = "Trung bình";
let danhSachAnhDangChon = [];
let dangGuiTicket = false;

function khoiTaoTrangTaoTicket() {
  const form = document.getElementById("bieu-muc-tao-ticket");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      xuLyGuiTicket();
    });
  }

  const cacNutMucDo = document.querySelectorAll(".nut-muc-do");
  for (const nut of cacNutMucDo) {
    nut.addEventListener("click", function () {
      mucDoDangChon = nut.getAttribute("data-muc");
      for (const nutKhac of cacNutMucDo) nutKhac.classList.remove("duoc-chon");
      nut.classList.add("duoc-chon");
    });
  }

  const dauVaoAnh = document.getElementById("dau-vao-anh");
  if (dauVaoAnh) {
    dauVaoAnh.addEventListener("change", function () {
      xuLyChonAnh(dauVaoAnh.files);
      dauVaoAnh.value = "";
    });
  }

  const vungAnh = document.getElementById("vung-anh");
  if (vungAnh) {
    vungAnh.addEventListener("click", function () { dauVaoAnh.click(); });
    vungAnh.addEventListener("dragover", function (e) {
      e.preventDefault();
      vungAnh.classList.add("keo-vao");
    });
    vungAnh.addEventListener("dragleave", function () { vungAnh.classList.remove("keo-vao"); });
    vungAnh.addEventListener("drop", function (e) {
      e.preventDefault();
      vungAnh.classList.remove("keo-vao");
      xuLyChonAnh(e.dataTransfer.files);
    });
  }

  const nutHuy = document.getElementById("nut-huy-form");
  if (nutHuy) {
    nutHuy.addEventListener("click", function () {
      // Nếu đã nhập dữ liệu thì hỏi lại để tránh mất thông tin ngoài ý muốn
      if (bieuMucCoDuLieu() && !window.confirm("Bạn có chắc muốn hủy? Thông tin đã nhập sẽ không được lưu.")) return;
      window.location.href = "ticket-cua-toi.html";
    });
  }

  datLaiKetQuaPhanLoai();
}

// Kiểm tra biểu mẫu tạo ticket đã có dữ liệu người dùng nhập hay chưa
function bieuMucCoDuLieu() {
  const cacTruong = ["truong-thiet-bi", "truong-vi-tri", "truong-tieu-de", "truong-mo-ta"];
  for (const id of cacTruong) {
    const o = document.getElementById(id);
    if (o && o.value.trim()) return true;
  }
  return danhSachAnhDangChon.length > 0;
}

function xuLyChonAnh(danhSachFile) {
  for (const file of danhSachFile) {
    if (!DINH_DANG_ANH.includes(file.type)) {
      hienThongBao("Chỉ chấp nhận ảnh định dạng PNG hoặc JPG.", "loi");
      continue;
    }
    if (file.size > KICH_THUOC_ANH_TOI_DA) {
      hienThongBao("Ảnh " + file.name + " quá lớn, tối đa 1,5 MB.", "loi");
      continue;
    }
    const docFile = new FileReader();
    docFile.onload = function (e) {
      danhSachAnhDangChon.push(e.target.result);
      hienThiAnhXemTruoc();
    };
    docFile.readAsDataURL(file);
  }
}

function hienThiAnhXemTruoc() {
  const khung = document.getElementById("danh-sach-anh");
  if (!khung) return;
  khung.innerHTML = danhSachAnhDangChon.map(function (duongDan, viTri) {
    return '<div class="anh-o"><img class="anh-xem-truoc" src="' + duongDan + '" alt="Ảnh sự cố">' +
      '<button type="button" class="nut-xoa-anh" data-vi-tri="' + viTri + '" title="Xóa ảnh">×</button></div>';
  }).join("");

  const cacNutXoa = khung.querySelectorAll(".nut-xoa-anh");
  for (const nut of cacNutXoa) {
    nut.addEventListener("click", function () {
      danhSachAnhDangChon.splice(Number(nut.getAttribute("data-vi-tri")), 1);
      hienThiAnhXemTruoc();
    });
  }
}

// Kiểm tra biểu mẫu, trả về true nếu hợp lệ
function kiemTraBieuMuc() {
  let hopLe = true;
  let oLoiDauTien = null; // ô nhập lỗi đầu tiên để đưa con trỏ tới đó

  const cap = function (idTruong, idLoi, thongDiep) {
    const nhom = document.getElementById(idTruong).closest(".nhom-truong");
    const oLoi = document.getElementById(idLoi);
    if (thongDiep) {
      nhom.classList.add("truong-loi");
      oLoi.textContent = thongDiep;
      hopLe = false;
      if (!oLoiDauTien) oLoiDauTien = document.getElementById(idTruong);
    } else {
      nhom.classList.remove("truong-loi");
      oLoi.textContent = "";
    }
  };

  cap("truong-thiet-bi", "loi-thiet-bi", document.getElementById("truong-thiet-bi").value.trim() ? "" : "Vui lòng chọn hoặc nhập thiết bị.");
  cap("truong-vi-tri", "loi-vi-tri", document.getElementById("truong-vi-tri").value.trim() ? "" : "Vui lòng nhập vị trí thiết bị.");
  cap("truong-tieu-de", "loi-tieu-de", document.getElementById("truong-tieu-de").value.trim() ? "" : "Vui lòng nhập tiêu đề sự cố.");
  cap("truong-mo-ta", "loi-mo-ta", document.getElementById("truong-mo-ta").value.trim() ? "" : "Vui lòng nhập mô tả sự cố.");

  if (oLoiDauTien) oLoiDauTien.focus();
  return hopLe;
}

// Mô phỏng phân loại sự cố dựa trên từ khóa (KHÔNG phải AI thật)
function moPhongPhanLoai(tieuDe, moTa) {
  const vanBan = (tieuDe + " " + moTa).toLowerCase();
  const cacNhom = [
    { danhMuc: "Điện lạnh", tuKhoa: ["máy lạnh", "điều hòa", "lanh", "không mát", "gas", "chảy nước"] },
    { danhMuc: "Mạng", tuKhoa: ["wifi", "router", "mạng", "internet", "chập chờn", "switch", "mạng chậm"] },
    { danhMuc: "Máy in", tuKhoa: ["máy in", "kẹt giấy", "mực", "in"] },
    { danhMuc: "Thiết bị trình chiếu", tuKhoa: ["máy chiếu", "màn hình", "projector", "chiếu"] },
    { danhMuc: "Điện", tuKhoa: ["ổ cắm", "điện", "đèn", "cầu dao", "chập", "mất điện"] },
    { danhMuc: "Âm thanh", tuKhoa: ["loa", "micro", "âm thanh", "rè"] },
    { danhMuc: "Camera", tuKhoa: ["camera", "tín hiệu", "giám sát"] }
  ];

  let ketQua = { danhMuc: "Chưa xác định", doTinCay: 40, soTuKhoa: 0 };

  for (const nhom of cacNhom) {
    let soTuKhoa = 0;
    for (const tu of nhom.tuKhoa) {
      if (vanBan.includes(tu)) soTuKhoa++;
    }
    if (soTuKhoa > ketQua.soTuKhoa) {
      ketQua = { danhMuc: nhom.danhMuc, doTinCay: Math.min(95, 55 + soTuKhoa * 13), soTuKhoa: soTuKhoa };
    }
  }
  return ketQua;
}

function datLaiKetQuaPhanLoai() {
  const khung = document.getElementById("khung-phan-loai");
  if (!khung) return;
  khung.innerHTML =
    '<div class="nhan-tin-cay">92% tin cậy</div>' +
    '<h3 class="tieu-de-the">Chờ phân tích</h3>' +
    '<p class="dong-ket-qua">Nhập thông tin sự cố rồi bấm <strong>Gửi &amp; Phân tích AI</strong> để hệ thống mô phỏng phân loại.</p>' +
    '<p class="dong-ket-qua">Kết quả chỉ được tính từ tiêu đề và mô tả, hoàn toàn bằng JavaScript.</p>';
}

function xuLyGuiTicket() {
  if (dangGuiTicket) return; // chặn gửi nhiều lần
  if (!kiemTraBieuMuc()) {
    hienThongBao("Vui lòng điền đầy đủ các trường bắt buộc.", "loi");
    return;
  }

  dangGuiTicket = true;
  const nutGui = document.getElementById("nut-gui");
  nutGui.setAttribute("disabled", "");

  const tieuDe = document.getElementById("truong-tieu-de").value.trim();
  const moTa = document.getElementById("truong-mo-ta").value.trim();

  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML = '<p class="dang-tai">Đang phân tích nội dung văn bản...</p>';

  setTimeout(function () {
    const ketQua = moPhongPhanLoai(tieuDe, moTa);
    hienThiKetQuaPhanLoai(ketQua);
    nutGui.removeAttribute("disabled");
    dangGuiTicket = false;
  }, 700);
}

function hienThiKetQuaPhanLoai(ketQua) {
  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML =
    '<div class="nhan-tin-cay">' + ketQua.doTinCay + "% tin cậy</div>" +
    '<h3 class="tieu-de-the">' + anToan(ketQua.danhMuc) + "</h3>" +
    '<p class="dong-ket-qua">Từ khóa: ' + anToan(ketQua.soTuKhoa) + " từ khóa phù hợp</p>" +
    '<p class="dong-ket-qua">Đây là kết quả mô phỏng phía frontend, không phải AI thật.</p>' +
    (danhSachAnhDangChon.length > 0
      ? '<p class="dong-ket-qua">Ảnh đính kèm chỉ được lưu kèm ticket, KHÔNG được phân tích hình ảnh.</p>'
      : "") +
    (ketQua.doTinCay < 70
      ? '<p class="thong-tiep-nhan">Chưa chắc chắn ' + ketQua.doTinCay + "% · Hãy mô tả chi tiết hơn.</p>"
      : "") +
    '<div class="khung-nut-ai">' +
    '<button class="nut nut-chinh nut-nho" id="nut-chap-nhan">Chấp nhận</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-sua-phan-loai">Sửa</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-tu-choi">Từ chối</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-tao-lai">Tạo lại</button>' +
    "</div>";

  document.getElementById("nut-chap-nhan").addEventListener("click", function () {
    taoTicketMoi(ketQua.danhMuc);
  });
  document.getElementById("nut-tu-choi").addEventListener("click", function () {
    datLaiKetQuaPhanLoai();
    hienThongBao("Đã hủy kết quả phân loại, ticket chưa được tạo.", "thanh-cong");
  });
  document.getElementById("nut-tao-lai").addEventListener("click", function () {
    xuLyGuiTicket(); // phân tích lại nội dung đang nhập, không tải lại trang để không mất dữ liệu
  });
  document.getElementById("nut-sua-phan-loai").addEventListener("click", function () {
    hienThiOChonPhanLoai(ketQua.danhMuc);
  });
}

function hienThiOChonPhanLoai(danhMucHienTai) {
  const khung = document.getElementById("khung-phan-loai");
  const cacDanhMuc = ["Điện lạnh", "Mạng", "Máy in", "Thiết bị trình chiếu", "Điện", "Âm thanh", "Camera", "Cơ điện", "Thiết bị văn phòng", "Chưa xác định"];
  khung.innerHTML =
    '<h3 class="tieu-de-the">Chọn lại danh mục</h3>' +
    '<select class="o-chon" id="o-chon-danh-muc">' +
    cacDanhMuc.map(function (ten) {
      return '<option value="' + anToan(ten) + '"' + (ten === danhMucHienTai ? " selected" : "") + ">" + anToan(ten) + "</option>";
    }).join("") +
    "</select>" +
    '<div class="khung-nut-ai">' +
    '<button class="nut nut-chinh nut-nho" id="nut-xac-nhan-phan-loai">Xác nhận</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-quay-lai">Quay lại</button>' +
    "</div>";

  document.getElementById("nut-xac-nhan-phan-loai").addEventListener("click", function () {
    taoTicketMoi(document.getElementById("o-chon-danh-muc").value);
  });
  document.getElementById("nut-quay-lai").addEventListener("click", function () {
    datLaiKetQuaPhanLoai();
  });
}

function taoTicketMoi(danhMuc) {
  const ngayTao = new Date().toISOString();
  const ticket = {
    id: taoMaTicketMoi(),
    thietBi: document.getElementById("truong-thiet-bi").value.trim(),
    viTri: document.getElementById("truong-vi-tri").value.trim(),
    tieuDe: document.getElementById("truong-tieu-de").value.trim(),
    moTa: document.getElementById("truong-mo-ta").value.trim(),
    mucDo: mucDoDangChon,
    trangThai: "Mới",
    danhMuc: danhMuc,
    ngayTao: ngayTao,
    ngayCapNhat: ngayTao,
    hanXuLy: congGio(ngayTao, laySoGioSLA(mucDoDangChon)),
    nguoiPhuTran: "Chưa phân công",
    lichSu: [],
    binhLuan: [],
    danhGia: 0,
    lyDoHuy: "",
    anhDinhKem: danhSachAnhDangChon.slice()
  };
  ticket.lichSu = taoLichSuMacDinh(ticket);

  const danhSach = layDanhSachTicket();
  danhSach.push(ticket);
  const daLuu = luuDanhSachTicket(danhSach);

  if (!daLuu) {
    hienThongBao("Không lưu được ticket, thử lại với ít ảnh hơn.", "loi");
    return;
  }

  themThongBao("Ticket " + ticket.id + " đã được tạo lúc " + dinhDangGio(ngayTao) + ".");
  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML =
    '<div class="nhan-tin-cay">Đã tạo ticket</div>' +
    '<h3 class="tieu-de-the">' + anToan(ticket.id) + "</h3>" +
    '<p class="dong-ket-qua">Ticket đã được lưu trong trình duyệt và xuất hiện ở trang Tổng quan, Ticket của tôi.</p>' +
    '<div class="khung-nut-ai">' +
    '<a class="nut nut-chinh nut-nho" href="chi-tiet-ticket.html?id=' + encodeURIComponent(ticket.id) + '">Xem chi tiết</a>' +
    '<a class="nut nut-phu nut-nho" href="ticket-cua-toi.html">Về danh sách</a>' +
    "</div>";

  hienThongBao("Đã tạo ticket " + ticket.id + " thành công.", "thanh-cong");
}

/* =========================================================
   PHẦN 8: TRANG TICKET CỦA TÔI
   ========================================================= */

let trangHienTai = 1;
let nhomDangChon = "tat-ca";

function khoiTaoTrangDanhSach() {
  const thamSo = new URLSearchParams(window.location.search);
  const tuKhoaURL = thamSo.get("tim");
  const oTim = document.getElementById("tim-kiem-danh-sach");
  if (tuKhoaURL && oTim) oTim.value = tuKhoaURL;

  // Ô tìm kiếm dùng sự kiện "input" (gõ tới đâu lọc tới đó), các ô chọn dùng "change"
  const oTimKiem = document.getElementById("tim-kiem-danh-sach");
  if (oTimKiem) {
    oTimKiem.addEventListener("input", function () {
      trangHienTai = 1;
      hienThiDanhSachTicket();
    });
  }

  const cacBoLoc = ["loc-trang-thai", "loc-muc-do", "loc-thoi-gian"];
  for (const id of cacBoLoc) {
    const o = document.getElementById(id);
    if (o) {
      o.addEventListener("change", function () {
        trangHienTai = 1;
        hienThiDanhSachTicket();
      });
    }
  }

  const nutDatLai = document.getElementById("nut-dat-lai");
  if (nutDatLai) {
    nutDatLai.addEventListener("click", function () {
      document.getElementById("tim-kiem-danh-sach").value = "";
      document.getElementById("loc-trang-thai").value = "tat-ca";
      document.getElementById("loc-muc-do").value = "tat-ca";
      document.getElementById("loc-thoi-gian").value = "tat-ca";
      nhomDangChon = "tat-ca";
      trangHienTai = 1;
      hienThiDanhSachTicket();
    });
  }

  const cacTab = document.querySelectorAll(".tab");
  for (const tab of cacTab) {
    tab.addEventListener("click", function () {
      nhomDangChon = tab.getAttribute("data-nhom");
      for (const tabKhac of cacTab) tabKhac.classList.remove("dang-chon");
      tab.classList.add("dang-chon");
      trangHienTai = 1;
      hienThiDanhSachTicket();
    });
  }

  hienThiDanhSachTicket();
}

// Lọc theo ô tìm kiếm, trạng thái, mức độ và thời gian
function locDanhSachTheoBoLoc() {
  const danhSach = layDanhSachTicket();
  const oTim = document.getElementById("tim-kiem-danh-sach");
  const tuKhoa = oTim ? oTim.value.trim().toLowerCase() : "";
  const trangThai = document.getElementById("loc-trang-thai").value;
  const mucDo = document.getElementById("loc-muc-do").value;
  const thoiGian = document.getElementById("loc-thoi-gian").value;
  const bayGio = Date.now();

  return danhSach.filter(function (ticket) {
    if (tuKhoa) {
      const chuoiTim = (ticket.id + " " + ticket.tieuDe + " " + ticket.thietBi + " " + ticket.viTri).toLowerCase();
      if (!chuoiTim.includes(tuKhoa)) return false;
    }
    if (trangThai !== "tat-ca" && ticket.trangThai !== trangThai) return false;
    if (mucDo !== "tat-ca" && ticket.mucDo !== mucDo) return false;

    const soGioTruoc = (bayGio - new Date(ticket.ngayTao).getTime()) / 3600000;
    if (thoiGian === "hom-nay" && soGioTruoc > 24) return false;
    if (thoiGian === "7-ngay" && soGioTruoc > 24 * 7) return false;
    if (thoiGian === "30-ngay" && soGioTruoc > 24 * 30) return false;

    return true;
  });
}

// Lọc thêm theo tab đang chọn
function locDanhSachTicket() {
  const daLoc = locDanhSachTheoBoLoc();
  if (nhomDangChon === "dang-xu-ly") {
    return daLoc.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); });
  }
  if (nhomDangChon === "hoan-thanh") {
    return daLoc.filter(function (t) { return t.trangThai === "Hoàn thành"; });
  }
  return daLoc;
}

function hienThiDanhSachTicket() {
  const daLoc = locDanhSachTheoBoLoc();
  const ketQua = locDanhSachTicket().sort(function (a, b) {
    return new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime();
  });

  // Cập nhật số lượng trên các tab
  const soTatCa = daLoc.length;
  const soDangXuLy = daLoc.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); }).length;
  const soHoanThanh = daLoc.filter(function (t) { return t.trangThai === "Hoàn thành"; }).length;
  document.getElementById("so-tat-ca").textContent = soTatCa;
  document.getElementById("so-dang-xu-ly-tab").textContent = soDangXuLy;
  document.getElementById("so-hoan-thanh-tab").textContent = soHoanThanh;

  const tbody = document.getElementById("bang-ticket");
  if (ketQua.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="thong-bao-trang">Không tìm thấy ticket phù hợp.</td></tr>';
    document.getElementById("phan-trang").innerHTML = "";
    document.getElementById("thong-tin-trang").textContent = "0 / " + ketQua.length + " ticket";
    return;
  }

  const tongTrang = Math.ceil(ketQua.length / SO_DONG_MOI_TRANG);
  if (trangHienTai > tongTrang) trangHienTai = tongTrang;
  const batDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;
  const trangDuLieu = ketQua.slice(batDau, batDau + SO_DONG_MOI_TRANG);

  tbody.innerHTML = trangDuLieu.map(function (ticket) {
    return '<tr data-ma="' + anToan(ticket.id) + '">' +
      '<td class="ma-ticket">' + anToan(ticket.id) + "</td>" +
      "<td>" + anToan(ticket.tieuDe) + "</td>" +
      '<td><span class="nhan ' + nhanMucDo(ticket.mucDo) + '">' + anToan(ticket.mucDo) + "</span></td>" +
      '<td><span class="nhan ' + nhanTrangThai(ticket.trangThai) + '">' + anToan(ticket.trangThai) + "</span></td>" +
      "<td>" + dinhDangSLA(ticket) + "</td></tr>";
  }).join("");

  const cacDong = tbody.querySelectorAll("tr[data-ma]");
  for (const dong of cacDong) {
    dong.addEventListener("click", function () {
      window.location.href = "chi-tiet-ticket.html?id=" + encodeURIComponent(dong.getAttribute("data-ma"));
    });
  }

  document.getElementById("thong-tin-trang").textContent =
    (batDau + 1) + "–" + (batDau + trangDuLieu.length) + " / " + ketQua.length + " ticket";

  hienThiPhanTrang(tongTrang);
}

function hienThiPhanTrang(tongTrang) {
  const khung = document.getElementById("phan-trang");
  khung.innerHTML = "";
  if (tongTrang <= 1) return;

  for (let i = 1; i <= tongTrang; i++) {
    const nut = document.createElement("button");
    nut.className = "nut-trang" + (i === trangHienTai ? " dang-chon" : "");
    nut.textContent = i;
    nut.addEventListener("click", function () {
      trangHienTai = i;
      hienThiDanhSachTicket();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    khung.appendChild(nut);
  }
}

/* =========================================================
   PHẦN 9: TRANG CHI TIẾT TICKET
   ========================================================= */

let ticketDangXem = null;

function khoiTaoTrangChiTiet() {
  const thamSo = new URLSearchParams(window.location.search);
  const ma = thamSo.get("id");
  const ticket = ma ? timTicketTheoMa(ma) : null;

  if (!ticket) {
    document.getElementById("khung-chi-tiet").classList.add("an");
    document.getElementById("khung-khong-tim-thay").classList.remove("an");
    const oMa = document.getElementById("ma-khong-tim-thay");
    if (oMa) oMa.textContent = ma || "(không có mã)";
    return;
  }

  ticketDangXem = ticket;
  hienThiChiTietTicket(ticket);
}

// Ticket đã kết thúc (đã hủy hoặc hoàn thành) thì không cho hủy nữa
function coTheHuy(ticket) {
  return ticket.trangThai !== "Hủy" && ticket.trangThai !== "Hoàn thành";
}

function hienThiChiTietTicket(ticket) {
  const khung = document.getElementById("khung-chi-tiet");
  khung.classList.remove("an");
  document.getElementById("khung-khong-tim-thay").classList.add("an");

  // Dữ liệu cũ có thể thiếu 2 mảng này, bổ sung để tránh lỗi khi hiển thị
  ticket.lichSu = ticket.lichSu || [];
  ticket.binhLuan = ticket.binhLuan || [];

  // Hiển thị mã ticket lên dòng đường dẫn phía trên tiêu đề
  const maDuongDan = document.getElementById("ma-duong-dan");
  if (maDuongDan) maDuongDan.textContent = ticket.id;

  const anhHTML = ticket.anhDinhKem && ticket.anhDinhKem.length > 0
    ? ticket.anhDinhKem.map(function (duongDan) {
        return '<img class="anh-chi-tiet" src="' + duongDan + '" alt="Ảnh sự cố">';
      }).join("")
    : '<p class="chu-thich">Chưa có ảnh đính kèm.</p>';

  const lichSuHTML = ticket.lichSu.map(function (moc) {
    return '<li class="moc-thoi-gian"><span class="cham-thoi-gian"></span>' +
      '<span class="thoi-gian-moc">' + anToan(dinhDangGio(moc.thoiGian) + " · " + dinhDangNgay(moc.thoiGian)) + "</span>" +
      "<span>" + anToan(moc.noiDung) + "</span></li>";
  }).join("");

  const binhLuanHTML = ticket.binhLuan.map(function (bl) {
    return '<div class="binh-luan"><div class="nguoi-viet">' + anToan(bl.nguoiViet) +
      '<span class="thoi-gian-binh-luan">' + anToan(dinhDangNgayGio(bl.thoiGian)) + "</span></div>" +
      "<div>" + anToan(bl.noiDung) + "</div></div>";
  }).join("");

  const gioConLai = tinhSoGioConLai(ticket);
  const soGioToiDa = laySoGioSLA(ticket.mucDo);
  let phanTramSLA = Math.round(100 - (gioConLai / soGioToiDa) * 100);
  if (phanTramSLA < 0) phanTramSLA = 0;
  if (phanTramSLA > 100) phanTramSLA = 100;

  // Câu hiển thị trong thẻ SLA, phụ thuộc trạng thái ticket
  let chuoiSLA = "";
  if (ticket.trangThai === "Hoàn thành") chuoiSLA = "Đã hoàn thành";
  else if (ticket.trangThai === "Hủy") chuoiSLA = "Đã hủy";
  else if (gioConLai >= 0) chuoiSLA = "Còn " + gioConLai + " giờ";
  else chuoiSLA = "Quá hạn " + Math.abs(gioConLai) + " giờ";

  let saoHTML = "";
  for (let i = 1; i <= 5; i++) {
    saoHTML += '<button class="sao' + (i <= ticket.danhGia ? " duoc-chon" : "") + '" data-diem="' + i +
      '" title="' + i + ' sao">★</button>';
  }
  const danhGiaChoPhep = ticket.trangThai === "Hoàn thành";

  khung.innerHTML =
    // Phần đầu trang: tiêu đề, mã ticket, trạng thái, mức độ, ngày tạo và các nút thao tác
    '<div class="dau-chi-tiet">' +
    "<div>" +
    '<h1 class="tieu-de-trang">' + anToan(ticket.tieuDe) + "</h1>" +
    '<p class="dong-meta">' +
    "<span>" + anToan(ticket.id) + "</span>" +
    '<span class="nhan ' + nhanTrangThai(ticket.trangThai) + '">' + anToan(ticket.trangThai) + "</span>" +
    '<span class="nhan ' + nhanMucDo(ticket.mucDo) + '">' + anToan(ticket.mucDo) + "</span>" +
    "<span>Tạo ngày " + anToan(dinhDangNgay(ticket.ngayTao)) + "</span>" +
    "</p>" +
    "</div>" +
    '<div class="khung-nut" id="khung-nut-xem">' +
    (coTheHuy(ticket) ? '<button class="nut nut-phu" id="nut-sua">Sửa</button>' : "") +
    (coTheHuy(ticket) ? '<button class="nut nut-nguy-hiem" id="nut-huy-ticket">Hủy</button>' : "") +
    '<button class="nut nut-phu" id="nut-in">In</button>' +
    "</div>" +
    "</div>" +
    '<div class="khung-nut an" id="khung-nut-chinh-sua">' +
    '<button class="nut nut-chinh" id="nut-luu-chinh-sua">Lưu thay đổi</button>' +
    '<button class="nut nut-phu" id="nut-huy-chinh-sua">Hủy bỏ</button>' +
    "</div>" +

    '<div class="luoi-hai-cot">' +
    "<div>" +
    '<div class="the">' +
    '<h2 class="tieu-de-the">Thông tin sự cố</h2>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-tieu-de">Tiêu đề</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-tieu-de" value="' + anToan(ticket.tieuDe) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-mo-ta">Mô tả</label>' +
    '<textarea class="o-textarea truong-chinh-sua" id="ct-mo-ta" disabled>' + anToan(ticket.moTa) + "</textarea></div>" +
    '<div class="nhom-truong"><label class="nhan-truong">Ảnh đính kèm</label>' + anhHTML + "</div>" +
    "</div>" +

    '<div class="the"><h2 class="tieu-de-the">Dòng thời gian</h2>' +
    '<ul class="dong-thoi-gian">' + lichSuHTML + "</ul></div>" +

    '<div class="the"><h2 class="tieu-de-the">Bình luận</h2>' +
    '<div class="danh-sach-binh-luan">' + (binhLuanHTML || '<p class="chu-thich">Chưa có bình luận nào.</p>') + "</div>" +
    '<div class="nhom-truong"><textarea class="o-textarea" id="o-binh-luan" placeholder="Viết bình luận..." style="min-height:80px"></textarea></div>' +
    '<button class="nut nut-chinh" id="nut-them-binh-luan">Gửi bình luận</button>' +
    "</div>" +
    "</div>" +

    '<div class="cot-phai">' +
    '<div class="the">' +
    '<h2 class="tieu-de-the">Thông tin thiết bị</h2>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-thiet-bi">Thiết bị</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-thiet-bi" value="' + anToan(ticket.thietBi) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-vi-tri">Vị trí</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-vi-tri" value="' + anToan(ticket.viTri) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-muc-do">Mức độ ưu tiên</label>' +
    '<select class="o-chon truong-chinh-sua" id="ct-muc-do" disabled>' +
    DANH_SACH_MUC_DO.map(function (muc) {
      return '<option value="' + muc + '"' + (muc === ticket.mucDo ? " selected" : "") + ">" + muc + "</option>";
    }).join("") + "</select></div>" +
    '<div class="dong-thong-tin"><span>Danh mục</span><strong>' + anToan(ticket.danhMuc) + "</strong></div>" +
    '<div class="dong-thong-tin"><span>Người phụ trách</span><strong>' + anToan(ticket.nguoiPhuTran) + "</strong></div>" +
    "</div>" +

    '<div class="the the-sla">' +
    '<p class="so-sla">' + chuoiSLA + "</p>" +
    '<div class="thanh-tien-do"><span class="' + (phanTramSLA >= 85 ? "nguy-hiem" : (phanTramSLA >= 60 ? "canh-bao" : "")) + '" style="width:' + phanTramSLA + '%"></span></div>' +
    '<p class="chu-thich">Hạn xử lý: ' + anToan(dinhDangGio(ticket.hanXuLy) + " · " + dinhDangNgay(ticket.hanXuLy)) + "</p>" +
    "</div>" +

    '<div class="the"><h2 class="tieu-de-the">Đánh giá</h2>' +
    '<div class="khung-danh-gia">' + saoHTML + "</div>" +
    '<p class="chu-thich">' + (danhGiaChoPhep ? "Bấm vào sao để đánh giá dịch vụ." : "Chỉ đánh giá được khi ticket đã hoàn thành.") + "</p>" +
    "</div>" +

    (ticket.trangThai === "Hủy"
      ? '<div class="the"><h2 class="tieu-de-the">Ticket đã hủy</h2>' +
        "<p>Lý do hủy: <strong>" + anToan(ticket.lyDoHuy || "Không ghi rõ") + "</strong></p>" +
        '<p class="chu-thich">Ticket vẫn được giữ trong danh sách, không bị xóa khỏi dữ liệu.</p></div>'
      : "") +
    (coTheHuy(ticket)
      ? '<div class="khung-huy an" id="khung-xac-nhan-huy">' +
        '<h3 class="tieu-de-the">Xác nhận hủy ticket</h3>' +
        '<p class="chu-thich">Hành động này không thể hoàn tác. Ticket vẫn được giữ trong lịch sử.</p>' +
        '<div class="nhom-truong"><label class="nhan-truong" for="ly-do-huy">Lý do</label>' +
        '<select class="o-chon" id="ly-do-huy">' +
        '<option value="">-- Chọn lý do --</option>' +
        '<option value="Không còn nhu cầu">Không còn nhu cầu</option>' +
        '<option value="Tự xử lý được">Tự xử lý được</option>' +
        '<option value="Nhập sai thông tin">Nhập sai thông tin</option>' +
        '<option value="Khác">Khác</option>' +
        "</select></div>" +
        '<div class="nhom-truong"><label class="nhan-truong" for="ly-do-khac">Lý do khác (nếu chọn Khác)</label>' +
        '<input class="o-nhap" id="ly-do-khac"></div>' +
        '<button class="nut nut-nguy-hiem" id="nut-xac-nhan-huy">Xác nhận hủy</button>' +
        "</div>"
      : "") +
    "</div>" +
    "</div>";

  ganSuKienChiTiet(ticket);
}

function ganSuKienChiTiet(ticket) {
  const nutSua = document.getElementById("nut-sua");
  const nutHuyTicket = document.getElementById("nut-huy-ticket");
  const nutIn = document.getElementById("nut-in");
  const nutLuu = document.getElementById("nut-luu-chinh-sua");
  const nutHuyChinhSua = document.getElementById("nut-huy-chinh-sua");
  const nutBinhLuan = document.getElementById("nut-them-binh-luan");
  const nutXacNhanHuy = document.getElementById("nut-xac-nhan-huy");

  // Có nút nào không tồn tại (ticket đã hủy/hoàn thành) thì bỏ qua nút đó
  if (nutSua) nutSua.addEventListener("click", batCheDoChinhSua);
  if (nutHuyTicket) {
    nutHuyTicket.addEventListener("click", function () {
      document.getElementById("khung-xac-nhan-huy").classList.remove("an");
      document.getElementById("khung-xac-nhan-huy").scrollIntoView({ behavior: "smooth" });
    });
  }
  if (nutIn) nutIn.addEventListener("click", function () { window.print(); });
  if (nutHuyChinhSua) nutHuyChinhSua.addEventListener("click", function () { hienThiChiTietTicket(ticket); });
  if (nutLuu) nutLuu.addEventListener("click", function () { luuChinhSua(ticket); });
  if (nutBinhLuan) nutBinhLuan.addEventListener("click", function () { xuLyThemBinhLuan(ticket); });
  if (nutXacNhanHuy) nutXacNhanHuy.addEventListener("click", function () { xuLyXacNhanHuy(ticket); });

  const cacSao = document.querySelectorAll(".sao");
  for (const sao of cacSao) {
    sao.addEventListener("click", function () {
      if (ticket.trangThai !== "Hoàn thành") {
        hienThongBao("Chỉ đánh giá được khi ticket đã hoàn thành.", "loi");
        return;
      }
      ticket.danhGia = Number(sao.getAttribute("data-diem"));
      ticket.ngayCapNhat = new Date().toISOString();
      luuMotTicket(ticket);
      hienThiChiTietTicket(ticket);
      hienThongBao("Cảm ơn bạn đã đánh giá " + ticket.danhGia + " sao.", "thanh-cong");
    });
  }
}

function batCheDoChinhSua() {
  const cacTruong = document.querySelectorAll(".truong-chinh-sua");
  for (const truong of cacTruong) truong.removeAttribute("disabled");
  document.getElementById("khung-nut-xem").classList.add("an");
  document.getElementById("khung-nut-chinh-sua").classList.remove("an");
}

function luuChinhSua(ticket) {
  const tieuDe = document.getElementById("ct-tieu-de").value.trim();
  const moTa = document.getElementById("ct-mo-ta").value.trim();
  const thietBi = document.getElementById("ct-thiet-bi").value.trim();
  const viTri = document.getElementById("ct-vi-tri").value.trim();
  const mucDoMoi = document.getElementById("ct-muc-do").value;

  if (!tieuDe || !moTa || !thietBi || !viTri) {
    hienThongBao("Thiết bị, vị trí, tiêu đề và mô tả không được để trống.", "loi");
    return;
  }

  ticket.tieuDe = tieuDe;
  ticket.moTa = moTa;
  ticket.thietBi = thietBi;
  ticket.viTri = viTri;

  // Đổi mức độ ưu tiên thì phải tính lại hạn xử lý theo SLA của mức độ mới
  if (mucDoMoi !== ticket.mucDo) {
    ticket.mucDo = mucDoMoi;
    ticket.hanXuLy = congGio(ticket.ngayTao, laySoGioSLA(mucDoMoi));
  }

  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Cập nhật thông tin ticket" });

  luuMotTicket(ticket);
  themThongBao("Ticket " + ticket.id + " vừa được cập nhật.");
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã lưu thay đổi cho ticket " + ticket.id + ".", "thanh-cong");
}

function xuLyThemBinhLuan(ticket) {
  const oBinhLuan = document.getElementById("o-binh-luan");
  const noiDung = oBinhLuan.value.trim();
  if (!noiDung) {
    hienThongBao("Vui lòng nhập nội dung bình luận.", "loi");
    return;
  }

  ticket.binhLuan = ticket.binhLuan || [];
  ticket.binhLuan.push({ nguoiViet: layHoSo().ten, noiDung: noiDung, thoiGian: new Date().toISOString() });
  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Thêm bình luận" });

  luuMotTicket(ticket);
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã thêm bình luận.", "thanh-cong");
}

function xuLyXacNhanHuy(ticket) {
  const lyDoChon = document.getElementById("ly-do-huy").value;
  const lyDoKhac = document.getElementById("ly-do-khac").value.trim();

  if (!lyDoChon) {
    hienThongBao("Vui lòng chọn lý do hủy ticket.", "loi");
    return;
  }
  if (lyDoChon === "Khác" && !lyDoKhac) {
    hienThongBao("Vui lòng nhập lý do hủy.", "loi");
    return;
  }

  const lyDo = lyDoChon === "Khác" ? lyDoKhac : lyDoChon;
  ticket.trangThai = "Hủy";
  ticket.lyDoHuy = lyDo;
  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Hủy ticket - Lý do: " + lyDo });

  luuMotTicket(ticket);
  themThongBao("Ticket " + ticket.id + " đã bị hủy. Lý do: " + lyDo);
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã hủy ticket " + ticket.id + ".", "thanh-cong");
}

/* =========================================================
   PHẦN 10: KHỞI CHẠY TRANG
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  khoiTaoDuLieuMau();
  khoiTaoThanhBen();
  khoiTaoThanhTren();

  const trang = document.body.getAttribute("data-trang");
  if (trang === "tong-quan") hienThiTongQuan();
  else if (trang === "tao-ticket") khoiTaoTrangTaoTicket();
  else if (trang === "danh-sach") khoiTaoTrangDanhSach();
  else if (trang === "chi-tiet") khoiTaoTrangChiTiet();
});