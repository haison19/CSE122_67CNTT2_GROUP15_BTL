/* =========================================================
   FixFlow - Trang Tổng quan
   File này chứa: dữ liệu mẫu, hàm hiển thị và xử lý tương tác
   ========================================================= */

// ---------- 1. Dữ liệu dùng chung ----------

// Tên kỹ thuật viên: để riêng một chỗ, muốn đổi tên chỉ cần sửa dòng này
const tenKyThuatVien = "Nguyễn Minh Anh";
const tenVaiTro = "Kỹ thuật viên";

// Trạng thái làm việc hiện tại (thay đổi khi bấm nút Rảnh / Bận / Không online)
let trangThaiLamViec = "Rảnh";

// Dữ liệu ticket mẫu.
// homNay = true  -> hiện trong mục "Việc hôm nay"
// homNay = false -> việc đã hoàn thành trong tuần, dùng để tính thống kê
const danhSachTicket = [
  // 4 việc của hôm nay
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

  // 8 việc đã hoàn thành trong tuần (dữ liệu mẫu để tính thống kê)
  {
    id: 5, gio: "08:30", tenSuCo: "Mất điện phòng máy",
    maThietBi: "EL-005", diaDiem: "Phòng máy chủ", mucDo: "Khẩn",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 1.5,
    moTa: "Đã kích hoạt máy phát dự phòng cho phòng máy chủ."
  },
  {
    id: 6, gio: "09:15", tenSuCo: "Mạng chập chờn",
    maThietBi: "SW-021", diaDiem: "Tầng 2", mucDo: "Cao",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 2,
    moTa: "Thay cáp mạng bị hỏng trên tủ switch tầng 2."
  },
  {
    id: 7, gio: "10:00", tenSuCo: "Máy tính không khởi động",
    maThietBi: "PC-114", diaDiem: "Phòng 105", mucDo: "Cao",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 2.5,
    moTa: "Thay nguồn máy tính bị hỏng."
  },
  {
    id: 8, gio: "13:00", tenSuCo: "Loa phòng họp rè",
    maThietBi: "SP-009", diaDiem: "Phòng họp", mucDo: "Trung bình",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 3,
    moTa: "Thay dây nối và chỉnh lại âm lượng loa phòng họp."
  },
  {
    id: 9, gio: "14:00", tenSuCo: "Camera mất hình",
    maThietBi: "CM-032", diaDiem: "Sảnh chính", mucDo: "Cao",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 2,
    moTa: "Cấp lại nguồn cho camera sảnh chính."
  },
  {
    id: 10, gio: "08:00", tenSuCo: "Hết mực máy in",
    maThietBi: "PR-018", diaDiem: "Phòng giáo vụ", mucDo: "Thấp",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 2.5,
    moTa: "Thay mực cho máy in phòng giáo vụ."
  },
  {
    id: 11, gio: "15:30", tenSuCo: "Máy lạnh rỉ nước",
    maThietBi: "AC-031", diaDiem: "Phòng 203", mucDo: "Trung bình",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 3.4,
    moTa: "Vệ sinh máng nước và ống thoát của máy lạnh."
  },
  {
    id: 12, gio: "16:00", tenSuCo: "Màn hình bị sọc",
    maThietBi: "MN-077", diaDiem: "Phòng 102", mucDo: "Trung bình",
    trangThai: "Hoàn thành", homNay: false, thoiGianXuLy: 2.4,
    moTa: "Thay cáp tín hiệu màn hình phòng 102."
  }
];

// Dữ liệu minh họa cho biểu đồ 8 tuần (chưa có dữ liệu lịch sử thực tế)
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

// Tỷ lệ đúng SLA (số liệu minh họa)
const tiLeDungSLA = 92;

// Bộ đếm thời gian ẩn hộp thông báo
let thoiGianAnThongBao = 0;


// ---------- 2. Các hàm dùng chung ----------


function hienThongBao(noiDung) {
  const oThongBao = document.getElementById("thongBao");
  oThongBao.textContent = noiDung;
  oThongBao.classList.add("hien");

  clearTimeout(thoiGianAnThongBao);
  thoiGianAnThongBao = setTimeout(function () {
    oThongBao.classList.remove("hien");
  }, 2600);
}

// Đổi tên mức độ ưu tiên 
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


// ---------- 3. Hiển thị danh sách ticket ----------


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

  // Bấm vào dòng ticket thì mở hộp thoại chi tiết
  phanTu.addEventListener("click", function () {
    moChiTiet(ticket);
  });

  return phanTu;
}


function hienThiDanhSach(danhSach) {
  const oDanhSach = document.getElementById("danhSachViec");
  const oThongDiep = document.getElementById("thongDiepTrong");

  oDanhSach.innerHTML = "";

  for (let i = 0; i < danhSach.length; i++) {
    const phanTu = taoMotDongTicket(danhSach[i]);
    oDanhSach.appendChild(phanTu);
  }

  // Nếu không có việc nào thì hiện câu thông báo
  if (danhSach.length === 0) {
    oThongDiep.hidden = false;
    oDanhSach.hidden = true;
  } else {
    oThongDiep.hidden = true;
    oDanhSach.hidden = false;
  }

  document.getElementById("soViecHomNay").textContent = danhSach.length + " ticket";
}


// ---------- 4. Tìm kiếm ----------

// Lọc danh sách việc theo từ khóa 
function locTicketTheoTuKhoa(tuKhoa) {
  const tuKhoaThuong = tuKhoa.toLowerCase().trim();
  const danhSachGoc = layViecHomNay();

  if (tuKhoaThuong === "") {
    return danhSachGoc;
  }

  const ketQua = [];
  for (let i = 0; i < danhSachGoc.length; i++) {
    const ticket = danhSachGoc[i];
    const noiDungTim =
      ticket.tenSuCo + " " + ticket.maThietBi + " " + ticket.diaDiem;

    if (noiDungTim.toLowerCase().indexOf(tuKhoaThuong) !== -1) {
      ketQua.push(ticket);
    }
  }
  return ketQua;
}

// Hàm chạy khi người dùng gõ vào ô tìm kiếm
function xuLyTimKiem() {
  const oTimKiem = document.getElementById("oTimKiem");
  const danhSachLoc = locTicketTheoTuKhoa(oTimKiem.value);
  hienThiDanhSach(danhSachLoc);
}


// ---------- 5. mở / đóng ----------

// Lưu ticket đang xem để đóng hộp thoại còn biết
let ticketDangXem = null;

function moChiTiet(ticket) {
  ticketDangXem = ticket;

  document.getElementById("ctGio").textContent = ticket.gio;
  document.getElementById("ctTenSuCo").textContent = ticket.tenSuCo;
  document.getElementById("ctThietBi").textContent = ticket.maThietBi;
  document.getElementById("ctDiaDiem").textContent = ticket.diaDiem;
  document.getElementById("ctMucDo").textContent = ticket.mucDo;
  document.getElementById("ctTrangThai").textContent = ticket.trangThai;
  document.getElementById("ctMoTa").textContent = ticket.moTa;

  document.getElementById("nenMo").classList.add("hien");
}

function dongHopThoai() {
  document.getElementById("nenMo").classList.remove("hien");
  ticketDangXem = null;
}

// ---------- . Trạng thái làm việc ----------

function chonTrangThaiLamViec(trangThai, nutDuocBam) {
  trangThaiLamViec = trangThai;

  // Bỏ lớp "dang-chon" của tất cả nút rồi thêm vào nút vừa bấm
  const danhSachNut = document.querySelectorAll(".nut-trang-thai");
  for (let i = 0; i < danhSachNut.length; i++) {
    danhSachNut[i].classList.remove("dang-chon");
  }
  nutDuocBam.classList.add("dang-chon");

  hienThongBao("Trạng thái đã đổi thành: " + trangThai);
}


// ---------- 6. Thống kê ----------


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

// Cập nhật 4 thẻ thống kê và dòng chào
function capNhatThongKe() {
  const soChoNhan = demTicketTheoTrangThai("Chờ nhận");
  const soDangXuLy = demTicketTheoTrangThai("Đang xử lý");
  const soHoanThanh = demTicketTheoTrangThai("Hoàn thành");
  const thoiGianTB = tinhThoiGianTrungBinh();

  document.getElementById("soChoNhan").textContent = soChoNhan;
  document.getElementById("soDangXuLy").textContent = soDangXuLy;
  document.getElementById("soHoanThanh").textContent = soHoanThanh;
  document.getElementById("soThoiGianTB").textContent = thoiGianTB.toFixed(1) + "h";

  // Số việc cần xử lý hôm nay = việc chưa hoàn thành
  const soViecUuTien = soChoNhan + soDangXuLy;
  document.getElementById("dongChao").textContent =
    "Bạn có " + soViecUuTien + " việc ưu tiên cần xử lý hôm nay.";
}


// ---------- 7. Biểu đồ 8 tuần ----------

function hienThiBieuDo() {
  const oBieuDo = document.getElementById("bieuDo");
  oBieuDo.innerHTML = "";

  // Tìm số lớn nhất để đổi thành chiều cao cột
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
    // Cột tuần hiện tại (T8) được tô xanh đậm
    if (i === duLieuHieuSuat.length - 1) {
      oCot.classList.add("hien-tai");
    }
    // Chiều cao tỉ lệ với số liệu, tối đa 130px
    oCot.style.height = Math.round((tuan.soHoanThanh / giaTriLonNhat) * 130) + "px";

    const oNhan = document.createElement("span");
    oNhan.className = "nhan-cot";
    oNhan.textContent = tuan.nhan;

    oNhom.appendChild(oCot);
    oNhom.appendChild(oNhan);
    oBieuDo.appendChild(oNhom);
  }

  // Hai nhãn số liệu phía dưới biểu đồ
  const tuanHienTai = duLieuHieuSuat[duLieuHieuSuat.length - 1];
  document.getElementById("nhanHoanThanh").textContent =
    "Hoàn thành " + tuanHienTai.soHoanThanh;
  document.getElementById("nhanSLA").textContent = "Đúng SLA " + tiLeDungSLA + "%";
}




// ---------- 9. Menu và các nút chưa phát triển ----------

function xuLyMenu(phanTuMenu) {
  const tenTrang = phanTuMenu.getAttribute("data-trang");

  if (tenTrang === "Tổng quan") {
    hienThongBao("Bạn đang ở trang Tổng quan.");
    return;
  }

  // Các trang còn lại sẽ phát triển sau nên chỉ hiện thông báo
  hienThongBao("Trang " + tenTrang + " sẽ được phát triển trong phiên bản sau.");
}

function dongThanhBen() {
  document.body.classList.remove("mo-thanh-ben");
}


// ---------- 10. Gắn sự kiện và khởi tạo ----------

function ganSuKien() {
  // Tìm kiếm
  const oTimKiem = document.getElementById("oTimKiem");
  oTimKiem.addEventListener("input", xuLyTimKiem);

  // 3 nút trạng thái làm việc
  const danhSachNutTrangThai = document.querySelectorAll(".nut-trang-thai");
  for (let i = 0; i < danhSachNutTrangThai.length; i++) {
    danhSachNutTrangThai[i].addEventListener("click", function () {
      chonTrangThaiLamViec(this.getAttribute("data-trang-thai"), this);
    });
  }

  // Menu sidebar
  const danhSachMenu = document.querySelectorAll(".muc-menu");
  for (let i = 0; i < danhSachMenu.length; i++) {
    danhSachMenu[i].addEventListener("click", function () {
      xuLyMenu(this);
    });
  }

  // Đóng hộp thoại chi tiết
  document.getElementById("nutDongHopThoai").addEventListener("click", dongHopThoai);
  document.getElementById("nutDongDuoi").addEventListener("click", dongHopThoai);

  // Bấm ra nền mờ cũng đóng hộp thoại
  document.getElementById("nenMo").addEventListener("click", function (suKien) {
    if (suKien.target.id === "nenMo") {
      dongHopThoai();
    }
  });

  // Bấm phím Esc để đóng hộp thoại hoặc sidebar
  document.addEventListener("keydown", function (suKien) {
    if (suKien.key === "Escape") {
      dongHopThoai();
      dongThanhBen();
    }
  });

  // Mở / đóng sidebar trên điện thoại
  document.getElementById("nutMenu").addEventListener("click", function () {
    document.body.classList.toggle("mo-thanh-ben");
  });
  document.getElementById("nenPhu").addEventListener("click", dongThanhBen);

  // Nút thông báo
  document.getElementById("nutThongBao").addEventListener("click", function () {
    const soViec = layViecHomNay().length;
    hienThongBao("Hôm nay bạn có " + soViec + " việc cần xử lý.");
  });
}

// Chạy khi trang vừa tải xong
function khoiTaoTrang() {
  document.getElementById("tenNguoiDung").textContent = tenKyThuatVien;
  document.getElementById("loiChao").textContent =
    "Chào " + tenKyThuatVien + ", sẵn sàng làm việc? 🔧";
 document.getElementById("dongTruong").textContent = tenVaiTro;
  capNhatThongKe();
  hienThiDanhSach(layViecHomNay());
  hienThiBieuDo();
  ganSuKien();
}

khoiTaoTrang();