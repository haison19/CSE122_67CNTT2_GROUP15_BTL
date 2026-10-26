/* =========================================================
   dashboard.js - Trang Tổng quan
   Hiển thị 4 thẻ thống kê, bảng Ticket gần đây và Tiến độ ticket.
   ========================================================= */

import { layDanhSachTicket, layHoSo } from "../api.js";
import {
  NHOM_DANG_XU_LY, anToan, dinhDangSLA, laySoGioSLA,
  tinhSoGioConLai, nhanMucDo, nhanTrangThai
} from "./utils.js";
import { locTheoTuKhoa } from "./search.js";

function layLoiChao() {
  const gio = new Date().getHours();
  if (gio < 12) return "Chào buổi sáng";
  if (gio < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function khoiTaoTrangTongQuan() {
  hienThiTongQuan();

  // Ở trang Tổng quan, gõ vào ô tìm kiếm trên đầu trang sẽ lọc ngay bảng Ticket gần đây
  const oTim = document.getElementById("tim-kiem-toan-bo");
  if (oTim) {
    oTim.addEventListener("input", function () {
      hienThiTicketGanDay(layDanhSachTicket(), oTim.value);
    });
  }
}

export function hienThiTongQuan() {
  const danhSach = layDanhSachTicket();
  // Đếm số ticket theo từng nhóm trạng thái để điền vào 4 thẻ thống kê
  const soDangXuLy = danhSach.filter(function (t) { return NHOM_DANG_XU_LY.includes(t.trangThai); }).length;
  const soHoanThanh = danhSach.filter(function (t) { return t.trangThai === "Hoàn thành"; }).length;
  const soCanBoSung = danhSach.filter(function (t) { return t.trangThai === "Chờ bổ sung"; }).length;

  document.getElementById("tong-ticket").textContent = danhSach.length;
  document.getElementById("so-dang-xu-ly").textContent = soDangXuLy;
  document.getElementById("so-hoan-thanh").textContent = soHoanThanh;
  document.getElementById("so-can-bo-sung").textContent = soCanBoSung;

  const loiChao = document.getElementById("loi-chao");
  if (loiChao) loiChao.textContent = layLoiChao() + ", " + layHoSo().ten + "!";

  hienThiTicketGanDay(danhSach);
  hienThiTienDo(danhSach);
}

// Bảng 5 ticket cập nhật gần nhất, có lọc theo từ khóa nếu người dùng đang gõ
export function hienThiTicketGanDay(danhSach, tuKhoa) {
  const tbody = document.getElementById("bang-ticket-gan-day");
  if (!tbody) return;

  const daLoc = locTheoTuKhoa(danhSach, tuKhoa);
  const moiNhat = daLoc.slice().sort(function (a, b) {
    return new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime();
  }).slice(0, 5);

  if (moiNhat.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="thong-bao-trang">' +
      ((tuKhoa || "").trim() ? "Không tìm thấy ticket phù hợp với từ khóa." : "Chưa có ticket nào. Hãy tạo ticket đầu tiên.") +
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

  ganAnClickVaoDongBang(tbody);
}

// Bấm vào một dòng bảng thì mở trang chi tiết ticket tương ứng
export function ganAnClickVaoDongBang(tbody) {
  const cacDong = tbody.querySelectorAll("tr[data-ma]");
  for (const dong of cacDong) {
    dong.addEventListener("click", function () {
      window.location.href = "chi-tiet-ticket.html?id=" + encodeURIComponent(dong.getAttribute("data-ma"));
    });
  }
}

// Cột phải: 3 ticket đang xử lý gấp nhất (còn ít thời gian nhất) với thanh tiến độ
export function hienThiTienDo(danhSach) {
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
    // % đã trôi qua so với tổng thời gian SLA, kẹp trong khoảng 0..100
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
