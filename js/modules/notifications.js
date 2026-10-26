/* =========================================================
   notifications.js - Trang Thông báo
   Danh sách thông báo chưa đọc/đã đọc, lọc theo nhóm,
   xem chi tiết và nút đánh dấu tất cả đã đọc.
   ========================================================= */

import { layDanhSachThongBao, layDanhSachTicket, timTicketTheoMa, danhDauTatCaDaDoc } from "../api.js";
import { anToan, dinhDangNgayGio, thoiGianTuongDoi } from "./utils.js";
import { capNhatSoThongBao } from "./layout.js";

let tabDangChon = "tat-ca";
let thongBaoDangChon = null; // đối tượng thông báo đang xem bên cột phải

// Biểu tượng SVG theo nhóm thông báo
const BIEU_TUONG_LOAI = {
  ticket: '<svg class="bieu-tuong" viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v2M14 11v2M14 16v2"/></svg>',
  sla: '<svg class="bieu-tuong" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6"/></svg>',
  "he-thong": '<svg class="bieu-tuong" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>'
};

const DANH_SACH_TAB = [
  { id: "tat-ca", ten: "Tất cả" },
  { id: "chua-doc", ten: "Chưa đọc" },
  { id: "ticket", ten: "Ticket" },
  { id: "sla", ten: "SLA" },
  { id: "he-thong", ten: "Hệ thống" }
];

export function khoiTaoTrangThongBao() {
  const nutDaDoc = document.getElementById("nut-danh-dau-da-doc");
  if (nutDaDoc) {
    nutDaDoc.addEventListener("click", function () {
      danhDauTatCaDaDoc();
      capNhatSoThongBao();
      hienThiDanhSach();
      hienThiChiTiet();
    });
  }

  const cacTab = document.querySelectorAll("#danh-sach-tab-thong-bao .tab");
  for (const tab of cacTab) {
    tab.addEventListener("click", function () {
      tabDangChon = tab.getAttribute("data-nhom");
      for (const tabKhac of cacTab) tabKhac.classList.remove("dang-chon");
      tab.classList.add("dang-chon");
      hienThiDanhSach();
    });
  }

  hienThiDanhSach();
  hienThiChiTiet();
}

function layDanhSachTheoTab() {
  const danhSach = layDanhSachThongBao();
  if (tabDangChon === "chua-doc") return danhSach.filter(function (tb) { return !tb.daDoc; });
  if (tabDangChon === "he-thong") return danhSach.filter(function (tb) { return tb.loai === "he-thong"; });
  if (tabDangChon === "ticket" || tabDangChon === "sla") {
    return danhSach.filter(function (tb) { return tb.loai === tabDangChon; });
  }
  return danhSach;
}

function hienThiDanhSach() {
  // Cập nhật số chưa đọc trên nhãn tab
  const soChuaDoc = layDanhSachThongBao().filter(function (tb) { return !tb.daDoc; }).length;
  const nhanChuaDoc = document.getElementById("so-chua-doc-tab");
  if (nhanChuaDoc) nhanChuaDoc.textContent = "(" + soChuaDoc + ")";

  const khung = document.getElementById("danh-sach-thong-bao-trang");
  const danhSach = layDanhSachTheoTab();

  if (danhSach.length === 0) {
    khung.innerHTML = '<p class="thong-bao-trang">Không có thông báo nào trong nhóm này.</p>';
    return;
  }

  khung.innerHTML = danhSach.map(function (tb, viTri) {
    const bieuTuong = BIEU_TUONG_LOAI[tb.loai] || BIEU_TUONG_LOAI.ticket;
    return '<button class="dong-thong-bao' + (tb.daDoc ? "" : " chua-doc") +
      (thongBaoDangChon && thongBaoDangChon.noiDung === tb.noiDung && thongBaoDangChon.thoiGian === tb.thoiGian ? " dang-xem" : "") +
      '" data-vi-tri="' + viTri + '">' +
      '<span class="o-bieu-tuong xanh">' + bieuTuong + "</span>" +
      "<span>" + anToan(tb.noiDung) +
      '<span class="phu-thong-bao">' + anToan(thoiGianTuongDoi(tb.thoiGian)) + " · Xem chi tiết</span></span>" +
      "</button>";
  }).join("");

  const cacDong = khung.querySelectorAll(".dong-thong-bao");
  for (const dong of cacDong) {
    dong.addEventListener("click", function () {
      thongBaoDangChon = layDanhSachTheoTab()[Number(dong.getAttribute("data-vi-tri"))];
      hienThiDanhSach();
      hienThiChiTiet();
    });
  }
}

// Cột phải: nội dung chi tiết của thông báo đang chọn, mặc định hiện trạng thái trống
function hienThiChiTiet() {
  const khung = document.getElementById("khung-chi-tiet-thong-bao");
  if (!khung) return;

  if (!thongBaoDangChon) {
    khung.innerHTML =
      '<div class="o-bieu-tuong xam" style="margin-bottom:12px">' +
      '<svg class="bieu-tuong" viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/><path d="M3 3l18 18"/></svg></div>' +
      "<p>Không có thông báo mới</p>";
    return;
  }

  const ticket = thongBaoDangChon.maTicket ? timTicketTheoMa(thongBaoDangChon.maTicket) : null;
  let lienKetHTML = "";
  if (ticket) {
    lienKetHTML = '<a class="nut nut-chinh nut-nho" style="margin-top:14px" href="chi-tiet-ticket.html?id=' +
      encodeURIComponent(ticket.id) + '">Mở ticket ' + anToan(ticket.id) + "</a>";
  }

  khung.innerHTML =
    '<h2 class="tieu-de-the">' + anToan(thongBaoDangChon.noiDung) + "</h2>" +
    '<p class="chu-thich">' + anToan(dinhDangNgayGio(thongBaoDangChon.thoiGian)) +
    (thongBaoDangChon.daDoc ? " · Đã đọc" : " · Chưa đọc") + "</p>" +
    (ticket
      ? '<p style="margin-top:10px">' + anToan(ticket.tieuDe) + " · " + anToan(ticket.trangThai) + "</p>"
      : '<p class="chu-thich" style="margin-top:10px">Thông báo hệ thống, không gắn với ticket cụ thể.</p>') +
    lienKetHTML;
}
