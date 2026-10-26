/* =========================================================
   FIXFLOW - JAVASCRIPT DUNG CHUNG CHO 6 TRANG
   index.html (Tong quan) + queue.html .. analytics.html
   THU TU QUAN TRONG: du lieu -> ham -> khoiTaoTrang(); o cuoi file
   ========================================================= */

// ---------- 1. Du lieu dung chung ----------

const tenKyThuatVien = "Bùi Huy Quân";
const tenVaiTro = "Kỹ thuật viên";
let trangThaiLamViec = "Rảnh";
let thoiGianAnThongBao = 0;

// Du lieu ticket cua trang Tong quan
const danhSachTicket = [
  {
    id: 1, gio: "09:00", tenSuCo: "Máy lạnh không mát",
    maThietBi: "AC-023", diaDiem: "Phòng 101", mucDo: "Cao",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Kiểm tra dàn lạnh và nạp ga cho máy lạnh phòng 101."
  },
  {
    id: 2, gio: "10:30", tenSuCo: "Router mất kết nối",
    maThietBi: "RT-012", diaDiem: "Phòng 201", mucDo: "Khẩn",
    trangThai: "Đang xử lý", homNay: true, thoiGianXuLy: 0,
    moTa: "Router mất Internet, kiểm tra đường truyền và cấu hình thiết bị."
  },
  {
    id: 3, gio: "13:30", tenSuCo: "Máy chiếu nhòe màu",
    maThietBi: "PJ-108", diaDiem: "Hội trường", mucDo: "Trung bình",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Kiểm tra cáp tín hiệu và bóng đèn của máy chiếu hội trường."
  },
  {
    id: 4, gio: "15:00", tenSuCo: "Máy in không nhận lệnh",
    maThietBi: "PR-031", diaDiem: "Văn phòng", mucDo: "Thấp",
    trangThai: "Đang xử lý", homNay: true, thoiGianXuLy: 0,
    moTa: "Kiểm tra driver và hàng đợi in của máy in văn phòng."
  },
  {
    id: 5, gio: "08:30", tenSuCo: "Mất điện phòng máy",
    maThietBi: "EL-005", diaDiem: "Phòng máy chủ", mucDo: "Khẩn",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Đã kích hoạt máy phát dự phòng cho phòng máy chủ."
  },
  {
    id: 6, gio: "09:15", tenSuCo: "Mạng chập chờn",
    maThietBi: "SW-021", diaDiem: "Tầng 2", mucDo: "Cao",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Thay cáp mạng bị hỏng trên tủ switch tầng 2."
  },
  {
    id: 7, gio: "10:00", tenSuCo: "Máy tính không khởi động",
    maThietBi: "PC-114", diaDiem: "Phòng 105", mucDo: "Cao",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Thay nguồn máy tính bị hỏng."
  },
  {
    id: 8, gio: "13:00", tenSuCo: "Loa phòng họp rè",
    maThietBi: "SP-009", diaDiem: "Phòng họp", mucDo: "Trung bình",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Thay dây nối và chỉnh lại âm lượng loa phòng họp."
  },
  {
    id: 9, gio: "14:00", tenSuCo: "Camera mất hình",
    maThietBi: "CM-032", diaDiem: "Sảnh chính", mucDo: "Cao",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Cấp lại nguồn cho camera sảnh chính."
  },
  {
    id: 10, gio: "08:00", tenSuCo: "Hết mực máy in",
    maThietBi: "PR-018", diaDiem: "Phòng giáo vụ", mucDo: "Thấp",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Thay mực cho máy in phòng giáo vụ."
  },
  {
    id: 11, gio: "15:30", tenSuCo: "Máy lạnh rỉ nước",
    maThietBi: "AC-031", diaDiem: "Phòng 203", mucDo: "Trung bình",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Vệ sinh máng nước và ống thoát của máy lạnh."
  },
  {
    id: 12, gio: "16:00", tenSuCo: "Màn hình bị sọc",
    maThietBi: "MN-077", diaDiem: "Phòng 102", mucDo: "Trung bình",
    trangThai: "Chờ nhận", homNay: true, thoiGianXuLy: 0,
    moTa: "Thay cáp tín hiệu màn hình phòng 102."
  }
];

const duLieuHieuSuat = [
  { nhan: "T1", soHoanThanh: 32 },
  { nhan: "T2", soHoanThanh: 38 },
  { nhan: "T3", soHoanThanh: 35 },
  { nhan: "T4", soHoanThanh: 44 },
  { nhan: "T5", soHoanThanh: 41 },
  { nhan: "T6", soHoanThanh: 47 },
  { nhan: "T7", soHoanThanh: 40 },
  { nhan: "T8", soHoanThanh: 45 }
];

const tiLeDungSLA = 92;


// ---------- 2. Ham dung chung ----------

function hienThongBao(noiDung) {
  const oThongBao = document.getElementById("thongBao");
  if (!oThongBao) return;

  oThongBao.textContent = noiDung;
  oThongBao.classList.add("hien");

  clearTimeout(thoiGianAnThongBao);
  thoiGianAnThongBao = setTimeout(function () {
    oThongBao.classList.remove("hien");
  }, 2600);
}

function layLopMucDo(mucDo) {
  if (mucDo === "Khẩn") return "muc-khan";
  if (mucDo === "Cao") return "muc-cao";
  if (mucDo === "Trung bình") return "muc-trung-binh";
  return "muc-thap";
}

function layViecHomNay() {
  const ketQua = [];
  for (let i = 0; i < danhSachTicket.length; i++) {
    if (danhSachTicket[i].homNay === true) {
      ketQua.push(danhSachTicket[i]);
    }
  }
  return ketQua;
}

// Lay 2 chu cai dau cua ten (vi du: "Bùi Huy Quân" -> "BQ")
function layChuCaiDau(ten) {
  const cacTu = ten.split(" ");
  const tuDau = cacTu[0];
  const tuCuoi = cacTu[cacTu.length - 1];
  return (tuDau.charAt(0) + tuCuoi.charAt(0)).toUpperCase();
}



const KHOA_TICKET_DANG_XU_LY = "fixflowTicketDangXuLy";

function luuTicketDangXuLy(ticket) {
  try {
    // Lưu cả ticket đã chọn để trang Đang sửa hiển thị đúng dữ liệu của ticket đó.
    localStorage.setItem(KHOA_TICKET_DANG_XU_LY, JSON.stringify(ticket));
  } catch (loi) {
    // Khong luu duoc thi bo qua, trang 02 se hien noi dung mac dinh
  }
}

function docTicketDangXuLy() {
  try {
    const chuoiTicket = localStorage.getItem(KHOA_TICKET_DANG_XU_LY);
    if (chuoiTicket === null) {
      return null;
    }
    return JSON.parse(chuoiTicket);
  } catch (loi) {
    // Du lieu bi hong hoac bi chan thi tra ve null
    return null;
  }
}


// ---------- 2c. Du lieu xu ly theo tung ticket (checklist, ghi chu, trang thai) ----------
// Toan bo du lieu nguoi dung nhap o trang "Dang sua" duoc luu trong MOT khoa, dang doi
// tuong: { "TK-2025-001": { trangThai, ghiChu, checklist, ... }, "TK-2025-014": {...} }
// Nho vay moi ticket co du lieu rieng, khoa chinh la ma ticket nen khong bi trung lap.

const KHOA_DU_LIEU_TICKET = "fixflowDuLieuTicket";

function docKhoDuLieuTicket() {
  try {
    const chuoiDuLieu = localStorage.getItem(KHOA_DU_LIEU_TICKET);
    if (chuoiDuLieu === null) {
      return {};
    }
    const duLieu = JSON.parse(chuoiDuLieu);
    if (duLieu === null || typeof duLieu !== "object") {
      return {};
    }
    return duLieu;
  } catch (loi) {
    // Du lieu bi hong hoac trinh duyet chan localStorage thi coi nhu chua co gi
    return {};
  }
}

function docDuLieuTicket(maTicket) {
  const kho = docKhoDuLieuTicket();
  if (kho[maTicket]) {
    return kho[maTicket];
  }
  return null;
}

function luuDuLieuTicket(maTicket, duLieu) {
  try {
    const kho = docKhoDuLieuTicket();
    kho[maTicket] = duLieu;
    localStorage.setItem(KHOA_DU_LIEU_TICKET, JSON.stringify(kho));
  } catch (loi) {
    // Khong luu duoc thi bo qua, du lieu van dung trong phien hien tai
  }
}


// ---------- 2d. Dong bo du lieu da luu sang cac trang khac ----------

// Nhom danh muc o trang Lich su dung ten ngan hon o trang Hang doi
function doiDanhMucLichSu(danhMuc) {
  if (danhMuc === "Mạng máy tính") return "Mạng";
  if (danhMuc === "Thiết bị trình chiếu") return "Trình chiếu";
  return danhMuc;
}

function tinhKetQuaSLA(ticket, duLieu) {
  if (ticket === null) return "Đúng SLA";
  if (duLieu.thoiGianXuLy <= ticket.gioConLai * 0.8) return "Sớm hạn";
  if (duLieu.thoiGianXuLy <= ticket.gioConLai) return "Đúng SLA";
  return "Trễ hạn";
}

function doiTenThietBiLichSu(maThietBi) {
  // Bang lich su ghi ten thiet bi cho de doc, kem ma de van tra cuu duoc
  const tienTo = maThietBi.substring(0, 2);
  let tenThietBi = "";

  if (tienTo === "AC") tenThietBi = "Máy lạnh";
  else if (tienTo === "RT") tenThietBi = "Router WiFi";
  else if (tienTo === "SW") tenThietBi = "Switch";
  else if (tienTo === "PJ") tenThietBi = "Máy chiếu";
  else if (tienTo === "PR") tenThietBi = "Máy in";
  else if (tienTo === "PC") tenThietBi = "Máy tính";
  else if (tienTo === "CM") tenThietBi = "Camera";
  else if (tienTo === "EL") tenThietBi = "Hệ thống điện";
  else if (tienTo === "SP") tenThietBi = "Loa";

  if (tenThietBi === "") {
    return maThietBi;
  }
  return tenThietBi + " " + maThietBi;
}

function themVaoLichSu(maTicket, duLieu) {
  // Khong them trung: ticket da co trong bang lich su thi bo qua
  for (let i = 0; i < danhSachLichSu.length; i++) {
    if (danhSachLichSu[i].ma === maTicket) {
      return;
    }
  }

  const ticket = layTicketTheoMa(maTicket);
  if (ticket === null) return;

  let thoiGian = "0.1h";
  if (duLieu.thoiGianXuLy > 0) {
    thoiGian = duLieu.thoiGianXuLy.toFixed(1) + "h";
  }

  danhSachLichSu.unshift({
    ma: maTicket,
    thietBi: doiTenThietBiLichSu(ticket.maThietBi),
    danhMuc: doiDanhMucLichSu(ticket.danhMuc),
    thoiGian: thoiGian,
    danhGia: 0,
    ketQua: tinhKetQuaSLA(ticket, duLieu),
    ngayTruoc: 0,
    ghiChu: duLieu.ghiChu || "",
    thoiDiemHoanThanh: duLieu.thoiDiemHoanThanh || ""
  });
}

// Ap dung du lieu da luu vao du lieu mau cua 3 trang:
// Hang doi (trang thai ticket), Tong quan (trang thai viec), Lich su (them dong moi)
function apDungDuLieuDaLuu() {
  const kho = docKhoDuLieuTicket();
  const cacMa = Object.keys(kho);

  for (let i = 0; i < cacMa.length; i++) {
    const maTicket = cacMa[i];
    const duLieu = kho[maTicket];
    if (duLieu === null || typeof duLieu !== "object") continue;

    const ticketHangDoi = layTicketTheoMa(maTicket);
    if (ticketHangDoi === null) continue;

    ticketHangDoi.trangThai = duLieu.trangThai;
    ticketHangDoi.statusCode = duLieu.statusCode ||
      (duLieu.trangThai === "Hoàn thành" ? "completed" : "in_progress");

    if (duLieu.trangThai === "Hoàn thành") {
      // Trang Tong quan: danh dau viec cung thiet bi la da hoan thanh
      for (let j = 0; j < danhSachTicket.length; j++) {
        const viec = danhSachTicket[j];
        if (viec.maThietBi !== ticketHangDoi.maThietBi) continue;
        if (viec.trangThai === "Hoàn thành") continue;
        viec.trangThai = "Hoàn thành";
        viec.homNay = false;
        viec.thoiGianXuLy = duLieu.thoiGianXuLy;
      }

      themVaoLichSu(maTicket, duLieu);
    } else if (duLieu.trangThai === "Tạm dừng") {
      for (let j = 0; j < danhSachTicket.length; j++) {
        if (danhSachTicket[j].maThietBi === ticketHangDoi.maThietBi) {
          danhSachTicket[j].trangThai = "Tạm dừng";
        }
      }
    }
  }
}


// ---------- 3. TRANG TONG QUAN: hien thi danh sach ----------

function taoMotDongTicket(ticket) {
  const phanTu = document.createElement("li");
  phanTu.className = "dong-viec";
  if (ticket.mucDo === "Khẩn") {
    phanTu.classList.add("dong-khan");
  }

  const oGio = document.createElement("span");
  oGio.className = "gio";
  oGio.textContent = ticket.gio;

  const oThongTin = document.createElement("div");
  oThongTin.className = "thong-tin-viec";

  const oTen = document.createElement("p");
  oTen.className = "ten-su-co";
  oTen.textContent = ticket.tenSuCo;

  const oThietBi = document.createElement("p");
  oThietBi.className = "thiet-bi";
  oThietBi.textContent = ticket.maThietBi + " · " + ticket.diaDiem;

  oThongTin.appendChild(oTen);
  oThongTin.appendChild(oThietBi);

  const oMucDo = document.createElement("span");
  oMucDo.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
  oMucDo.textContent = ticket.mucDo;

  const oMuiTen = document.createElement("span");
  oMuiTen.className = "mui-ten";

  phanTu.appendChild(oGio);
  phanTu.appendChild(oThongTin);
  phanTu.appendChild(oMucDo);
  phanTu.appendChild(oMuiTen);

  phanTu.addEventListener("click", function () {
    moChiTiet(ticket);
  });

  return phanTu;
}

function hienThiDanhSach(danhSach) {
  const oDanhSach = document.getElementById("danhSachViec");
  const oThongDiep = document.getElementById("thongDiepTrong");
  if (!oDanhSach || !oThongDiep) return;

  oDanhSach.innerHTML = "";

  for (let i = 0; i < danhSach.length; i++) {
    const phanTu = taoMotDongTicket(danhSach[i]);
    oDanhSach.appendChild(phanTu);
  }

  if (danhSach.length === 0) {
    oThongDiep.hidden = false;
    oDanhSach.hidden = true;
  } else {
    oThongDiep.hidden = true;
    oDanhSach.hidden = false;
  }

  document.getElementById("soViecHomNay").textContent = danhSach.length + " ticket";
}

function locTicketTheoTuKhoa(tuKhoa) {
  const tuKhoaThuong = tuKhoa.toLowerCase().trim();
  const danhSachGoc = layViecHomNay();

  if (tuKhoaThuong === "") {
    return danhSachGoc;
  }

  const ketQua = [];
  for (let i = 0; i < danhSachGoc.length; i++) {
    const ticket = danhSachGoc[i];
    const noiDungTim = ticket.tenSuCo + " " + ticket.maThietBi + " " + ticket.diaDiem;

    if (noiDungTim.toLowerCase().indexOf(tuKhoaThuong) !== -1) {
      ketQua.push(ticket);
    }
  }
  return ketQua;
}

// Tim kiem tren thanh tren: nhan biet trang dang mo de tim dung du lieu
function xuLyTimKiem() {
  const oTimKiem = document.getElementById("oTimKiem");
  const tuKhoa = oTimKiem.value;

  if (document.getElementById("danhSachViec")) {
    hienThiDanhSach(locTicketTheoTuKhoa(tuKhoa));
    return;
  }

  if (document.getElementById("khungKanban")) {
    document.getElementById("tuKhoaHangDoi").value = tuKhoa;
    hienThiHangDoi();
    return;
  }

  if (document.getElementById("bangLichSu")) {
    document.getElementById("tuKhoaLichSu").value = tuKhoa;
    hienThiBangLichSu();
    return;
  }

  if (document.getElementById("danhSachMau")) {
    document.getElementById("tuKhoaMau").value = tuKhoa;
    hienThiDanhSachMau();
    return;
  }

  hienThongBao("Đang tìm kiếm: " + tuKhoa);
}


// ---------- 4. TRANG TONG QUAN: hop thoai chi tiet ----------

let ticketDangXem = null;

function moChiTiet(ticket) {
  const oNenMo = document.getElementById("nenMo");
  if (!oNenMo) return;

  ticketDangXem = ticket;

  document.getElementById("ctGio").textContent = ticket.gio;
  document.getElementById("ctTenSuCo").textContent = ticket.tenSuCo;
  document.getElementById("ctThietBi").textContent = ticket.maThietBi;
  document.getElementById("ctDiaDiem").textContent = ticket.diaDiem;
  document.getElementById("ctMucDo").textContent = ticket.mucDo;
  document.getElementById("ctTrangThai").textContent = ticket.trangThai;
  document.getElementById("ctMoTa").textContent = ticket.moTa;

  oNenMo.classList.add("hien");
}

function dongHopThoai() {
  const oNenMo = document.getElementById("nenMo");
  if (!oNenMo) return;
  oNenMo.classList.remove("hien");
  ticketDangXem = null;
}


// ---------- 5. TRANG TONG QUAN: trang thai lam viec ----------

function chonTrangThaiLamViec(trangThai, nutDuocBam) {
  trangThaiLamViec = trangThai;

  const danhSachNut = document.querySelectorAll(".nut-trang-thai");
  for (let i = 0; i < danhSachNut.length; i++) {
    danhSachNut[i].classList.remove("dang-chon");
  }
  nutDuocBam.classList.add("dang-chon");

  hienThongBao("Trạng thái đã đổi thành: " + trangThai);
}


// ---------- 6. TRANG TONG QUAN: thong ke ----------

function demTicketTheoTrangThai(tenTrangThai) {
  let dem = 0;
  for (let i = 0; i < danhSachTicket.length; i++) {
    if (danhSachTicket[i].trangThai === tenTrangThai) {
      dem = dem + 1;
    }
  }
  return dem;
}

function tinhThoiGianTrungBinh() {
  let tongGio = 0;
  let soViec = 0;

  for (let i = 0; i < danhSachTicket.length; i++) {
    const ticket = danhSachTicket[i];
    if (ticket.trangThai === "Hoàn thành") {
      tongGio = tongGio + ticket.thoiGianXuLy;
      soViec = soViec + 1;
    }
  }

  if (soViec === 0) return 0;
  return tongGio / soViec;
}

function capNhatThongKe() {
  const oSoChoNhan = document.getElementById("soChoNhan");
  if (!oSoChoNhan) return;

  const soChoNhan = demTicketTheoTrangThai("Chờ nhận");
  const soDangXuLy = demTicketTheoTrangThai("Đang xử lý");
  const soHoanThanh = demTicketTheoTrangThai("Hoàn thành");
  const thoiGianTB = tinhThoiGianTrungBinh();

  oSoChoNhan.textContent = soChoNhan;
  document.getElementById("soDangXuLy").textContent = soDangXuLy;
  document.getElementById("soHoanThanh").textContent = soHoanThanh;
  document.getElementById("soThoiGianTB").textContent = thoiGianTB.toFixed(1) + "h";

  const soViecUuTien = soChoNhan + soDangXuLy;
  document.getElementById("dongChao").textContent =
    "Bạn có " + soViecUuTien + " việc ưu tiên cần xử lý hôm nay.";
}


// ---------- 7. TRANG TONG QUAN: bieu do 8 tuan ----------

function hienThiBieuDo() {
  const oBieuDo = document.getElementById("bieuDo");
  if (!oBieuDo) return;

  oBieuDo.innerHTML = "";

  let giaTriLonNhat = 0;
  for (let i = 0; i < duLieuHieuSuat.length; i++) {
    if (duLieuHieuSuat[i].soHoanThanh > giaTriLonNhat) {
      giaTriLonNhat = duLieuHieuSuat[i].soHoanThanh;
    }
  }

  for (let i = 0; i < duLieuHieuSuat.length; i++) {
    const tuan = duLieuHieuSuat[i];

    const oNhom = document.createElement("div");
    oNhom.className = "cot-nhom";

    const oCot = document.createElement("div");
    oCot.className = "cot";
    if (i === duLieuHieuSuat.length - 1) {
      oCot.classList.add("hien-tai");
    }
    oCot.style.height = Math.round((tuan.soHoanThanh / giaTriLonNhat) * 130) + "px";

    const oNhan = document.createElement("span");
    oNhan.className = "nhan-cot";
    oNhan.textContent = tuan.nhan;

    oNhom.appendChild(oCot);
    oNhom.appendChild(oNhan);
    oBieuDo.appendChild(oNhom);
  }

  const tuanHienTai = duLieuHieuSuat[duLieuHieuSuat.length - 1];
  document.getElementById("nhanHoanThanh").textContent = "Hoàn thành " + tuanHienTai.soHoanThanh;
  document.getElementById("nhanSLA").textContent = "Đúng SLA " + tiLeDungSLA + "%";
}


// ---------- 8. Menu va sidebar ----------

function xuLyMenu(phanTuMenu) {
  const tenTrang = phanTuMenu.getAttribute("data-trang");
  if (tenTrang === "Trợ giúp 24/7") {
    hienThongBao("Tổng đài hỗ trợ: 1900 0000 (24/7).");
    return;
  }
  hienThongBao("Trang " + tenTrang + " sẽ được phát triển trong phiên bản sau.");
}

function dongThanhBen() {
  document.body.classList.remove("mo-thanh-ben");
}


// ---------- 9. Gan su kien chung ----------

function ganSuKien() {
  const oTimKiem = document.getElementById("oTimKiem");
  if (oTimKiem) {
    oTimKiem.addEventListener("input", xuLyTimKiem);
  }

  const danhSachNutTrangThai = document.querySelectorAll(".nut-trang-thai");
  for (let i = 0; i < danhSachNutTrangThai.length; i++) {
    danhSachNutTrangThai[i].addEventListener("click", function () {
      chonTrangThaiLamViec(this.getAttribute("data-trang-thai"), this);
    });
  }

  // Chi gan cho nut co thuoc tinh data-trang (nut Tro giup 24/7)
  const danhSachMenu = document.querySelectorAll(".muc-menu[data-trang]");
  for (let i = 0; i < danhSachMenu.length; i++) {
    danhSachMenu[i].addEventListener("click", function () {
      xuLyMenu(this);
    });
  }

  if (document.getElementById("nutDongHopThoai")) {
    document.getElementById("nutDongHopThoai").addEventListener("click", dongHopThoai);
    document.getElementById("nutDongDuoi").addEventListener("click", dongHopThoai);
    document.getElementById("nenMo").addEventListener("click", function (suKien) {
      if (suKien.target.id === "nenMo") {
        dongHopThoai();
      }
    });
  }

  document.addEventListener("keydown", function (suKien) {
    if (suKien.key === "Escape") {
      dongHopThoai();
      dongHopThoaiLichSu();
      dongThanhBen();
    }
  });

  const oNutMenu = document.getElementById("nutMenu");
  if (oNutMenu) {
    oNutMenu.addEventListener("click", function () {
      document.body.classList.toggle("mo-thanh-ben");
    });
    document.getElementById("nenPhu").addEventListener("click", dongThanhBen);
  }

  const oThongBao = document.getElementById("nutThongBao");
  if (oThongBao) {
    oThongBao.addEventListener("click", function () {
      const soViec = layViecHomNay().length;
      hienThongBao("Hôm nay bạn có " + soViec + " việc cần xử lý.");
    });
  }
}


// ---------- 10. Thong tin nguoi dung va khoi tao ----------

function hienThiThongTinNguoiDung() {
  const oTen = document.getElementById("tenNguoiDung");
  if (!oTen) return;

  const tenHienThi = oTen.getAttribute("data-ten-khac") || tenKyThuatVien;
  oTen.textContent = tenHienThi;

  const oAnh = document.getElementById("anhDaiDien");
  if (oAnh) {
    oAnh.textContent = layChuCaiDau(tenHienThi);
  }

  const oDongTruong = document.getElementById("dongTruong");
  if (oDongTruong) {

    oDongTruong.textContent = tenVaiTro;
  }
}
//hello

// ---------- CHE DO SANG / TOI (AP DUNG SOM TRUOC KHI VE KHUNG HINH) ----------
// Che do SANG la mac dinh: the <html> KHONG co lop "giao-dien-toi".
// Che do TOI bat/tat bang classList.toggle("giao-dien-toi", ...).
// Khoi nay chay ngay khi script.js duoc nap (defer trong <head>) de tranh nhay mau.

(function () {
  var laCheDoToi = false;
  try {
    laCheDoToi = localStorage.getItem("fixflowGiaoDien") === "toi";
  } catch (loi) {
    // Trinh duyet chan localStorage -> giu mac dinh la che do sang
  }
  document.documentElement.classList.toggle("giao-dien-toi", laCheDoToi);
})();

// ---------- 10c. Che do sang / toi ----------
// Lop "giao-dien-toi" tren the <html> da duoc bat/tat som o dau file nay.
// O day chi doc lai, doi khi bam nut va luu lua chon vao localStorage de cac
// trang khac dung cung che do.

const LOP_GIAO_DIEN_TOI = "giao-dien-toi";
const KHOA_GIAO_DIEN = "fixflowGiaoDien";
const GIAO_DIEN_SANG = "sang";
const GIAO_DIEN_TOI = "toi";

// Chi co gia tri "toi" moi la che do toi, con lai (chua luu / "sang") la che do sang.
function docGiaoDienDaLuu() {
  try {
    if (localStorage.getItem(KHOA_GIAO_DIEN) === GIAO_DIEN_TOI) return GIAO_DIEN_TOI;
  } catch (loi) {
    // Trinh duyet chan localStorage -> mac dinh che do sang
  }

  return GIAO_DIEN_SANG;
}

function capNhatNutGiaoDien(dangToi) {
  const nhan = dangToi ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối";
  const cacNut = document.querySelectorAll(".nut-giao-dien");

  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].setAttribute("aria-pressed", dangToi ? "true" : "false");
    cacNut[i].setAttribute("aria-label", nhan);
    cacNut[i].setAttribute("title", nhan);
  }
}

// classList.toggle(tenLop, dieuKien): them lop khi dieu kien = true, xoa lop khi false.
function apDungGiaoDien(giaoDien) {
  const dangToi = giaoDien === GIAO_DIEN_TOI;
  document.documentElement.classList.toggle(LOP_GIAO_DIEN_TOI, dangToi);
  capNhatNutGiaoDien(dangToi);
  return dangToi ? GIAO_DIEN_TOI : GIAO_DIEN_SANG;
}

function doiGiaoDien() {
  // Khong truyen dieu kien -> toggle() tu dao trang thai hien tai
  // va tra ve true/false tuong ung voi che do toi sau khi doi.
  const dangToi = document.documentElement.classList.toggle(LOP_GIAO_DIEN_TOI);
  capNhatNutGiaoDien(dangToi);

  try {
    localStorage.setItem(KHOA_GIAO_DIEN, dangToi ? GIAO_DIEN_TOI : GIAO_DIEN_SANG);
  } catch (loi) {
    // Khong luu duoc thi van doi giao dien cho trang hien tai
  }

  hienThongBao(dangToi ? "Đã bật chế độ tối." : "Đã chuyển sang chế độ sáng.");
}

function khoiTaoGiaoDien() {
  // Che do da duoc ap dung tu dau file; o day ap dung lai theo lua chon da luu
  apDungGiaoDien(docGiaoDienDaLuu());

  const cacNut = document.querySelectorAll(".nut-giao-dien");
  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].addEventListener("click", doiGiaoDien);
  }
}

const PHIEN_BAN_DU_LIEU_MAU = "3";
const KHOA_PHIEN_BAN_DU_LIEU = "fixflowPhienBanDuLieu";

function xoaDuLieuMauCu() {
  try {
    const phienBanDaLuu = localStorage.getItem(KHOA_PHIEN_BAN_DU_LIEU);
    if (phienBanDaLuu === PHIEN_BAN_DU_LIEU_MAU) return;

    localStorage.removeItem(KHOA_DU_LIEU_TICKET);
    localStorage.removeItem(KHOA_TICKET_DANG_XU_LY);
    localStorage.setItem(KHOA_PHIEN_BAN_DU_LIEU, PHIEN_BAN_DU_LIEU_MAU);
  } catch (loi) {
    // Trinh duyet chan localStorage (che do rieng tu, mo file truc tiep bang file://)
    // thi bo qua, trang van chay binh thuong voi du lieu mau
  }
}

function khoiTaoTrang() {
  // Ap dung che do sang/toi truoc khi ve cac thanh phan con lai
  khoiTaoGiaoDien();

  hienThiThongTinNguoiDung();

  // Xoa du lieu cua phien ban du lieu mau cu (neu co) truoc khi doc du lieu da luu
  xoaDuLieuMauCu();

  // Ap dung du lieu nguoi dung da luu (checklist, ghi chu, ticket da hoan thanh)
  // truoc khi ve giao dien cua tung trang
  apDungDuLieuDaLuu();

  // TRANG TONG QUAN
  if (document.getElementById("danhSachViec")) {
    document.getElementById("loiChao").textContent =
      "Chào " + tenKyThuatVien + ", sẵn sàng làm việc? 🔧";
    capNhatThongKe();
    hienThiDanhSach(layViecHomNay());
    hienThiBieuDo();
  }

  // TRANG 01 - HANG DOI
  if (document.getElementById("khungKanban")) {
    khoiTaoHangDoi();
  }

  // TRANG 02 - DANG SUA
  if (document.getElementById("danhSachBuocXuLy")) {
    khoiTaoDangSua();
  }

  // TRANG 03 - LICH SU
  if (document.getElementById("bangLichSu")) {
    khoiTaoLichSu();
  }

  // TRANG 04 - CHECKLIST
  if (document.getElementById("danhSachMau")) {
    khoiTaoChecklist();
  }

  // TRANG 05 - THONG KE
  if (document.getElementById("bieuDo12Tuan")) {
    khoiTaoThongKe();
  }

  ganSuKien();
}


/* =========================================================
   DU LIEU 5 TRANG
   ========================================================= */

// TRANG 01: HANG DOI
const danhSachTicketHangDoi = [
  {
    ma: "TK-2025-001", tenSuCo: "Máy lạnh không mát",
    maThietBi: "AC-023", diaDiem: "Phòng 101", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Cao", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 3h 40p", gioConLai: 3.7,
    danhMuc: "Điện lạnh", moTa: "Máy vẫn chạy, có gió nhưng không làm lạnh. Có tiếng rung nhẹ."
  },
  {
    ma: "TK-2025-014", tenSuCo: "Router mất kết nối",
    maThietBi: "RT-012", diaDiem: "Phòng 201", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Khẩn", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 1h 15p", gioConLai: 1.25,
    danhMuc: "Mạng máy tính", moTa: "Mất toàn bộ kết nối mạng có dây, đèn WAN tắt."
  },
  {
    ma: "TK-2025-026", tenSuCo: "Máy tính không khởi động",
    maThietBi: "PC-114", diaDiem: "Phòng 105", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Cao", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 6h 20p", gioConLai: 6.3,
    danhMuc: "Mạng máy tính", moTa: "Bật nguồn không lên hình, quạt nguồn quay rồi dừng."
  },
  {
    ma: "TK-2025-019", tenSuCo: "Máy chiếu nhòe màu",
    maThietBi: "PJ-108", diaDiem: "Hội trường", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Trung bình", trangThai: "Đang xử lý", thongTinThoiGian: "Còn 22h", gioConLai: 22,
    danhMuc: "Thiết bị trình chiếu", moTa: "Hình ảnh bị nhòe màu xanh, chữ hiển thị mờ."
  },
  {
    ma: "TK-2025-021", tenSuCo: "Máy in không nhận lệnh",
    maThietBi: "PR-031", diaDiem: "Văn phòng", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Thấp", trangThai: "Đang xử lý", thongTinThoiGian: "Còn 64h", gioConLai: 64,
    danhMuc: "Văn phòng", moTa: "Máy in báo offline, hàng đợi in bị treo."
  },
  {
    ma: "TK-2025-024", tenSuCo: "Camera ngoại vi offline",
    maThietBi: "CM-017", diaDiem: "Sân sau", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Cao", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 18h", gioConLai: 18,
    danhMuc: "Mạng máy tính", moTa: "Mất tín hiệu camera khu vực sân sau."
  },
  {
    ma: "TK-2025-023", tenSuCo: "Máy chiếu mất tiếng",
    maThietBi: "PJ-102", diaDiem: "Phòng họp", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Trung bình", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 20h", gioConLai: 20,
    danhMuc: "Thiết bị trình chiếu", moTa: "Có hình nhưng không phát ra âm thanh."
  },
  {
    ma: "TK-2025-022", tenSuCo: "Mạng chập chờn",
    maThietBi: "SW-004", diaDiem: "Tầng 2", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Cao", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 12h", gioConLai: 12,
    danhMuc: "Mạng máy tính", moTa: "Kết nối lúc được lúc mất trong khoảng 2 giờ."
  },
  {
    ma: "TK-2025-020", tenSuCo: "Máy in kẹt giấy",
    maThietBi: "PR-018", diaDiem: "Văn phòng", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Thấp", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 30h", gioConLai: 30,
    danhMuc: "Văn phòng", moTa: "Giấy kẹt ở khay số 2, máy báo lỗi liên tục."
  },
  {
    ma: "TK-2025-018", tenSuCo: "Máy lạnh chảy nước",
    maThietBi: "AC-011", diaDiem: "Phòng 203", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Cao", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 9h", gioConLai: 9,
    danhMuc: "Điện lạnh", moTa: "Nước rò rỉ từ dàn lạnh xuống sàn phòng."
  },
  {
    ma: "TK-2025-017", tenSuCo: "Camera mất hình",
    maThietBi: "CM-009", diaDiem: "Sân trước", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Trung bình", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 26h", gioConLai: 26,
    danhMuc: "Mạng máy tính", moTa: "Camera chỉ hiện nền đen, không có hình."
  },
  {
    ma: "TK-2025-016", tenSuCo: "Bộ phát WiFi yếu",
    maThietBi: "AP-021", diaDiem: "Tầng 3", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Thấp", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 40h", gioConLai: 40,
    danhMuc: "Mạng máy tính", moTa: "Sóng WiFi yếu, thiết bị bắt sóng chập chờn."
  },
  {
    ma: "TK-2025-015", tenSuCo: "Màn hình bị sọc",
    maThietBi: "MN-077", diaDiem: "Phòng 102", nguoiYeuCau: "Nguyễn Văn A",
    mucDo: "Trung bình", trangThai: "Chờ nhận", thongTinThoiGian: "Còn 33h", gioConLai: 33,
    danhMuc: "Văn phòng", moTa: "Màn hình xuất hiện sọc dọc sau 10 phút sử dụng."
  }
];

let ticketDangChonHangDoi = null;

// TRANG 02: CHECKLIST DANG XU LY
// Checklist mac dinh, dung cho ticket chua co du lieu luu tren trinh duyet
const CHECKLIST_MAC_DINH = [
  { ten: "Kiểm tra áp suất gas lạnh", xong: true },
  { ten: "Kiểm tra quạt dàn lạnh", xong: true },
  { ten: "Đo cảm biến nhiệt", xong: true },
  { ten: "Vệ sinh dàn lạnh", xong: false },
  { ten: "Kiểm tra bo mạch điều khiển", xong: false }
];

// Danh sach buoc dang lam viec: duoc nap theo tung ticket tu localStorage
let danhSachBuocChecklist = [];

// Goi y AI: chi la du lieu mau de mo phong, khong goi AI that
const goiYBuocAI = [
  "Kiểm tra áp suất gas lạnh",
  "Vệ sinh dàn lạnh",
  "Đo dòng điện máy nén",
  "Kiểm tra rơ-le khởi động",
  "Chạy thử 15 phút và ghi nhật ký"
];

// Kho goi y dung cho nut "Tao lai"
const khoGoiYThem = [
  "Kiểm tra dây nguồn và aptomat",
  "Đo điện áp đầu vào",
  "Kiểm tra gas bằng đồng hồ áp suất",
  "Vệ sinh lưới lọc bụi",
  "Kiểm tra ống thoát nước ngưng",
  "Ghi nhật ký bàn giao cho người dùng"
];

// TRANG 03: LICH SU
// ghiChu la phan ghi chu ky thuat cua ky thuat vien, hien trong hop thoai chi tiet
// danhGia = 0 nghia la ticket chua duoc nguoi yeu cau cham diem
const danhSachLichSu = [
  { ma: "TK-2025-045", thietBi: "Máy lạnh", danhMuc: "Điện lạnh", thoiGian: "1.5h", danhGia: 4, ketQua: "Đúng SLA", ngayTruoc: 1,
    ghiChu: "Thay tụ quạt dàn lạnh, nạp thêm 150g gas R32. Máy chạy êm, nhiệt độ hạ đều sau 15 phút." },
  { ma: "TK-2025-044", thietBi: "Router WiFi", danhMuc: "Mạng", thoiGian: "2h", danhGia: 5, ketQua: "Sớm hạn", ngayTruoc: 2,
    ghiChu: "Đổi kênh sóng 5GHz sang kênh 149, cập nhật firmware lên bản 3.4.2. Đã kiểm tra lại toàn bộ phòng 302." },
  { ma: "TK-2025-043", thietBi: "Máy chiếu", danhMuc: "Trình chiếu", thoiGian: "2.5h", danhGia: 4, ketQua: "Sớm hạn", ngayTruoc: 3,
    ghiChu: "Vệ sinh ống kính và thay cáp HDMI 10m. Màu sắc đã đều, không còn vệt xanh ở góc trái." },
  { ma: "TK-2025-042", thietBi: "Máy in", danhMuc: "Văn phòng", thoiGian: "3h", danhGia: 5, ketQua: "Đúng SLA", ngayTruoc: 5,
    ghiChu: "Vệ sinh cụm lô sấy, thay hộp mực dự phòng. In thử 20 trang liên tục không bị kẹt giấy." },
  { ma: "TK-2025-041", thietBi: "Máy lạnh", danhMuc: "Điện lạnh", thoiGian: "1.5h", danhGia: 4, ketQua: "Sớm hạn", ngayTruoc: 8 },
  { ma: "TK-2025-040", thietBi: "Router WiFi", danhMuc: "Mạng", thoiGian: "2h", danhGia: 5, ketQua: "Sớm hạn", ngayTruoc: 12,
    ghiChu: "Router bị treo do quá tải DHCP, đã đặt lại cấu hình và cấp IP tĩnh cho 4 máy in." },
  { ma: "TK-2025-039", thietBi: "Máy chiếu", danhMuc: "Trình chiếu", thoiGian: "2.5h", danhGia: 4, ketQua: "Đúng SLA", ngayTruoc: 18 },
  { ma: "TK-2025-038", thietBi: "Máy in", danhMuc: "Văn phòng", thoiGian: "3h", danhGia: 5, ketQua: "Sớm hạn", ngayTruoc: 24 },
  { ma: "TK-2025-037", thietBi: "Máy lạnh", danhMuc: "Điện lạnh", thoiGian: "1.5h", danhGia: 4, ketQua: "Sớm hạn", ngayTruoc: 33 },
  { ma: "TK-2025-036", thietBi: "Router WiFi", danhMuc: "Mạng", thoiGian: "2h", danhGia: 5, ketQua: "Đúng SLA", ngayTruoc: 41 },
  { ma: "TK-2025-035", thietBi: "Máy chiếu", danhMuc: "Trình chiếu", thoiGian: "2.5h", danhGia: 0, ketQua: "Trễ hạn", ngayTruoc: 52,
    ghiChu: "Chờ linh kiện bóng đèn từ nhà cung cấp nên trễ 1 ngày so với SLA. Đã bàn giao máy tạm cho phòng họp." },
  { ma: "TK-2025-034", thietBi: "Máy in", danhMuc: "Văn phòng", thoiGian: "3h", danhGia: 5, ketQua: "Sớm hạn", ngayTruoc: 63 }
];

// TRANG 04: MAU CHECKLIST
const danhSachMauChecklist = [
  { nhom: "Điện lạnh", ten: "Máy lạnh không mát",
    buoc: ["Ngắt nguồn điện an toàn", "Kiểm tra áp suất gas", "Đo nhiệt độ dàn lạnh", "Vệ sinh lưới lọc", "Chạy thử và ghi nhận"] },
  { nhom: "Điện lạnh", ten: "Máy lạnh chảy nước",
    buoc: ["Ngắt nguồn điện", "Kiểm tra ống thoát nước", "Vệ sinh máng hứng", "Kiểm tra dàn trao đổi nhiệt"] },
  { nhom: "Điện lạnh", ten: "Vệ sinh định kỳ",
    buoc: ["Ngắt nguồn điện", "Tháo lưới lọc", "Vệ sinh dàn nóng và dàn lạnh", "Kiểm tra gas sau vệ sinh"] },
  { nhom: "Mạng máy tính", ten: "Mất kết nối mạng",
    buoc: ["Kiểm tra dây mạng", "Kiểm tra đèn cổng", "Ping kiểm tra đường truyền", "Kiểm tra cấu hình IP"] },
  { nhom: "Mạng máy tính", ten: "WiFi yếu",
    buoc: ["Đo cường độ sóng", "Kiểm tra vị trí bộ phát", "Đổi kênh sóng", "Kiểm tra số thiết bị truy cập"] },
  { nhom: "Mạng máy tính", ten: "Router treo",
    buoc: ["Kiểm tra nguồn điện", "Khởi động lại thiết bị", "Kiểm tra nhật ký", "Cập nhật firmware"] },
  { nhom: "Mạng máy tính", ten: "Cấu hình IP",
    buoc: ["Kiểm tra dải địa chỉ", "Cấp phát IP tĩnh", "Kiểm tra cổng mặc định", "Kiểm tra DNS"] },
  { nhom: "Thiết bị trình chiếu", ten: "Máy chiếu nhòe màu",
    buoc: ["Kiểm tra cáp tín hiệu", "Cân chỉnh màu sắc", "Vệ sinh ống kính", "Kiểm tra bóng đèn"] },
  { nhom: "Thiết bị trình chiếu", ten: "Máy chiếu không lên hình",
    buoc: ["Kiểm tra nguồn điện", "Kiểm tra nguồn vào", "Thay cáp tín hiệu", "Kiểm tra bóng đèn"] }
];

let viTriMauDangChon = 0;

const goiYBuocTheoLoai = {
  "Máy lạnh": ["Ngắt nguồn điện an toàn", "Kiểm tra áp suất gas lạnh", "Kiểm tra quạt dàn lạnh", "Đo cảm biến nhiệt", "Kiểm tra bo mạch điều khiển"],
  "Máy chiếu": ["Kiểm tra nguồn điện", "Kiểm tra cáp tín hiệu", "Vệ sinh ống kính", "Kiểm tra bóng đèn", "Cân chỉnh màu sắc"],
  "Máy in": ["Kiểm tra trạng thái máy in", "Kiểm tra khay giấy", "Vệ sinh cụm lô sấy", "Cập nhật driver", "In thử trang kiểm tra"],
  "Router WiFi": ["Kiểm tra nguồn điện", "Kiểm tra đèn tín hiệu", "Khởi động lại thiết bị", "Kiểm tra cấu hình mạng", "Kiểm tra firmware"],
  "Camera": ["Kiểm tra nguồn điện", "Kiểm tra cáp mạng", "Kiểm tra đầu ghi hình", "Kiểm tra địa chỉ IP", "Kiểm tra ống kính"],
  "Máy tính": ["Kiểm tra nguồn điện", "Kiểm tra RAM", "Kiểm tra ổ cứng", "Kiểm tra quạt tản nhiệt", "Chạy phần mềm chẩn đoán"]
};

const nhomTheoLoai = {
  "Máy lạnh": "Điện lạnh",
  "Máy chiếu": "Thiết bị trình chiếu",
  "Máy in": "Văn phòng",
  "Router WiFi": "Mạng máy tính",
  "Camera": "Mạng máy tính",
  "Máy tính": "Mạng máy tính"
};

// TRANG 05: THONG KE
const duLieuThongKe = {
  "Tháng này": {
    hoanThanh: 45, thayDoiHoanThanh: "+12%",
    thoiGianTB: "2.5h", thayDoiThoiGian: "-18 phút",
    danhGia: "4.8/5", dungSLA: "92%",
    xuHuong: [18, 22, 20, 25, 23, 27, 26, 29, 28, 31, 33, 38]
  },
  "Quý": {
    hoanThanh: 132, thayDoiHoanThanh: "+9%",
    thoiGianTB: "2.7h", thayDoiThoiGian: "-9 phút",
    danhGia: "4.7/5", dungSLA: "90%",
    xuHuong: [22, 25, 24, 28, 27, 30, 31, 29, 33, 34, 36, 40]
  },
  "Năm": {
    hoanThanh: 486, thayDoiHoanThanh: "+15%",
    thoiGianTB: "2.9h", thayDoiThoiGian: "-12 phút",
    danhGia: "4.7/5", dungSLA: "89%",
    xuHuong: [30, 34, 33, 38, 36, 41, 43, 40, 45, 47, 50, 54]
  }
};

const loiThuongGap = [
  { ten: "Không làm lạnh", tyLe: 90 },
  { ten: "Mất kết nối", tyLe: 62 },
  { ten: "Không lên hình", tyLe: 45 },
  { ten: "Kẹt giấy", tyLe: 30 }
];

const danhGiaGanDay = [
  { ma: "TK-2025-031", thietBi: "Máy lạnh phòng 205", diem: "5.0", nhanXet: "Rất nhanh và chuyên nghiệp" },
  { ma: "TK-2025-028", thietBi: "Router thư viện", diem: "4.8", nhanXet: "Xử lý dứt điểm" },
  { ma: "TK-2025-024", thietBi: "Máy chiếu", diem: "4.5", nhanXet: "Hỗ trợ tốt" }
];


/* =========================================================
   TRANG 01 - HANG DOI CONG VIEC
   ========================================================= */

// CHỨC NĂNG 1: Tìm kiếm và lọc ticket theo từ khóa, danh mục và mức độ ưu tiên
function layHangDoiDaLoc() {
  const oTuKhoa = document.getElementById("tuKhoaHangDoi");
  const oDanhMuc = document.getElementById("locDanhMuc");
  const oUuTien = document.getElementById("locUuTien");

  const tuKhoa = oTuKhoa.value.toLowerCase().trim();
  const danhMuc = oDanhMuc.value;
  const uuTien = oUuTien.value;

  const ketQua = [];
  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    const ticket = danhSachTicketHangDoi[i];
    const chuoiTim = (ticket.ma + " " + ticket.tenSuCo + " " + ticket.maThietBi + " " + ticket.diaDiem).toLowerCase();

    const khopTuKhoa = tuKhoa === "" || chuoiTim.indexOf(tuKhoa) !== -1;
    const khopDanhMuc = danhMuc === "" || ticket.danhMuc === danhMuc;
    const khopUuTien = uuTien === "" || ticket.mucDo === uuTien;

    if (khopTuKhoa && khopDanhMuc && khopUuTien) {
      ketQua.push(ticket);
    }
  }
  return ketQua;
}

// CHỨC NĂNG 2: Tạo thẻ ticket hiển thị thông tin và nút thao tác
function taoTheTicketHangDoi(ticket) {
  const the = document.createElement("div");
  the.className = "the-ticket";

  const oDongTren = document.createElement("div");
  oDongTren.className = "dong-giua";

  const oMa = document.createElement("span");
  oMa.className = "ma-ticket";
  oMa.textContent = ticket.ma;

  const oMucDo = document.createElement("span");
  oMucDo.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
  oMucDo.textContent = ticket.mucDo;

  oDongTren.appendChild(oMa);
  oDongTren.appendChild(oMucDo);

  const oTen = document.createElement("p");
  oTen.className = "ten-ticket";
  oTen.textContent = ticket.tenSuCo;

  const oThietBi = document.createElement("p");
  oThietBi.className = "thiet-bi-ticket";
  oThietBi.textContent = ticket.maThietBi + " · " + ticket.diaDiem;

  const oDongDuoi = document.createElement("div");
  oDongDuoi.className = "dong-duoi-ticket";

  const oNguoi = document.createElement("span");
  oNguoi.className = "nguoi-yeu-cau";
  oNguoi.textContent = ticket.nguoiYeuCau;

  const oThoiGian = document.createElement("span");
  oThoiGian.className = "thoi-gian-con";
  if (ticket.gioConLai < 2) {
    oThoiGian.classList.add("canh-bao");
  }
  oThoiGian.textContent = ticket.thongTinThoiGian;

  oDongDuoi.appendChild(oNguoi);
  oDongDuoi.appendChild(oThoiGian);

  const oNut = document.createElement("button");
  oNut.className = "nut-chinh nut-nho";
  if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
    oNut.textContent = "Tiếp tục";
  } else if (ticket.trangThai === "Hoàn thành") {
    oNut.className = "nut-phu nut-nho";
    oNut.textContent = "Xem chi tiết";
  } else {
    oNut.textContent = "Nhận việc";
  }
  oNut.addEventListener("click", function (suKien) {
    suKien.stopPropagation();
    xuLyNutHangDoi(ticket);
  });

  the.appendChild(oDongTren);
  the.appendChild(oTen);
  the.appendChild(oThietBi);
  the.appendChild(oDongDuoi);
  the.appendChild(oNut);

  the.addEventListener("click", function () {
    moChiTietHangDoi(ticket);
  });

  return the;
}

// CHỨC NĂNG 3: Hiển thị ticket theo trạng thái và cập nhật số lượng từng cột
function hienThiHangDoi() {
  const danhSach = layHangDoiDaLoc();

  const oChoNhan = document.getElementById("cotChoNhan");
  const oDangXuLy = document.getElementById("cotDangXuLy");
  const oHoanThanh = document.getElementById("cotHoanThanh");

  oChoNhan.innerHTML = "";
  oDangXuLy.innerHTML = "";
  oHoanThanh.innerHTML = "";

  let soCho = 0;
  let soDang = 0;
  let soXong = 0;

  for (let i = 0; i < danhSach.length; i++) {
    const ticket = danhSach[i];
    const the = taoTheTicketHangDoi(ticket);

    if (ticket.trangThai === "Chờ nhận") {
      oChoNhan.appendChild(the);
      soCho = soCho + 1;
    } else if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
      // "Tạm dừng" vẫn là ticket đang làm, không được đếm vào cột Hoàn thành
      oDangXuLy.appendChild(the);
      soDang = soDang + 1;
    } else {
      oHoanThanh.appendChild(the);
      soXong = soXong + 1;
    }
  }

  if (soCho === 0) oChoNhan.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';
  if (soDang === 0) oDangXuLy.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';
  if (soXong === 0) oHoanThanh.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';

  document.getElementById("soChoNhanCot").textContent = soCho;
  document.getElementById("soDangXuLyCot").textContent = soDang;
  document.getElementById("soHoanThanhCot").textContent = soXong;
  document.getElementById("phuDeHangDoi").textContent = (soCho + soDang) + " ticket cần ưu tiên hôm nay";

  hienThiBangHangDoi(danhSach);
}

// CHỨC NĂNG 4: Hiển thị danh sách ticket dưới dạng bảng
function hienThiBangHangDoi(danhSach) {
  const oBang = document.getElementById("bangHangDoi");
  if (!oBang) return;

  oBang.innerHTML = "";
  for (let i = 0; i < danhSach.length; i++) {
    const ticket = danhSach[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = ticket.ma;

    const oTen = document.createElement("td");
    oTen.textContent = ticket.tenSuCo;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = ticket.maThietBi + " · " + ticket.diaDiem;

    const oMucDo = document.createElement("td");
    const oNhan = document.createElement("span");
    oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
    oNhan.textContent = ticket.mucDo;
    oMucDo.appendChild(oNhan);

    const oThoiGian = document.createElement("td");
    oThoiGian.textContent = ticket.thongTinThoiGian;

    const oTrangThai = document.createElement("td");
    oTrangThai.textContent = ticket.trangThai;

    const oXem = document.createElement("td");
    const oLienKet = document.createElement("span");
    oLienKet.className = "lien-ket-xem";
    oLienKet.textContent = "Xem";
    oLienKet.addEventListener("click", function () {
      moChiTietHangDoi(ticket);
    });
    oXem.appendChild(oLienKet);

    oDong.appendChild(oMa);
    oDong.appendChild(oTen);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oMucDo);
    oDong.appendChild(oThoiGian);
    oDong.appendChild(oTrangThai);
    oDong.appendChild(oXem);
    oBang.appendChild(oDong);
  }

  const oSoDong = document.getElementById("soDongBang");
  if (oSoDong) {
    oSoDong.textContent = danhSach.length + " ticket";
  }
}

// CHỨC NĂNG 5: Mở khung chi tiết của ticket được chọn
function moChiTietHangDoi(ticket) {
  ticketDangChonHangDoi = ticket;
  const oKhung = document.getElementById("khungChiTiet");
  if (!oKhung) return;

  let html = "";
  const daXong = ticket.trangThai === "Hoàn thành";
  html += '<span class="the-muc-do muc-trung-binh mau-ticket-lon">' + ticket.ma + "</span>";
  html += '<h3 class="tieu-de-ct">' + ticket.tenSuCo + "</h3>";
  html += '<p class="mo-ta-ct">' + ticket.moTa + "</p>";
  html += '<div class="dong-ct"><span>Thiết bị</span><strong>' + ticket.maThietBi + "</strong></div>";
  html += '<div class="dong-ct"><span>Vị trí</span><strong>' + ticket.diaDiem + "</strong></div>";
  html += '<div class="dong-ct"><span>Người yêu cầu</span><strong>' + ticket.nguoiYeuCau + "</strong></div>";
  html += '<div class="dong-ct"><span>SLA</span><strong class="chu-canh-bao">' + ticket.thongTinThoiGian + "</strong></div>";
  if (daXong) {
    html += '<p class="ghi-chu" style="margin-top:18px">Ticket đã hoàn thành, chỉ có thể xem lại.</p>';
  } else {
    html += '<button class="nut-chinh" id="nutBatDauXuLy" style="width:100%;margin-top:18px">▶ Bắt đầu xử lý</button>';
  }
  html += '<button class="nut-phu" id="nutTuChoi" style="width:100%;margin-top:10px">✕ Từ chối</button>';
  html += '<label class="nhan-nhap" for="lyDoTuChoi">Lý do từ chối</label>';
  html += '<select class="o-chon o-dong" id="lyDoTuChoi">';
  html += '<option value="">Chọn lý do...</option>';
  html += "<option>Không thuộc chuyên môn</option>";
  html += "<option>Thiếu thiết bị phụ trợ</option>";
  html += "<option>Đã có người khác xử lý</option>";
  html += "<option>Khác</option>";
  html += "</select>";

  oKhung.innerHTML = html;

  const oNutBatDau = document.getElementById("nutBatDauXuLy");
  if (oNutBatDau) {
    oNutBatDau.addEventListener("click", function () {
      batDauXuLy(ticket);
    });
  }
  const oNutTuChoi = document.getElementById("nutTuChoi");
  if (oNutTuChoi) {
    oNutTuChoi.addEventListener("click", function () {
      tuChoiTicket(ticket);
    });
  }
}

// CHỨC NĂNG 6: Xử lý thao tác Nhận việc, Tiếp tục hoặc Xem chi tiết
function xuLyNutHangDoi(ticket) {
  if (ticket.trangThai === "Chờ nhận") {
    ticket.trangThai = "Đang xử lý";
    // Luồng 1 - "Nhận việc": lưu ticket để trang Đang sửa đọc lại sau khi chuyển trang
    luuTicketDangXuLy(ticket);
    hienThiHangDoi();
    moChiTietHangDoi(ticket);
    hienThongBao("Đã nhận việc " + ticket.ma + ". Bấm Tiếp tục để mở trang Đang sửa.");
    return;
  }

  if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
    // Luồng 2 - "Tiếp tục": lưu ticket trước khi mở trang Đang sửa
    // Ticket đang tạm dừng vẫn mở lại được, tiến độ checklist giữ nguyên
    luuTicketDangXuLy(ticket);
    window.location.href = "fixing.html";
    return;
  }

  moChiTietHangDoi(ticket);
}

// CHỨC NĂNG 7: Bắt đầu xử lý ticket và chuyển sang trang Đang sửa
function batDauXuLy(ticket) {
  if (ticket.trangThai === "Hoàn thành") {
    hienThongBao("Ticket đã hoàn thành, không thể xử lý lại.");
    return;
  }
  if (ticket.trangThai === "Chờ nhận") {
    ticket.trangThai = "Đang xử lý";
    ticket.statusCode = "in_progress";
    hienThiHangDoi();
  }
  // Luồng 3 - "Bắt đầu xử lý": lưu ticket trước khi mở trang Đang sửa
  luuTicketDangXuLy(ticket);
  hienThongBao("Chuyển sang bước xử lý của ticket " + ticket.ma);
  window.location.href = "fixing.html";
}

// CHỨC NĂNG 8: Từ chối ticket sau khi chọn lý do
function tuChoiTicket(ticket) {
  const oLyDo = document.getElementById("lyDoTuChoi");
  const lyDo = oLyDo.value;

  if (lyDo === "") {
    hienThongBao("Vui lòng chọn lý do từ chối.");
    return;
  }

  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    if (danhSachTicketHangDoi[i].ma === ticket.ma) {
      danhSachTicketHangDoi.splice(i, 1);
      break;
    }
  }

  ticketDangChonHangDoi = null;
  document.getElementById("khungChiTiet").innerHTML =
    '<p class="thong-diep-trong">Chọn một ticket bên trái để xem chi tiết.</p>';
  hienThiHangDoi();
  hienThongBao("Đã từ chối ticket " + ticket.ma + " với lý do: " + lyDo);
}

// CHỨC NĂNG 9: Chuyển đổi giữa chế độ xem Kanban và chế độ danh sách
function chuyenCheDoHangDoi(cheDo) {
  const oKanban = document.getElementById("khungKanban");
  const oBang = document.getElementById("khungBangHangDoi");
  const oNutKanban = document.getElementById("nutKanban");
  const oNutDanhSach = document.getElementById("nutDanhSach");

  if (cheDo === "kanban") {
    oKanban.style.display = "grid";
    oBang.style.display = "none";
    oNutKanban.classList.add("dang-chon");
    oNutDanhSach.classList.remove("dang-chon");
  } else {
    oKanban.style.display = "none";
    oBang.style.display = "block";
    oNutKanban.classList.remove("dang-chon");
    oNutDanhSach.classList.add("dang-chon");
    hienThiBangHangDoi(layHangDoiDaLoc());
  }
}

// CHỨC NĂNG 10: Khởi tạo trang Hàng đợi và thiết lập các sự kiện
 
//hello
function khoiTaoHangDoi() {
  const oKanban = document.getElementById("khungKanban");
  const oBang = document.getElementById("khungBangHangDoi");
  oKanban.style.display = "grid";
  oBang.style.display = "none";

  hienThiHangDoi();

  document.getElementById("tuKhoaHangDoi").addEventListener("input", hienThiHangDoi);
  document.getElementById("locDanhMuc").addEventListener("change", hienThiHangDoi);
  document.getElementById("locUuTien").addEventListener("change", hienThiHangDoi);

  document.getElementById("nutDatLai").addEventListener("click", function () {
    document.getElementById("tuKhoaHangDoi").value = "";
    document.getElementById("locDanhMuc").value = "";
    document.getElementById("locUuTien").value = "";
    hienThiHangDoi();
    hienThongBao("Đã đặt lại bộ lọc.");
  });

  document.getElementById("nutKanban").addEventListener("click", function () {
    chuyenCheDoHangDoi("kanban");
  });

  document.getElementById("nutDanhSach").addEventListener("click", function () {
    chuyenCheDoHangDoi("danh-sach");
  });
}

/* =========================================================
   TRANG 02 - DANG SUA
   ========================================================= */

// Thoi gian da xu ly ban dau cua ticket mau: 1h 24p 18s (giu giong ban thiet ke)
const THOI_GIAN_XU_LY_BAN_DAU = 1 * 3600 + 24 * 60 + 18;

let maTicketDangSua = "TK-2025-001";
let duLieuTicketDangSua = null;
let dongHoXuLy = null;
let goiYAIHienTai = [];
let soLanTaoLai = 0;

// Tim ticket trong danh sach Hang doi theo ma ticket
function layTicketTheoMa(maTicket) {
  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    if (danhSachTicketHangDoi[i].ma === maTicket) {
      return danhSachTicketHangDoi[i];
    }
  }
  return null;
}

function saoChepChecklist(danhSachGoc) {
  const ketQua = [];
  for (let i = 0; i < danhSachGoc.length; i++) {
    ketQua.push({ ten: danhSachGoc[i].ten, xong: danhSachGoc[i].xong });
  }
  return ketQua;
}

// Du lieu mac dinh cho ticket chua tung duoc mo tren trinh duyet nay
function taoDuLieuTicketMacDinh(ticket) {
  // Goi y AI sinh theo tung ticket (quy tac mo phong trong generateChecklist)
  const goiYDeXuat = ticket ? generateChecklist(ticket) : saoChepChecklist(CHECKLIST_MAC_DINH);

  const tenGoiY = [];
  for (let i = 0; i < goiYDeXuat.length; i++) {
    tenGoiY.push(goiYDeXuat[i].ten);
  }

  // Ticket binh thuong: checklist bat dau trong de nguoi dung chu dong bam
  // "Chap nhan" dua goi y AI vao hoac tu "Them buoc".
  // Ticket da hoan thanh tu truoc (khong co du lieu luu): nap san va danh dau xong het.
  let checklistBanDau = [];
  if (ticket === null) {
    checklistBanDau = saoChepChecklist(CHECKLIST_MAC_DINH);
  } else if (ticket.trangThai === "Hoàn thành") {
    for (let i = 0; i < tenGoiY.length; i++) {
      checklistBanDau.push({ ten: tenGoiY[i], xong: true });
    }
  }

  return {
    
    trangThai: ticket ? ticket.trangThai : "Đang xử lý",
    statusCode: ticket && ticket.trangThai === "Hoàn thành" ? "completed" : "in_progress",
    ghiChu: "",
    checklist: checklistBanDau,
    batDau: Date.now() - THOI_GIAN_XU_LY_BAN_DAU * 1000,
    giayDaXuLy: 0,
    thoiDiemHoanThanh: "",
    thoiGianXuLy: 0,
    goiYAI: tenGoiY,
    soLanTaoLai: 0,
    trangThaiGoiYAI: "moi"
  };
}

function daHoanThanh() {
  return duLieuTicketDangSua !== null &&
    (duLieuTicketDangSua.trangThai === "Hoàn thành" || duLieuTicketDangSua.statusCode === "completed");
}

// Checklist mô phỏng theo quy tắc, không gọi AI API hay backend thật.
function generateChecklist(ticket) {
  const tenSuCo = (ticket.tenSuCo || "").toLowerCase();
  const maThietBi = (ticket.maThietBi || "").toUpperCase();
  let danhSach = null;

  if (tenSuCo.indexOf("máy lạnh") !== -1 || maThietBi.indexOf("AC-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và chế độ làm lạnh", "Kiểm tra bộ lọc gió", "Kiểm tra dàn nóng và dàn lạnh", "Kiểm tra tình trạng gas lạnh", "Chạy thử máy và xác nhận khả năng làm mát"];
  } else if (tenSuCo.indexOf("router") !== -1 || maThietBi.indexOf("RT-") === 0) {
    danhSach = ["Kiểm tra nguồn điện", "Kiểm tra cáp mạng và đèn tín hiệu WAN", "Kiểm tra kết nối giữa router và modem", "Kiểm tra cấu hình mạng", "Thử kết nối lại sau khi xử lý"];
  } else if (tenSuCo.indexOf("máy in") !== -1 || maThietBi.indexOf("PR-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và trạng thái máy in", "Kiểm tra cáp hoặc kết nối Wi-Fi", "Kiểm tra hàng đợi in", "Kiểm tra driver và cấu hình máy in", "In thử để xác nhận hoạt động"];
  } else if (tenSuCo.indexOf("máy tính") !== -1 || maThietBi.indexOf("PC-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và dây kết nối", "Kiểm tra bộ sạc hoặc nguồn máy", "Kiểm tra dấu hiệu khởi động", "Kiểm tra các thành phần phần cứng cơ bản", "Khởi động thử để xác nhận kết quả"];
  }

  if (danhSach === null) {
    danhSach = ["Xác nhận tình trạng thiết bị", "Kiểm tra nguồn điện và kết nối", "Kiểm tra các bộ phận liên quan", "Thực hiện xử lý phù hợp", "Chạy thử và ghi nhận kết quả"];
  }

  const ketQua = [];
  for (let i = 0; i < danhSach.length; i++) {
    ketQua.push({ ten: danhSach[i], xong: false });
  }
  return ketQua;
}

// Mo trang Dang sua hoac thao tac tren checklist = ky thuat vien da nhan ticket,
// nen nhan trang thai khong duoc giu o "Chờ nhận" nhu luc con trong Hang doi
function danhDauDaNhanTicket() {
  if (duLieuTicketDangSua === null) return;
  if (daHoanThanh()) return;
  if (duLieuTicketDangSua.trangThai !== "Chờ nhận") return;

  duLieuTicketDangSua.trangThai = "Đang xử lý";
  duLieuTicketDangSua.statusCode = "in_progress";
  capNhatNhanTrangThai();
}

// Luu checklist + ghi chu + trang thai cua ticket dang mo
function luuDuLieuDangSua() {
  if (duLieuTicketDangSua === null) return;
  danhDauDaNhanTicket();
  duLieuTicketDangSua.checklist = danhSachBuocChecklist;
  if (duLieuTicketDangSua.trangThai === "Hoàn thành") {
    duLieuTicketDangSua.statusCode = "completed";
  } else if (duLieuTicketDangSua.trangThai === "Đang xử lý") {
    duLieuTicketDangSua.statusCode = "in_progress";
  }
  luuDuLieuTicket(maTicketDangSua, duLieuTicketDangSua);
}

function kiemTraBuocDaCo(tenBuoc) {
  const tenThuong = tenBuoc.trim().toLowerCase();
  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].ten.trim().toLowerCase() === tenThuong) {
      return true;
    }
  }
  return false;
}

function hienThiChecklistXuLy() {
  const oDanhSach = document.getElementById("danhSachBuocXuLy");
  if (!oDanhSach) return;

  oDanhSach.innerHTML = "";
  const oLoi = document.getElementById("loiChecklist");
  if (oLoi && danhSachBuocChecklist.length > 0) {
    oLoi.hidden = true;
  }

  if (danhSachBuocChecklist.length === 0) {
    const oTrong = document.createElement("li");
    oTrong.className = "thong-diep-trong";
    oTrong.textContent = 'Checklist đang trống. Bấm "Thêm bước" để tạo bước kiểm tra.';
    oDanhSach.appendChild(oTrong);
  }

  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    const buoc = danhSachBuocChecklist[i];

    const oDong = document.createElement("li");
    oDong.className = "dong-buoc";
    if (buoc.xong) {
      oDong.classList.add("da-xong");
    }

    const oChon = document.createElement("input");
    oChon.type = "checkbox";
    oChon.checked = buoc.xong;
    oChon.disabled = daHoanThanh();
    oChon.title = "Đánh dấu bước đã hoàn thành";
    oChon.addEventListener("change", function () {
      buoc.xong = oChon.checked;
      tiepTucNeuDangTamDung();
      luuDuLieuDangSua();
      hienThiChecklistXuLy();
      if (buoc.xong) {
        hienThongBao("Đã xong: " + buoc.ten);
      } else {
        hienThongBao("Đã bỏ đánh dấu: " + buoc.ten);
      }
    });

    const oTen = document.createElement("span");
    oTen.className = "ten-buoc";
    oTen.textContent = buoc.ten;

    oDong.appendChild(oChon);
    oDong.appendChild(oTen);

    // Ticket da hoan thanh thi chi de xem, khong sua/xoa duoc nua
    if (!daHoanThanh()) {
      const oSua = document.createElement("button");
      oSua.className = "nut-nho-bieu-tuong";
      oSua.title = "Sửa tên bước";
      oSua.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
      oSua.addEventListener("click", function () {
        const tenMoi = window.prompt("Nhập tên mới cho bước này:", buoc.ten);
        if (tenMoi === null) return;
        if (tenMoi.trim() === "") {
          hienThongBao("Tên bước không được để trống.");
          return;
        }
        buoc.ten = tenMoi.trim();
        luuDuLieuDangSua();
        hienThiChecklistXuLy();
        hienThongBao("Đã sửa tên bước kiểm tra.");
      });

      const oXoa = document.createElement("button");
      oXoa.className = "nut-nho-bieu-tuong";
      oXoa.title = "Xóa bước";
      oXoa.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
      oXoa.addEventListener("click", function () {
        const dongY = window.confirm('Xóa bước "' + buoc.ten + '" khỏi checklist?');
        if (!dongY) return;
        danhSachBuocChecklist.splice(i, 1);
        luuDuLieuDangSua();
        hienThiChecklistXuLy();
        hienThongBao("Đã xóa một bước kiểm tra.");
      });

      oDong.appendChild(oSua);
      oDong.appendChild(oXoa);
    }

    oDanhSach.appendChild(oDong);
  }

  capNhatTienDoXuLy();
  capNhatTrangThaiNut();
}

// Khoa cac nut khi ticket da hoan thanh (tranh bam hoan thanh 2 lan)
function capNhatTrangThaiNut() {
  const daXong = daHoanThanh();
  const cacNut = ["nutThemBuoc", "nutChapNhan", "nutTaoLai", "nutTuChoiChecklist",
                  "nutSuaChecklist", "nutDungThuCong", "nutTamDung", "nutHoanThanh",
                  "nutLuuGhiChu"];

  for (let i = 0; i < cacNut.length; i++) {
    const oNut = document.getElementById(cacNut[i]);
    if (oNut) {
      oNut.disabled = daXong;
    }
  }

  // Ghi chu da duoc chot luc hoan thanh thi khong cho sua nua
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    oGhiChu.disabled = daXong;
  }

  const oHoanThanh = document.getElementById("nutHoanThanh");
  if (oHoanThanh) {
    oHoanThanh.textContent = daXong ? "Đã hoàn thành" : "Hoàn thành";
  }
}

function capNhatTienDoXuLy() {
  const tong = danhSachBuocChecklist.length;
  let soDaXong = 0;

  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].xong) {
      soDaXong = soDaXong + 1;
    }
  }

  let phanTram = 0;
  if (tong > 0) {
    phanTram = Math.round((soDaXong / tong) * 100);
  }

  const oSoTienDo = document.getElementById("soTienDo");
  if (oSoTienDo) {
    oSoTienDo.textContent = soDaXong + "/" + tong;
  }

  const oPhanTram = document.getElementById("phanTramChecklist");
  if (oPhanTram) {
    oPhanTram.textContent = phanTram + "% checklist";
  }

  // Vong tron tien do ve bang conic-gradient, khong can canvas
  const oVongTienDo = document.getElementById("vongTienDo");
  if (oVongTienDo) {
    oVongTienDo.style.background =
      "conic-gradient(var(--mau-xanh) 0% " + phanTram + "%, #dce6f8 " + phanTram + "% 100%)";
  }

  // Lam xong het thi an dong nhac loi checklist
  const oLoi = document.getElementById("loiChecklist");
  if (oLoi && tong > 0 && soDaXong === tong) {
    oLoi.hidden = true;
  }
}

// So giay da xu ly: ticket dang chay thi tinh tu luc bat dau,
// ticket tam dung hoac da hoan thanh thi lay so giay da chot truoc do
function layGiayDaXuLy() {
  if (duLieuTicketDangSua === null) return 0;
  if (duLieuTicketDangSua.trangThai === "Tạm dừng" || daHoanThanh()) {
    return duLieuTicketDangSua.giayDaXuLy || 0;
  }
  if (!duLieuTicketDangSua.batDau) return 0;

  const giay = Math.floor((Date.now() - duLieuTicketDangSua.batDau) / 1000);
  if (giay < 0) return 0;
  return giay;
}

function dinhDangDongHo(tongGiay) {
  const gio = Math.floor(tongGiay / 3600);
  const phut = Math.floor((tongGiay % 3600) / 60);
  const giay = tongGiay % 60;

  const chuoiGio = (gio < 10 ? "0" : "") + gio;
  const chuoiPhut = (phut < 10 ? "0" : "") + phut;
  const chuoiGiay = (giay < 10 ? "0" : "") + giay;
  return chuoiGio + ":" + chuoiPhut + ":" + chuoiGiay;
}

function capNhatDongHo() {
  const oDongHo = document.getElementById("thoiGianDaXuLy");
  if (!oDongHo) return;
  oDongHo.textContent = dinhDangDongHo(layGiayDaXuLy());
}

function dungDongHoXuLy() {
  if (dongHoXuLy !== null) {
    clearInterval(dongHoXuLy);
    dongHoXuLy = null;
  }
}

function chayDongHoXuLy() {
  dungDongHoXuLy();
  capNhatDongHo();

  // Ticket da hoan thanh hoac dang tam dung thi khong dem thoi gian nua
  if (daHoanThanh()) return;
  if (duLieuTicketDangSua !== null && duLieuTicketDangSua.trangThai === "Tạm dừng") return;

  dongHoXuLy = setInterval(capNhatDongHo, 1000);
}

function tinhSoGioXuLy() {
  const gio = Math.round((layGiayDaXuLy() / 3600) * 10) / 10;
  if (gio < 0.1) return 0.1;
  return gio;
}

// Hien trang thai moi nhat len nhan o phan tieu de va dong bo sang trang Hang doi
function capNhatNhanTrangThai() {
  const oNhan = document.getElementById("nhanMucDoDangSua");
  const ticket = layTicketTheoMa(maTicketDangSua);
  if (!oNhan || duLieuTicketDangSua === null || ticket === null) return;

  ticket.trangThai = duLieuTicketDangSua.trangThai;
  ticket.statusCode = duLieuTicketDangSua.statusCode ||
    (ticket.trangThai === "Hoàn thành" ? "completed" : "in_progress");
  oNhan.textContent = duLieuTicketDangSua.trangThai;
  oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
}

// Dang tam dung ma nguoi dung thao tac tiep thi tu dong tiep tuc dem gio
function tiepTucNeuDangTamDung() {
  if (duLieuTicketDangSua === null) return;
  if (duLieuTicketDangSua.trangThai !== "Tạm dừng") return;

  duLieuTicketDangSua.trangThai = "Đang xử lý";
  duLieuTicketDangSua.batDau = Date.now() - (duLieuTicketDangSua.giayDaXuLy || 0) * 1000;
  capNhatNhanTrangThai();
  chayDongHoXuLy();
}

// Hien thi danh sach lich su cua thiet bi (cung 2 chu cai dau ma thiet bi,
// vi du AC-023 / AC-011 deu la may lanh) de khoi lich su dong theo ticket.
function hienThiLichSuThietBi(maThietBi) {
  const oDanhSach = document.getElementById("lichSuThietBi");
  if (!oDanhSach) return;

  oDanhSach.innerHTML = "";
  const tienToThietBi = maThietBi.substring(0, 2);
  let soDong = 0;

  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    const ticketCu = danhSachTicketHangDoi[i];
    const cungLoaiThietBi = ticketCu.maThietBi.substring(0, 2) === tienToThietBi;
    if (cungLoaiThietBi === false || ticketCu.trangThai !== "Hoàn thành") {
      continue;
    }

    const oDong = document.createElement("li");
    oDong.textContent = ticketCu.ma + " · " + ticketCu.tenSuCo + " (" + ticketCu.thongTinThoiGian + ")";
    oDanhSach.appendChild(oDong);
    soDong = soDong + 1;
  }

  if (soDong === 0) {
    const oDong = document.createElement("li");
    oDong.textContent = "Chưa có lịch sử sửa chữa cho thiết bị này.";
    oDanhSach.appendChild(oDong);
  }
}

// Cap nhat toan bo noi dung dong cua trang 02 theo ticket vua chon o trang 01
function capNhatThongTinDangSua(ticket) {
  // Tieu de tab trinh duyet
  document.title = "FixFlow · Đang sửa · " + ticket.ma;

  // Duong dan, tieu de trang va dong phu de
  document.getElementById("duongDanMa").textContent = ticket.ma;
  document.getElementById("tieuDeDangSua").textContent = ticket.tenSuCo;
  document.getElementById("phuDeDangSua").textContent =
    ticket.ma + " · " + ticket.maThietBi + " · Ưu tiên " + ticket.mucDo.toLowerCase();

  // The "Thong tin su co"
  document.getElementById("viTriSuCo").textContent = ticket.diaDiem;
  document.getElementById("thietBiSuCo").textContent = ticket.maThietBi;
  document.getElementById("nguoiYeuCauSuCo").textContent = ticket.nguoiYeuCau;
  document.getElementById("moTaSuCo").textContent = ticket.moTa;

  // Tieu de khoi lich su va danh sach lich su cua thiet bi tuong ung
  document.getElementById("tieuDeLichSuThietBi").textContent = "Lịch sử thiết bị " + ticket.maThietBi;
  hienThiLichSuThietBi(ticket.maThietBi);

  // Nhan trang thai / muc do o goc phai tieu de (doi ca mau theo muc do)
  const oNhan = document.getElementById("nhanMucDoDangSua");
  if (oNhan) {
    oNhan.textContent = ticket.trangThai;
    oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
  }
}

// ---------- Goi y AI (mo phong bang du lieu mau, khong goi AI that) ----------

function taoDanhSachGoiYAI(soLan) {
  const ticket = layTicketTheoMa(maTicketDangSua);
  const goiYTheoTicket = ticket ? generateChecklist(ticket).map(function (buoc) { return buoc.ten; }) : goiYBuocAI;
  if (soLan === 0) {
    return goiYTheoTicket.slice();
  }

  // Lan tao lai thu n: giu 2 goi y goc cua chinh ticket nay, thay 3 goi y con lai
  // bang kho goi y bo sung de danh sach van sat voi thiet bi dang sua
  const ketQua = [];
  ketQua.push(goiYTheoTicket[0]);
  if (goiYTheoTicket.length > 1) {
    ketQua.push(goiYTheoTicket[1]);
  }
  for (let i = 0; i < 3; i++) {
    ketQua.push(khoGoiYThem[(soLan * 3 + i) % khoGoiYThem.length]);
  }
  return ketQua;
}

// Do tin cay chi la con so mo phong, giam nhe moi lan bam "Tao lai"
function capNhatNhanTinCay() {
  const oNhan = document.getElementById("nhanDoTinCay");
  const oSoGoiY = document.getElementById("soGoiY");

  const doTinCay = Math.max(70, 85 - soLanTaoLai * 3);
  if (oNhan) {
    oNhan.textContent = doTinCay + "% tin cậy";
  }
  if (oSoGoiY) {
    oSoGoiY.textContent = goiYAIHienTai.length + " bước";
  }
}

function hienThiGoiYAI() {
  const oKhung = document.getElementById("danhSachGoiYAI");
  if (!oKhung) return;

  oKhung.innerHTML = "";

  for (let i = 0; i < goiYAIHienTai.length; i++) {
    const tenGoiY = goiYAIHienTai[i];
    const daCo = kiemTraBuocDaCo(tenGoiY);

    const oDong = document.createElement("li");
    oDong.className = "dong-goi-y";
    if (daCo) {
      oDong.classList.add("da-co");
    }

    const oSo = document.createElement("span");
    oSo.className = "so-goi-y";
    oSo.textContent = i + 1;

    const oTen = document.createElement("span");
    oTen.className = "ten-goi-y";
    oTen.textContent = tenGoiY;

    oDong.appendChild(oSo);
    oDong.appendChild(oTen);

    // Buoc nao da co trong checklist thi ghi ro de nguoi dung biet se bi bo qua
    if (daCo) {
      const oNhan = document.createElement("span");
      oNhan.className = "nhan nhan-xanh";
      oNhan.textContent = "Đã có";
      oDong.appendChild(oNhan);
    }

    oKhung.appendChild(oDong);
  }

  capNhatNhanTinCay();
}

function hienThiTrangThaiGoiYAI() {
  const oHop = document.getElementById("hopGoiYAI");
  const oTrangThai = document.getElementById("trangThaiGoiYAI");
  if (duLieuTicketDangSua === null) return;

  const trangThai = duLieuTicketDangSua.trangThaiGoiYAI || "moi";
  if (oHop) {
    oHop.hidden = trangThai !== "moi";
  }
  if (!oTrangThai) return;

  if (trangThai === "da-chap-nhan") {
    oTrangThai.textContent = "Đã áp dụng gợi ý AI vào checklist xử lý.";
  } else if (trangThai === "da-tu-choi") {
    oTrangThai.textContent = "Đã bỏ qua gợi ý AI. Checklist hiện tại được giữ nguyên.";
  } else if (trangThai === "thu-cong") {
    oTrangThai.textContent = 'Đang xử lý thủ công: tự thêm bước bằng nút "Thêm bước".';
  } else {
    oTrangThai.textContent = "Chưa áp dụng gợi ý nào.";
  }
}

function chapNhanGoiYAI() {
  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể thay đổi checklist.");
    return;
  }
  if (duLieuTicketDangSua.trangThaiGoiYAI !== "moi") {
    hienThongBao('Bấm "Tạo lại" nếu muốn xem gợi ý mới trước khi chấp nhận.');
    return;
  }

  let soThem = 0;
  let soBoQua = 0;

  for (let i = 0; i < goiYAIHienTai.length; i++) {
    const tenGoiY = goiYAIHienTai[i];
    if (kiemTraBuocDaCo(tenGoiY)) {
      soBoQua = soBoQua + 1;
    } else {
      danhSachBuocChecklist.push({ ten: tenGoiY, xong: false });
      soThem = soThem + 1;
    }
  }

  duLieuTicketDangSua.trangThaiGoiYAI = "da-chap-nhan";
  tiepTucNeuDangTamDung();
  luuDuLieuDangSua();

  hienThiChecklistXuLy();
  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();

  if (soThem === 0) {
    hienThongBao("Các bước gợi ý đều đã có trong checklist.");
  } else if (soBoQua > 0) {
    hienThongBao("Đã thêm " + soThem + " bước, bỏ qua " + soBoQua + " bước đã có.");
  } else {
    hienThongBao("Đã thêm " + soThem + " bước từ gợi ý AI.");
  }
}

function taoLaiGoiYAI() {
  if (daHoanThanh()) return;

  soLanTaoLai = soLanTaoLai + 1;
  goiYAIHienTai = taoDanhSachGoiYAI(soLanTaoLai);
  duLieuTicketDangSua.goiYAI = goiYAIHienTai;
  duLieuTicketDangSua.soLanTaoLai = soLanTaoLai;
  duLieuTicketDangSua.trangThaiGoiYAI = "moi";
  luuDuLieuDangSua();

  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();
  hienThongBao("Đã tạo lại gợi ý (mô phỏng từ dữ liệu mẫu, không gọi AI thật).");
}

function tuChoiGoiYAI() {
  if (daHoanThanh()) return;

  duLieuTicketDangSua.trangThaiGoiYAI = "da-tu-choi";
  luuDuLieuDangSua();
  hienThiTrangThaiGoiYAI();
  hienThongBao("Đã bỏ qua gợi ý AI. Checklist hiện tại được giữ nguyên.");
}

function suaGoiYAI() {
  if (daHoanThanh()) return;

  // Mo lai hop goi y de nguoi dung thay ro danh sach truoc khi sua
  if (duLieuTicketDangSua.trangThaiGoiYAI !== "moi") {
    duLieuTicketDangSua.trangThaiGoiYAI = "moi";
    hienThiTrangThaiGoiYAI();
  }

  const chuoiMoi = window.prompt(
    "Sửa danh sách gợi ý (mỗi bước cách nhau bằng dấu ;):",
    goiYAIHienTai.join("; ")
  );
  if (chuoiMoi === null) return;

  const cacPhan = chuoiMoi.split(";");
  const danhSachMoi = [];
  for (let i = 0; i < cacPhan.length; i++) {
    const ten = cacPhan[i].trim();
    if (ten !== "") {
      danhSachMoi.push(ten);
    }
  }

  if (danhSachMoi.length === 0) {
    hienThongBao("Danh sách gợi ý phải có ít nhất một bước.");
    return;
  }

  goiYAIHienTai = danhSachMoi;
  duLieuTicketDangSua.goiYAI = goiYAIHienTai;
  luuDuLieuDangSua();
  hienThiGoiYAI();
  hienThongBao("Đã cập nhật danh sách gợi ý.");
}

function dungThuCong() {
  if (daHoanThanh()) return;

  duLieuTicketDangSua.trangThaiGoiYAI = "thu-cong";
  luuDuLieuDangSua();
  hienThiTrangThaiGoiYAI();
  hienThongBao('Đã chuyển sang xử lý thủ công. Bấm "Thêm bước" để tự tạo checklist.');
}

function themBuocMoi() {
  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể thêm bước.");
    return;
  }

  const tenBuoc = window.prompt("Nhập tên bước kiểm tra:");
  if (tenBuoc === null) return;

  const ten = tenBuoc.trim();
  if (ten === "") {
    hienThongBao("Tên bước không được để trống.");
    return;
  }
  if (kiemTraBuocDaCo(ten)) {
    hienThongBao('Bước "' + ten + '" đã có trong checklist.');
    return;
  }

  danhSachBuocChecklist.push({ ten: ten, xong: false });
  tiepTucNeuDangTamDung();
  luuDuLieuDangSua();
  hienThiChecklistXuLy();
  hienThongBao("Đã thêm bước: " + ten);
}

// ---------- Ghi chu sua chua ----------

function capNhatTrangThaiGhiChu(noiDung) {
  const oTrangThai = document.getElementById("trangThaiGhiChu");
  if (oTrangThai) {
    oTrangThai.textContent = noiDung;
  }
}

function luuGhiChu() {
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (!oGhiChu || duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, ghi chú đã được chốt.");
    return;
  }

  duLieuTicketDangSua.ghiChu = oGhiChu.value.trim();
  luuDuLieuDangSua();
  capNhatTrangThaiGhiChu("Đã lưu lúc " + new Date().toLocaleTimeString("vi-VN"));
  hienThongBao("Đã lưu ghi chú cho ticket " + maTicketDangSua + ".");
}

function tamDungXuLy() {
  if (duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể tạm dừng.");
    return;
  }
  if (duLieuTicketDangSua.trangThai === "Tạm dừng") {
    hienThongBao("Ticket đang ở trạng thái tạm dừng. Đánh dấu một bước để làm tiếp.");
    return;
  }

  const dongY = window.confirm(
    "Tạm dừng xử lý ticket " + maTicketDangSua + "?\n" +
    "Tiến độ checklist vẫn được giữ lại để làm tiếp sau."
  );
  if (!dongY) return;

  // Luu so giay da lam viec roi dung dong ho lai
  duLieuTicketDangSua.giayDaXuLy = layGiayDaXuLy();
  duLieuTicketDangSua.batDau = 0;
  duLieuTicketDangSua.trangThai = "Tạm dừng";

  // Luu ghi chu dang go tren o nhap (neu co) de khong bi mat
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    duLieuTicketDangSua.ghiChu = oGhiChu.value.trim();
  }

  luuDuLieuDangSua();
  dungDongHoXuLy();
  capNhatDongHo();
  capNhatNhanTrangThai();
  hienThongBao("Đã tạm dừng ticket " + maTicketDangSua + ". Tiến độ được giữ nguyên.");
}

// ---------- Hoan thanh xu ly ----------

function hoanThanhXuLy() {
  if (duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket " + maTicketDangSua + " đã được hoàn thành trước đó.");
    return;
  }

  // Dieu kien 1: checklist phai co it nhat mot buoc
  if (danhSachBuocChecklist.length === 0) {
    const oLoi = document.getElementById("loiChecklist");
    if (oLoi) {
      oLoi.textContent = "Checklist chưa có bước nào. Hãy thêm bước trước khi hoàn thành.";
      oLoi.hidden = false;
    }
    hienThongBao("Chưa thể hoàn thành: checklist đang trống.");
    return;
  }

  // Dieu kien 2: khong cho phep hoan thanh lai neu da hoan thanh
  // (daHoanThanh() duoc kiem tra o dau ham, nhung kiem tra lai de phong ngu
  //  truong hop trang thai thay doi giua khi nguoi dung giu nut bam)
  if (daHoanThanh()) {
    hienThongBao("Ticket " + maTicketDangSua + " đã được hoàn thành trước đó.");
    return;
  }

  // Dieu kien 2: tat ca cac buoc phai duoc danh dau da xong
  let soChuaXong = 0;
  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].xong === false) {
      soChuaXong = soChuaXong + 1;
    }
  }

  if (soChuaXong > 0) {
    const oLoi = document.getElementById("loiChecklist");
    if (oLoi) {
      oLoi.textContent = "Còn " + soChuaXong + "/" + danhSachBuocChecklist.length +
        " bước chưa hoàn thành. Hãy làm xong hết checklist trước khi bấm Hoàn thành.";
      oLoi.hidden = false;
    }
    hienThongBao("Chưa thể hoàn thành: còn " + soChuaXong + " bước chưa xong.");
    return;
  }

  const oGhiChu = document.getElementById("ghiChuSuaChua");
  const ghiChuHienTai = oGhiChu ? oGhiChu.value.trim() : (duLieuTicketDangSua.ghiChu || "");

  const dongY = window.confirm(
    "Hoàn thành ticket " + maTicketDangSua + "?\n" +
    "Thời gian xử lý: " + dinhDangDongHo(layGiayDaXuLy()) + "\n" +
    "Sau khi hoàn thành, ticket sẽ được ghi vào Lịch sử sửa chữa."
  );
  if (!dongY) return;

  // Chot so lieu truoc khi doi trang thai
  duLieuTicketDangSua.giayDaXuLy = layGiayDaXuLy();
  duLieuTicketDangSua.thoiGianXuLy = tinhSoGioXuLy();
  duLieuTicketDangSua.ghiChu = ghiChuHienTai;
  duLieuTicketDangSua.thoiDiemHoanThanh = new Date().toLocaleString("vi-VN");
  duLieuTicketDangSua.trangThai = "Hoàn thành";
  duLieuTicketDangSua.statusCode = "completed";
  duLieuTicketDangSua.batDau = 0;

  luuDuLieuDangSua();
  dungDongHoXuLy();
  capNhatDongHo();
  capNhatNhanTrangThai();
  // Ve lai checklist de checkbox va bieu tuong sua-xoa bi khoa ngay, khong doi tai trang
  hienThiChecklistXuLy();
  capNhatTrangThaiGhiChu("Đã chốt ghi chú khi hoàn thành");
  hienThongBao("Đã hoàn thành ticket " + maTicketDangSua + ". Đang mở Lịch sử sửa chữa…");

  // Cho nguoi dung kip doc thong bao roi moi chuyen trang
  setTimeout(function () {
    window.location.href = "history.html";
  }, 900);
}

function khoiTaoDangSua() {
  // Ưu tiên mã trên URL, sau đó mới dùng ticket đã lưu từ trang Hàng đợi.
  const maTrenUrl = new URLSearchParams(window.location.search).get("ticket");
  const ticketDaLuu = docTicketDangXuLy();
  const maDuocChon = maTrenUrl || (ticketDaLuu ? ticketDaLuu.ma : "TK-2025-001");
  const ticketDangXuLy = layTicketTheoMa(maDuocChon);

  if (ticketDangXuLy === null) {
    maTicketDangSua = maDuocChon;
    const oTieuDe = document.getElementById("tieuDeDangSua");
    const oMoTa = document.getElementById("moTaSuCo");
    if (oTieuDe) oTieuDe.textContent = "Không tìm thấy ticket";
    if (oMoTa) oMoTa.textContent = "Mã ticket không hợp lệ hoặc ticket không còn tồn tại.";
    hienThongBao("Không tìm thấy ticket: " + maDuocChon);
    return;
  }

  maTicketDangSua = ticketDangXuLy.ma;
  capNhatThongTinDangSua(ticketDangXuLy);
  hienThongBao("Đang xử lý: " + ticketDangXuLy.ma + " · " + ticketDangXuLy.maThietBi);

  // Nap du lieu da luu cua ticket (checklist, ghi chu, trang thai, dong ho)
  duLieuTicketDangSua = docDuLieuTicket(maTicketDangSua);
  if (duLieuTicketDangSua === null) {
    duLieuTicketDangSua = taoDuLieuTicketMacDinh(ticketDangXuLy);
    luuDuLieuTicket(maTicketDangSua, duLieuTicketDangSua);
  }
  if (!duLieuTicketDangSua.statusCode) {
    duLieuTicketDangSua.statusCode = duLieuTicketDangSua.trangThai === "Hoàn thành" ? "completed" : "in_progress";
  }

  danhSachBuocChecklist = duLieuTicketDangSua.checklist;
  if (!Array.isArray(danhSachBuocChecklist)) {
    danhSachBuocChecklist = saoChepChecklist(CHECKLIST_MAC_DINH);
    duLieuTicketDangSua.checklist = danhSachBuocChecklist;
  }

  goiYAIHienTai = duLieuTicketDangSua.goiYAI || goiYBuocAI.slice();
  soLanTaoLai = duLieuTicketDangSua.soLanTaoLai || 0;

  // O ghi chu: nap noi dung da luu va bao "co thay doi chua luu" khi go
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    oGhiChu.value = duLieuTicketDangSua.ghiChu || "";
    oGhiChu.addEventListener("input", function () {
      capNhatTrangThaiGhiChu("Có thay đổi chưa lưu");
    });
  }

  // Vao trang Dang sua tuc la ticket da duoc nhan: bo trang thai "Chờ nhận" va luu lai
  if (!daHoanThanh()) {
    danhDauDaNhanTicket();
  }
  luuDuLieuDangSua();
  capNhatNhanTrangThai();
  hienThiChecklistXuLy();
  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();
  chayDongHoXuLy();

  if (duLieuTicketDangSua.ghiChu) {
    capNhatTrangThaiGhiChu("Đã lưu ghi chú");
  }

  // Gan su kien cho cac nut (dung ham dat ten de de doc va de go loi)
  document.getElementById("nutThemBuoc").addEventListener("click", themBuocMoi);
  document.getElementById("nutChapNhan").addEventListener("click", chapNhanGoiYAI);
  document.getElementById("nutTaoLai").addEventListener("click", taoLaiGoiYAI);
  document.getElementById("nutTuChoiChecklist").addEventListener("click", tuChoiGoiYAI);
  document.getElementById("nutSuaChecklist").addEventListener("click", suaGoiYAI);
  document.getElementById("nutDungThuCong").addEventListener("click", dungThuCong);
  document.getElementById("nutLuuGhiChu").addEventListener("click", luuGhiChu);
  document.getElementById("nutTamDung").addEventListener("click", tamDungXuLy);
  document.getElementById("nutHoanThanh").addEventListener("click", hoanThanhXuLy);
}


/* =========================================================
   TRANG 03 - LICH SU SUA CHUA
   ========================================================= */

function layLichSuDaLoc() {
  const oTuKhoa = document.getElementById("tuKhoaLichSu");
  const oDanhMuc = document.getElementById("locDanhMucLichSu");
  const oThoiGian = document.getElementById("locThoiGianLichSu");

  const tuKhoa = oTuKhoa.value.toLowerCase().trim();
  const danhMuc = oDanhMuc.value;
  const soNgay = parseInt(oThoiGian.value);

  const ketQua = [];
  for (let i = 0; i < danhSachLichSu.length; i++) {
    const dong = danhSachLichSu[i];
    const chuoiTim = (dong.ma + " " + dong.thietBi + " " + dong.danhMuc).toLowerCase();

    const khopTuKhoa = tuKhoa === "" || chuoiTim.indexOf(tuKhoa) !== -1;
    const khopDanhMuc = danhMuc === "" || dong.danhMuc === danhMuc;
    const khopThoiGian = isNaN(soNgay) || dong.ngayTruoc <= soNgay;

    if (khopTuKhoa && khopDanhMuc && khopThoiGian) {
      ketQua.push(dong);
    }
  }
  return ketQua;
}

function hienThiBangLichSu() {
  const oBang = document.getElementById("bangLichSu");
  if (!oBang) return;

  const danhSach = layLichSuDaLoc();
  oBang.innerHTML = "";

  for (let i = 0; i < danhSach.length; i++) {
    const dong = danhSach[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = dong.ma;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = dong.thietBi;

    const oDanhMuc = document.createElement("td");
    oDanhMuc.textContent = dong.danhMuc;

    const oThoiGian = document.createElement("td");
    oThoiGian.textContent = dong.thoiGian;

    const oDanhGia = document.createElement("td");
    oDanhGia.className = "diem-sao";
    if (dong.danhGia > 0) {
      oDanhGia.textContent = dong.danhGia + " ★";
    } else {
      // Ticket vua hoan thanh trong app thi chua duoc cham diem
      oDanhGia.textContent = "Chưa chấm";
      oDanhGia.classList.add("chua-cham");
    }

    const oKetQua = document.createElement("td");
    oKetQua.className = "ket-qua-dung";
    if (dong.ketQua === "Sớm hạn") {
      oKetQua.className = "ket-qua-som";
    }
    if (dong.ketQua === "Trễ hạn") {
      oKetQua.className = "ket-qua-tre";
    }
    oKetQua.textContent = dong.ketQua;

    const oXem = document.createElement("td");
    const oLienKet = document.createElement("span");
    oLienKet.className = "lien-ket-xem";
    oLienKet.textContent = "Xem";
    oLienKet.addEventListener("click", function () {
      moChiTietLichSu(dong);
    });
    oXem.appendChild(oLienKet);

    oDong.appendChild(oMa);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oDanhMuc);
    oDong.appendChild(oThoiGian);
    oDong.appendChild(oDanhGia);
    oDong.appendChild(oKetQua);
    oDong.appendChild(oXem);
    oBang.appendChild(oDong);
  }
}

function moChiTietLichSu(dong) {
  document.getElementById("lsMa").textContent = dong.ma;
  document.getElementById("lsThietBi").textContent = dong.thietBi;
  document.getElementById("lsDanhMuc").textContent = dong.danhMuc;
  document.getElementById("lsThoiGian").textContent = dong.thoiGian;
  if (dong.danhGia > 0) {
    document.getElementById("lsDanhGia").textContent = dong.danhGia + " ★";
  } else {
    document.getElementById("lsDanhGia").textContent = "Chưa chấm điểm";
  }
  document.getElementById("lsKetQua").textContent = dong.ketQua;

  const oGhiChuChiTiet = document.getElementById("lsGhiChu");
  if (oGhiChuChiTiet) {
    if (dong.ghiChu) {
      oGhiChuChiTiet.textContent = dong.ghiChu;
    } else {
      oGhiChuChiTiet.textContent = "Không có ghi chú";
    }
  }

  document.getElementById("nenMoLichSu").classList.add("hien");
}

function dongHopThoaiLichSu() {
  const oNenMo = document.getElementById("nenMoLichSu");
  if (!oNenMo) return;
  oNenMo.classList.remove("hien");
}

// Boc mot o CSV: luon dat trong ngoac kep va nhan doi dau ngoac kep ben trong
// de ghi chu co dau phay van khong lam lech cot khi mo bang Excel
function bocCSV(giaTri) {
  const chuoi = giaTri === null || giaTri === undefined ? "" : String(giaTri);
  return '"' + chuoi.replace(/"/g, '""') + '"';
}

function xuatCSV() {
  const danhSach = layLichSuDaLoc();

  const dong = ["Ma ticket,Thiet bi,Danh muc,Thoi gian,Danh gia,Ket qua,Ghi chu"];
  for (let i = 0; i < danhSach.length; i++) {
    const d = danhSach[i];
    const danhGia = d.danhGia > 0 ? d.danhGia : "Chua cham";
    dong.push(bocCSV(d.ma) + "," + bocCSV(d.thietBi) + "," + bocCSV(d.danhMuc) + "," +
      bocCSV(d.thoiGian) + "," + bocCSV(danhGia) + "," + bocCSV(d.ketQua) + "," +
      bocCSV(d.ghiChu || ""));
  }

  // Ky tu \uFEFF giup Excel hien thi dung tieng Viet co dau
  const noiDung = "\uFEFF" + dong.join("\n");
  const tep = new Blob([noiDung], { type: "text/csv;charset=utf-8;" });
  const duongDan = URL.createObjectURL(tep);

  const lienKet = document.createElement("a");
  lienKet.href = duongDan;
  lienKet.download = "lich-su-sua-chua.csv";
  document.body.appendChild(lienKet);
  lienKet.click();
  lienKet.remove();
  URL.revokeObjectURL(duongDan);

  hienThongBao("Đã xuất file lịch sử sửa chữa dạng CSV.");
}

function khoiTaoLichSu() {
  hienThiBangLichSu();

  document.getElementById("tuKhoaLichSu").addEventListener("input", hienThiBangLichSu);
  document.getElementById("locDanhMucLichSu").addEventListener("change", hienThiBangLichSu);
  document.getElementById("locThoiGianLichSu").addEventListener("change", hienThiBangLichSu);

  document.getElementById("nutDatLaiLichSu").addEventListener("click", function () {
    document.getElementById("tuKhoaLichSu").value = "";
    document.getElementById("locDanhMucLichSu").value = "";
    document.getElementById("locThoiGianLichSu").value = "";
    hienThiBangLichSu();
    hienThongBao("Đã đặt lại bộ lọc lịch sử.");
  });

  document.getElementById("nutXuatCSV").addEventListener("click", xuatCSV);

  document.getElementById("nutDongLichSu").addEventListener("click", dongHopThoaiLichSu);
  document.getElementById("nutDongLichSuDuoi").addEventListener("click", dongHopThoaiLichSu);
  document.getElementById("nenMoLichSu").addEventListener("click", function (suKien) {
    if (suKien.target.id === "nenMoLichSu") {
      dongHopThoaiLichSu();
    }
  });
}


/* =========================================================
   TRANG 04 - QUAN LY CHECKLIST
   ========================================================= */

function hienThiDanhSachMau() {
  const oKhung = document.getElementById("danhSachMau");
  const oTuKhoa = document.getElementById("tuKhoaMau");
  const tuKhoa = oTuKhoa.value.toLowerCase().trim();

  const cacNhom = [];
  for (let i = 0; i < danhSachMauChecklist.length; i++) {
    const nhom = danhSachMauChecklist[i].nhom;
    if (cacNhom.indexOf(nhom) === -1) {
      cacNhom.push(nhom);
    }
  }

  oKhung.innerHTML = "";

  for (let n = 0; n < cacNhom.length; n++) {
    const nhom = cacNhom[n];
    const cacMau = [];
    for (let i = 0; i < danhSachMauChecklist.length; i++) {
      const mau = danhSachMauChecklist[i];
      const khopNhom = mau.nhom === nhom;
      const khopTuKhoa = tuKhoa === "" || mau.ten.toLowerCase().indexOf(tuKhoa) !== -1;
      if (khopNhom && khopTuKhoa) {
        cacMau.push(mau);
      }
    }
    if (cacMau.length === 0) continue;

    const oNhom = document.createElement("div");
    oNhom.className = "nhom-mau";

    const oTenNhom = document.createElement("div");
    oTenNhom.className = "ten-nhom-mau";
    oTenNhom.innerHTML = "<span>" + nhom + "</span><span>" + cacMau.length + " mẫu</span>";
    oNhom.appendChild(oTenNhom);

    for (let i = 0; i < cacMau.length; i++) {
      const mau = cacMau[i];
      const viTri = danhSachMauChecklist.indexOf(mau);

      const oMuc = document.createElement("div");
      oMuc.className = "muc-mau";
      if (viTri === viTriMauDangChon) {
        oMuc.classList.add("dang-chon");
      }

      oMuc.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2.5"/></svg>' +
        "<span>" + mau.ten + "</span>";

      oMuc.addEventListener("click", function () {
        chonMauChecklist(viTri);
      });

      oNhom.appendChild(oMuc);
    }

    oKhung.appendChild(oNhom);
  }
}

function hienThiBuocTemplate() {
  const oDanhSach = document.getElementById("danhSachBuocTemplate");
  const mau = danhSachMauChecklist[viTriMauDangChon];
  if (!mau || !oDanhSach) return;

  oDanhSach.innerHTML = "";
  for (let i = 0; i < mau.buoc.length; i++) {
    const oDong = document.createElement("li");
    oDong.className = "dong-template";

    const oKeo = document.createElement("span");
    oKeo.className = "dau-keo";
    oKeo.textContent = "⋮⋮";

    const oSo = document.createElement("span");
    oSo.className = "so-buoc";
    oSo.textContent = (i + 1);

    const oTen = document.createElement("span");
    oTen.className = "ten-buoc";
    oTen.textContent = mau.buoc[i];

    const oXoa = document.createElement("button");
    oXoa.className = "nut-nho-bieu-tuong";
    oXoa.title = "Xóa bước";
    oXoa.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
    oXoa.addEventListener("click", function () {
      mau.buoc.splice(i, 1);
      hienThiBuocTemplate();
      hienThongBao("Đã xóa một bước khỏi template.");
    });

    oDong.appendChild(oKeo);
    oDong.appendChild(oSo);
    oDong.appendChild(oTen);
    oDong.appendChild(oXoa);
    oDanhSach.appendChild(oDong);
  }
}

function chonMauChecklist(viTri) {
  viTriMauDangChon = viTri;
  document.getElementById("tenTemplate").value = danhSachMauChecklist[viTri].ten;
  hienThiDanhSachMau();
  hienThiBuocTemplate();
}

function taoChecklistBangAI() {
  const loai = document.getElementById("loaiThietBi").value;
  const trieuChung = document.getElementById("trieuChung").value.trim();

  if (trieuChung === "") {
    hienThongBao("Vui lòng nhập triệu chứng của thiết bị.");
    return;
  }

  const buocGoiY = goiYBuocTheoLoai[loai];
  const buoc = [];
  for (let i = 0; i < buocGoiY.length; i++) {
    buoc.push(buocGoiY[i]);
  }

  danhSachMauChecklist.unshift({
    nhom: nhomTheoLoai[loai],
    ten: trieuChung,
    buoc: buoc
  });

  viTriMauDangChon = 0;
  document.getElementById("tenTemplate").value = trieuChung;
  hienThiDanhSachMau();
  hienThiBuocTemplate();

  document.getElementById("khungGoiY").innerHTML =
    '<p class="dong-ai">AI đề xuất ' + buoc.length + " bước</p>" +
    '<p class="ghi-chu">' + buoc.join(" → ") + "</p>";

  hienThongBao("Đã tạo checklist cho: " + trieuChung);
}

function khoiTaoChecklist() {
  hienThiDanhSachMau();
  hienThiBuocTemplate();

  document.getElementById("tuKhoaMau").addEventListener("input", hienThiDanhSachMau);

  document.getElementById("nutThemBuocTemplate").addEventListener("click", function () {
    const tenBuoc = window.prompt("Nhập tên bước kiểm tra:");
    if (tenBuoc === null || tenBuoc.trim() === "") return;
    danhSachMauChecklist[viTriMauDangChon].buoc.push(tenBuoc.trim());
    hienThiBuocTemplate();
    hienThongBao("Đã thêm bước vào template.");
  });

  document.getElementById("nutLuuTemplate").addEventListener("click", function () {
    const tenMoi = document.getElementById("tenTemplate").value.trim();
    if (tenMoi === "") {
      hienThongBao("Tên template không được để trống.");
      return;
    }
    danhSachMauChecklist[viTriMauDangChon].ten = tenMoi;
    hienThiDanhSachMau();
    hienThongBao("Đã lưu thay đổi template.");
  });

  document.getElementById("nutXoaTemplate").addEventListener("click", function () {
    const dongY = window.confirm("Bạn có chắc muốn xóa template này?");
    if (!dongY) return;

    danhSachMauChecklist.splice(viTriMauDangChon, 1);
    if (viTriMauDangChon >= danhSachMauChecklist.length) {
      viTriMauDangChon = 0;
    }

    if (danhSachMauChecklist.length === 0) {
      document.getElementById("tenTemplate").value = "";
      document.getElementById("danhSachBuocTemplate").innerHTML = "";
    } else {
      document.getElementById("tenTemplate").value = danhSachMauChecklist[viTriMauDangChon].ten;
      hienThiBuocTemplate();
    }
    hienThiDanhSachMau();
    hienThongBao("Đã xóa template.");
  });

  document.getElementById("nutTaoChecklistAI").addEventListener("click", taoChecklistBangAI);

  document.getElementById("nutDongAI").addEventListener("click", function () {
    document.getElementById("khungTaoAI").style.display = "none";
    hienThongBao("Đã đóng khung tạo checklist AI.");
  });

  document.getElementById("nutMoTaoAI").addEventListener("click", function () {
    document.getElementById("khungTaoAI").style.display = "block";
  });
}


/* =========================================================
   TRANG 05 - THONG KE HIEU SUAT
   ========================================================= */

function hienThiBieuDo12Tuan(xuHuong) {
  const oBieuDo = document.getElementById("bieuDo12Tuan");
  oBieuDo.innerHTML = "";

  let giaTriLonNhat = 0;
  for (let i = 0; i < xuHuong.length; i++) {
    if (xuHuong[i] > giaTriLonNhat) {
      giaTriLonNhat = xuHuong[i];
    }
  }

  for (let i = 0; i < xuHuong.length; i++) {
    const oNhom = document.createElement("div");
    oNhom.className = "cot-nhom";

    const oCot = document.createElement("div");
    oCot.className = "cot";
    if (i === xuHuong.length - 1) {
      oCot.classList.add("hien-tai");
    }
    oCot.style.height = Math.round((xuHuong[i] / giaTriLonNhat) * 130) + "px";

    const oNhan = document.createElement("span");
    oNhan.className = "nhan-cot";
    oNhan.textContent = "T" + (i + 1);

    oNhom.appendChild(oCot);
    oNhom.appendChild(oNhan);
    oBieuDo.appendChild(oNhom);
  }
}

function hienThiLoiThuongGap() {
  const oKhung = document.getElementById("danhSachLoi");
  oKhung.innerHTML = "";

  for (let i = 0; i < loiThuongGap.length; i++) {
    const loi = loiThuongGap[i];

    const oDong = document.createElement("div");
    oDong.className = "dong-loi";

    const oTen = document.createElement("div");
    oTen.className = "ten-loi";
    oTen.innerHTML = "<span>" + loi.ten + "</span><span>" + loi.tyLe + "%</span>";

    const oThanh = document.createElement("div");
    oThanh.className = "thanh-tien-do";
    oThanh.innerHTML = '<span style="width: ' + loi.tyLe + '%"></span>';

    oDong.appendChild(oTen);
    oDong.appendChild(oThanh);
    oKhung.appendChild(oDong);
  }
}

function hienThiBangDanhGia() {
  const oBang = document.getElementById("bangDanhGia");
  oBang.innerHTML = "";

  for (let i = 0; i < danhGiaGanDay.length; i++) {
    const d = danhGiaGanDay[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = d.ma;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = d.thietBi;

    const oDiem = document.createElement("td");
    oDiem.className = "diem-sao";
    oDiem.textContent = d.diem;

    const oNhanXet = document.createElement("td");
    oNhanXet.textContent = d.nhanXet;

    oDong.appendChild(oMa);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oDiem);
    oDong.appendChild(oNhanXet);
    oBang.appendChild(oDong);
  }
}

function chonKyThongKe(tenKy) {
  const duLieu = duLieuThongKe[tenKy];
  if (!duLieu) return;

  document.getElementById("soHoanThanhTK").textContent = duLieu.hoanThanh;
  document.getElementById("thayDoiHoanThanh").textContent = duLieu.thayDoiHoanThanh;
  document.getElementById("soThoiGianTBTK").textContent = duLieu.thoiGianTB;
  document.getElementById("thayDoiThoiGian").textContent = duLieu.thayDoiThoiGian;
  document.getElementById("soDanhGiaTK").textContent = duLieu.danhGia;
  document.getElementById("soSLATK").textContent = duLieu.dungSLA;

  const cacNut = document.querySelectorAll(".nut-che-do[data-ky]");
  for (let i = 0; i < cacNut.length; i++) {
    if (cacNut[i].getAttribute("data-ky") === tenKy) {
      cacNut[i].classList.add("dang-chon");
    } else {
      cacNut[i].classList.remove("dang-chon");
    }
  }

  hienThiBieuDo12Tuan(duLieu.xuHuong);
}

function khoiTaoThongKe() {
  chonKyThongKe("Tháng này");
  hienThiLoiThuongGap();
  hienThiBangDanhGia();

  const cacNut = document.querySelectorAll(".nut-che-do[data-ky]");
  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].addEventListener("click", function () {
      chonKyThongKe(cacNut[i].getAttribute("data-ky"));
    });
  }
}


// ---------- KHOI TAO (PHAI NAM O DONG CUOI CUNG CUA FILE) ----------
khoiTaoTrang();