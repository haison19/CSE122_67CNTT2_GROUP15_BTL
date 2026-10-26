/* =========================================================
   DASHBOARD.JS - TRANG TONG QUAN (index.html)
   Danh sach viec hom nay, tim kiem, hop thoai chi tiet, trang thai
   lam viec, cac con so thong ke va bieu do 8 tuan.
   ========================================================= */

import {
  danhSachTicket,
  duLieuHieuSuat,
  tiLeDungSLA,
  tenKyThuatVien,
  layViecHomNay
} from "../api.js";
import { hienThongBao, layLopMucDo } from "./utils.js";

let trangThaiLamViec = "Rảnh";

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
// Khoi tao trang Tong quan: do du lieu ra giao dien va gan su kien rieng cua trang
function khoiTaoTongQuan() {
  document.getElementById("loiChao").textContent =
    "Chào " + tenKyThuatVien + ", sẵn sàng làm việc? 🔧";
  capNhatThongKe();
  hienThiDanhSach(layViecHomNay());
  hienThiBieuDo();

  // Ba nut chon trang thai lam viec (Ranh / Dang xu ly / Tam nghi)
  const danhSachNutTrangThai = document.querySelectorAll(".nut-trang-thai");
  for (let i = 0; i < danhSachNutTrangThai.length; i++) {
    danhSachNutTrangThai[i].addEventListener("click", function () {
      chonTrangThaiLamViec(this.getAttribute("data-trang-thai"), this);
    });
  }

  // Hop thoai chi tiet: dong bang nut X, nut duoi hoac bam ra nen mo
  document.getElementById("nutDongHopThoai").addEventListener("click", dongHopThoai);
  document.getElementById("nutDongDuoi").addEventListener("click", dongHopThoai);
  document.getElementById("nenMo").addEventListener("click", function (suKien) {
    if (suKien.target.id === "nenMo") {
      dongHopThoai();
    }
  });
}

export {
  hienThiDanhSach,
  locTicketTheoTuKhoa,
  dongHopThoai,
  chonTrangThaiLamViec,
  capNhatThongKe,
  hienThiBieuDo,
  khoiTaoTongQuan
};
