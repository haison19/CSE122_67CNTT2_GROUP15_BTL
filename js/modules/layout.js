/* =========================================================
   layout.js - Phần khung chung của mọi trang
   Gồm: thanh bên, thanh trên, hộp thoại (modal), badge thông báo.
   ========================================================= */

import { layHoSo, laySoThongBaoChuaDoc, layDanhSachThongBao } from "../api.js";
import { anToan, dinhDangNgayGio } from "./utils.js";

/* ---------- Hộp thoại ---------- */

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

export function moHopThoai(noiDungHTML) {
  const lop = taoLopPhu();
  document.getElementById("hop-thoai").innerHTML = noiDungHTML;
  lop.classList.add("hien");
}

export function dongHopThoai() {
  const lop = document.getElementById("lop-phu");
  if (lop) lop.classList.remove("hien");
}

/* ---------- Badge số thông báo chưa đọc ---------- */

// Cập nhật mọi chỗ hiển thị số chưa đọc: chuông trên đầu trang và nhãn trong menu bên
export function capNhatSoThongBao() {
  const soChuaDoc = laySoThongBaoChuaDoc();
  const cacId = ["so-thong-bao", "so-thong-bao-dau"];
  for (const id of cacId) {
    const o = document.getElementById(id);
    if (!o) continue;
    o.textContent = soChuaDoc;
    o.classList.toggle("so-0", soChuaDoc === 0);
  }
}

/* ---------- Thanh bên ---------- */

// Các mục menu có data-chuc-nang mà chưa có trang riêng sẽ mở hộp thoại
function moTroGiup() {
  moHopThoai(
    '<h3 class="tieu-de-hop-thoai">Trợ giúp 24/7</h3>' +
    '<p>Đây là phân hệ mô phỏng chạy hoàn toàn trên trình duyệt, không có máy chủ.</p>' +
    '<ul>' +
    '<li>Tạo ticket: nhập thiết bị, vị trí, tiêu đề, mô tả rồi bấm <strong>Gửi &amp; Phân tích AI</strong>.</li>' +
    '<li>Dữ liệu được lưu trong localStorage của trình duyệt hiện tại.</li>' +
    '<li>Muốn dùng thử từ đầu, hãy mở trang <strong>Cài đặt</strong> và chọn đặt lại dữ liệu mẫu.</li>' +
    '</ul>' +
    '<button class="nut nut-chinh" id="nut-dong-tro-giup">Đóng</button>'
  );
  // Gắn sự kiện bằng addEventListener (không dùng onclick chuỗi) để an toàn khi chạy ES Module
  document.getElementById("nut-dong-tro-giup").addEventListener("click", dongHopThoai);
}

export function khoiTaoThanhBen() {
  const mucTroGiup = document.querySelector('[data-chuc-nang="tro-giup"]');
  if (mucTroGiup) {
    mucTroGiup.addEventListener("click", function (e) {
      e.preventDefault();
      moTroGiup();
      document.getElementById("thanh-ben").classList.remove("mo");
    });
  }
}

/* ---------- Thanh trên ---------- */

export function khoiTaoThanhTren() {
  const oTim = document.getElementById("tim-kiem-toan-bo");
  if (oTim) {
    // Gõ Enter ở bất kỳ trang nào: chuyển sang trang Ticket của tôi kèm từ khóa
    oTim.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const tuKhoa = oTim.value.trim();
        window.location.href = "ticket-cua-toi.html?tim=" + encodeURIComponent(tuKhoa);
      }
    });
  }

  const nutChuong = document.getElementById("nut-thong-bao");
  if (nutChuong) {
    nutChuong.addEventListener("click", function () {
      window.location.href = "thong-bao.html";
    });
  }

  const nutMenu = document.getElementById("nut-menu");
  if (nutMenu) {
    nutMenu.addEventListener("click", function () {
      document.getElementById("thanh-ben").classList.toggle("mo");
    });
  }

  capNhatTenTrenThanhTren();
  capNhatSoThongBao();
}

// Vẽ lại họ tên và ảnh đại diện ở thanh trên; trang Hồ sơ gọi lại sau mỗi lần lưu
export function capNhatTenTrenThanhTren() {
  const hoSo = layHoSo();
  const tenEl = document.getElementById("ten-nguoi-dung");
  if (tenEl) tenEl.textContent = hoSo.ten;
  const anhEl = document.getElementById("anh-dai-dien");
  if (anhEl) {
    if (hoSo.anhDaiDien) {
      // Người dùng đã tải ảnh đại diện trên trang Hồ sơ
      anhEl.innerHTML = '<img src="' + anToan(hoSo.anhDaiDien) + '" alt="Ảnh đại diện">';
      anhEl.classList.add("co-anh");
    } else {
      anhEl.textContent = hoSo.ten.trim().charAt(0).toUpperCase();
    }
  }
}

/* ---------- Danh sách thông báo dạng hộp thoại (dùng khi cần xem nhanh) ---------- */

export function danhSachThongBaoHTML() {
  const danhSach = layDanhSachThongBao();
  if (danhSach.length === 0) return '<p class="thong-bao-trang">Chưa có thông báo nào.</p>';
  let html = '<ul class="danh-sach-thong-bao">';
  for (const tb of danhSach) {
    html += "<li>" + anToan(tb.noiDung) +
      '<span class="thoi-gian-nho">' + anToan(dinhDangNgayGio(tb.thoiGian)) + "</span></li>";
  }
  return html + "</ul>";
}
