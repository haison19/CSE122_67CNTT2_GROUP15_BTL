/* =========================================================
   UTILS.JS - CAC HAM DUNG CHUNG CHO MOI TRANG
   - hienThongBao: hop thong bao nho o goc man hinh
   - layLopMucDo / layChuCaiDau: chuyen du lieu thanh chu hien thi
   - xuLyMenu / dongThanhBen: menu trai va thanh ben tren dien thoai
   - hienThiThongTinNguoiDung: ten + chu cai dau cua ky thuat vien o thanh tren
   ========================================================= */

import { tenKyThuatVien, tenVaiTro, layViecHomNay } from "../api.js";

let thoiGianAnThongBao = 0;

// Hien mot dong thong bao ngan o goc man hinh roi tu an sau 2,6 giay
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

// Doi muc do uu tien (chu) thanh ten lop CSS de to mau cho dung
function layLopMucDo(mucDo) {
  if (mucDo === "Khẩn") return "muc-khan";
  if (mucDo === "Cao") return "muc-cao";
  if (mucDo === "Trung bình") return "muc-trung-binh";
  return "muc-thap";
}

// Lay 2 chu cai dau cua ten (vi du: "Bùi Huy Quân" -> "BQ")
function layChuCaiDau(ten) {
  const cacTu = ten.split(" ");
  const tuDau = cacTu[0];
  const tuCuoi = cacTu[cacTu.length - 1];
  return (tuDau.charAt(0) + tuCuoi.charAt(0)).toUpperCase();
}

// Muc menu chua co trang rieng (vi du "Tro giup 24/7") thi chi hien thong bao
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

// Ten va chu cai dai dien cua ky thuat vien o goc thanh tren
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

// Su kien co tren MOI trang: menu trai, thanh ben dien thoai, nut thong bao
function ganSuKienChung() {
  // Chi gan cho muc co thuoc tinh data-trang (nut Tro giup 24/7)
  const danhSachMenu = document.querySelectorAll(".muc-menu[data-trang]");
  for (let i = 0; i < danhSachMenu.length; i++) {
    danhSachMenu[i].addEventListener("click", function () {
      xuLyMenu(this);
    });
  }

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

export {
  hienThongBao,
  layLopMucDo,
  layChuCaiDau,
  xuLyMenu,
  dongThanhBen,
  hienThiThongTinNguoiDung,
  ganSuKienChung
};
