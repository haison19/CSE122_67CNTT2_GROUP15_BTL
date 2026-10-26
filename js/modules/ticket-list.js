/* =========================================================
   ticket-list.js - Trang Ticket của tôi
   Tìm kiếm + 3 bộ lọc + tab nhóm trạng thái + phân trang.
   ========================================================= */

import { layDanhSachTicket } from "../api.js";
import {
  SO_DONG_MOI_TRANG, NHOM_DANG_XU_LY, anToan,
  dinhDangSLA, nhanMucDo, nhanTrangThai
} from "./utils.js";
import { locTheoTuKhoa } from "./search.js";
import { ganAnClickVaoDongBang } from "./dashboard.js";

let trangHienTai = 1;
let nhomDangChon = "tat-ca";

export function khoiTaoTrangDanhSach() {
  // Nhận từ khóa từ thanh tìm kiếm tổng thể (?tim=...) chuyển sang
  const thamSo = new URLSearchParams(window.location.search);
  const tuKhoaURL = thamSo.get("tim");
  const oTim = document.getElementById("tim-kiem-danh-sach");
  if (tuKhoaURL && oTim) oTim.value = tuKhoaURL;

  if (oTim) {
    oTim.addEventListener("input", function () {
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

// Lọc theo ô tìm kiếm, trạng thái, mức độ và thời gian tạo
function locDanhSachTheoBoLoc() {
  const danhSach = layDanhSachTicket();
  const oTim = document.getElementById("tim-kiem-danh-sach");
  const tuKhoa = oTim ? oTim.value : "";
  const trangThai = document.getElementById("loc-trang-thai").value;
  const mucDo = document.getElementById("loc-muc-do").value;
  const thoiGian = document.getElementById("loc-thoi-gian").value;
  const bayGio = Date.now();

  return locTheoTuKhoa(danhSach, tuKhoa).filter(function (ticket) {
    if (trangThai !== "tat-ca" && ticket.trangThai !== trangThai) return false;
    if (mucDo !== "tat-ca" && ticket.mucDo !== mucDo) return false;

    const soGioTruoc = (bayGio - new Date(ticket.ngayTao).getTime()) / 3600000;
    if (thoiGian === "hom-nay" && soGioTruoc > 24) return false;
    if (thoiGian === "7-ngay" && soGioTruoc > 24 * 7) return false;
    if (thoiGian === "30-ngay" && soGioTruoc > 24 * 30) return false;

    return true;
  });
}

// Lọc thêm theo tab đang chọn (Đang xử lý / Hoàn thành)
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

  // Số đếm trên 3 tab tính theo danh sách ĐÃ lọc bộ lọc nhưng CHƯA lọc theo tab
  const soDangXuLy = daLoc.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); }).length;
  const soHoanThanh = daLoc.filter(function (t) { return t.trangThai === "Hoàn thành"; }).length;
  document.getElementById("so-tat-ca").textContent = daLoc.length;
  document.getElementById("so-dang-xu-ly-tab").textContent = soDangXuLy;
  document.getElementById("so-hoan-thanh-tab").textContent = soHoanThanh;

  const tbody = document.getElementById("bang-ticket");
  if (ketQua.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="thong-bao-trang">Không tìm thấy ticket phù hợp.</td></tr>';
    document.getElementById("phan-trang").innerHTML = "";
    document.getElementById("thong-tin-trang").textContent = "0 / 0 ticket";
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

  ganAnClickVaoDongBang(tbody);

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
