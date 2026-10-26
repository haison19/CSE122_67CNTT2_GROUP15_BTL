/* =========================================================
   profile.js - Trang Hồ sơ cá nhân
   3 tab: Thông tin cá nhân, Mật khẩu (mô phỏng), Hoạt động.
   Dữ liệu hồ sơ lưu trong LocalStorage qua api.js.
   ========================================================= */

import { layHoSo, luuHoSo, layDanhSachThongBao } from "../api.js";
import { anToan, dinhDangNgayGio, hienThongBao, DINH_DANG_ANH, KICH_THUOC_ANH_TOI_DA } from "./utils.js";
import { capNhatTenTrenThanhTren } from "./layout.js";

let tabDangChon = "thong-tin";

export function khoiTaoTrangHoSo() {
  // Trang Cài đặt có thể nhảy thẳng tới tab Mật khẩu qua ?tab=mat-khau
  const tabTuURL = new URLSearchParams(window.location.search).get("tab");
  if (tabTuURL === "mat-khau" || tabTuURL === "hoat-dong") tabDangChon = tabTuURL;

  const cacTab = document.querySelectorAll("#hang-tab-ho-so .tab");
  for (const tab of cacTab) {
    tab.addEventListener("click", function () {
      tabDangChon = tab.getAttribute("data-nhom");
      for (const tabKhac of cacTab) tabKhac.classList.remove("dang-chon");
      tab.classList.add("dang-chon");
      hienThiNoiDungTab();
    });
  }
  // Đánh dấu tab đang chọn nếu được mở qua URL
  for (const tab of cacTab) {
    tab.classList.toggle("dang-chon", tab.getAttribute("data-nhom") === tabDangChon);
  }

  const dauVaoAnh = document.getElementById("dau-vao-anh-dai-dien");
  const nutTaiAnh = document.getElementById("nut-tai-anh");
  if (nutTaiAnh && dauVaoAnh) {
    nutTaiAnh.addEventListener("click", function () { dauVaoAnh.click(); });
    dauVaoAnh.addEventListener("change", function () {
      const file = dauVaoAnh.files[0];
      dauVaoAnh.value = "";
      if (!file) return;
      if (!DINH_DANG_ANH.includes(file.type)) {
        hienThongBao("Chỉ chấp nhận ảnh định dạng PNG hoặc JPG.", "loi");
        return;
      }
      if (file.size > KICH_THUOC_ANH_TOI_DA) {
        hienThongBao("Ảnh quá lớn, tối đa 1,5 MB.", "loi");
        return;
      }
      // Ảnh được chuyển thành data URL và lưu thẳng vào hồ sơ trong LocalStorage
      const docFile = new FileReader();
      docFile.onload = function (e) {
        const hoSo = layHoSo();
        hoSo.anhDaiDien = e.target.result;
        if (luuHoSo(hoSo)) {
          hienThiPhanDauTrang(hoSo);
          hienThongBao("Đã cập nhật ảnh đại diện.", "thanh-cong");
        } else {
          hienThongBao("Không lưu được ảnh, bộ nhớ trình duyệt có thể đã đầy.", "loi");
        }
      };
      docFile.readAsDataURL(file);
    });
  }

  hienThiPhanDauTrang(layHoSo());
  hienThiHoatDongGanDay();
  ganSuKienTabThongTin();
  ganSuKienTabMatKhau();
  hienThiNoiDungTab();
}

function hienThiPhanDauTrang(hoSo) {
  const anhEl = document.getElementById("anh-dai-dien-ho-so");
  if (anhEl) {
    if (hoSo.anhDaiDien) {
      anhEl.innerHTML = '<img src="' + anToan(hoSo.anhDaiDien) + '" alt="Ảnh đại diện">';
    } else {
      anhEl.textContent = hoSo.ten.trim().charAt(0).toUpperCase();
    }
  }
  const tenEl = document.getElementById("ten-ho-so");
  if (tenEl) tenEl.textContent = hoSo.ten;
  const badgeEl = document.getElementById("badge-chuc-vu");
  if (badgeEl) badgeEl.textContent = "Người yêu cầu · " + hoSo.phongBan;
  const moDauEl = document.getElementById("mo-dau-ho-so");
  if (moDauEl) moDauEl.textContent = hoSo.ten + " · " + hoSo.email;
  // Thanh trên dùng chung mọi trang cũng phải đổi theo
  capNhatTenTrenThanhTren();
}

function hienThiNoiDungTab() {
  document.getElementById("tab-thong-tin").classList.toggle("an", tabDangChon !== "thong-tin");
  document.getElementById("tab-mat-khau").classList.toggle("an", tabDangChon !== "mat-khau");
  document.getElementById("tab-hoat-dong").classList.toggle("an", tabDangChon !== "hoat-dong");

  if (tabDangChon === "thong-tin") dienThongTinVaoForm();
}

/* ---------- Tab Thông tin cá nhân ---------- */

// Giá trị hiện ra ô nhập mỗi lần mở tab; sự kiện Lưu chỉ gắn một lần
function dienThongTinVaoForm() {
  const hoSo = layHoSo();
  const giaTri = {
    "ho-so-ten": hoSo.ten,
    "ho-so-ma-nhan-vien": hoSo.maNhanVien,
    "ho-so-email": hoSo.email,
    "ho-so-dien-thoai": hoSo.soDienThoai,
    "ho-so-phong-ban": hoSo.phongBan
  };
  for (const id in giaTri) {
    const o = document.getElementById(id);
    if (o) o.value = giaTri[id];
  }
}

function ganSuKienTabThongTin() {
  const nutLuu = document.getElementById("nut-luu-ho-so");
  if (nutLuu) {
    nutLuu.addEventListener("click", function () {
      const ten = document.getElementById("ho-so-ten").value.trim();
      const email = document.getElementById("ho-so-email").value.trim();
      if (!ten) {
        hienThongBao("Họ tên không được để trống.", "loi");
        return;
      }
      if (email && email.indexOf("@") === -1) {
        hienThongBao("Email không hợp lệ.", "loi");
        return;
      }
      const hoSoMoi = layHoSo();
      hoSoMoi.ten = ten;
      hoSoMoi.email = email;
      hoSoMoi.maNhanVien = document.getElementById("ho-so-ma-nhan-vien").value.trim();
      hoSoMoi.soDienThoai = document.getElementById("ho-so-dien-thoai").value.trim();
      hoSoMoi.phongBan = document.getElementById("ho-so-phong-ban").value.trim();
      luuHoSo(hoSoMoi);
      hienThiPhanDauTrang(hoSoMoi);
      hienThongBao("Đã lưu thông tin hồ sơ.", "thanh-cong");
    });
  }
}

/* ---------- Tab Mật khẩu (chỉ mô phỏng trên giao diện) ---------- */

function ganSuKienTabMatKhau() {
  const nutDoi = document.getElementById("nut-doi-mat-khau");
  if (!nutDoi) return;
  nutDoi.addEventListener("click", function () {
    const moi = document.getElementById("mk-moi").value;
    const xacNhan = document.getElementById("mk-xac-nhan").value;
    if (moi.length < 6) {
      hienThongBao("Mật khẩu mới cần tối thiểu 6 ký tự.", "loi");
      return;
    }
    if (moi !== xacNhan) {
      hienThongBao("Mật khẩu xác nhận không khớp.", "loi");
      return;
    }
    // Không có máy chủ nên mật khẩu không thể đổi thật; chỉ thông báo mô phỏng
    document.getElementById("mk-hien-tai").value = "";
    document.getElementById("mk-moi").value = "";
    document.getElementById("mk-xac-nhan").value = "";
    hienThongBao("Mô phỏng frontend: mật khẩu không được lưu hay gửi đi đâu cả.", "thanh-cong");
  });
}

/* ---------- Hoạt động ---------- */

// Danh sách hoạt động lấy từ chính hộp thông báo của người dùng
function hienThiHoatDongGanDay() {
  const danhSach = layDanhSachThongBao().slice(0, 6);
  const khung = document.getElementById("hoat-dong-gan-day");
  const khungTab = document.getElementById("tab-hoat-dong");

  const html = danhSach.length === 0
    ? '<p class="chu-thich">Chưa có hoạt động nào.</p>'
    : '<ul class="danh-sach-hoat-dong">' + danhSach.map(function (tb) {
        return "<li>" + anToan(tb.noiDung) +
          '<span class="thoi-gian-nho">' + anToan(dinhDangNgayGio(tb.thoiGian)) + "</span></li>";
      }).join("") + "</ul>";

  if (khung) khung.innerHTML = html;
  if (khungTab) khungTab.innerHTML = html;
}
