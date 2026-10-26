/* =========================================================
   utils.js - Các hàm tiện ích dùng chung mọi trang
   Không chứa nghiệp vụ, chỉ định dạng và kiểm tra dữ liệu.
   ========================================================= */

export const DANH_SACH_MUC_DO = ["Thấp", "Trung bình", "Cao", "Khẩn"];
export const NHOM_DANG_XU_LY = ["Mới", "Chờ nhận", "Chờ bổ sung", "Đang xử lý", "Chờ linh kiện"];
export const SO_DONG_MOI_TRANG = 8;
export const DINH_DANG_ANH = ["image/png", "image/jpeg"];
export const KICH_THUOC_ANH_TOI_DA = 1.5 * 1024 * 1024; // 1,5 MB

// Thoát ký tự đặc biệt trước khi chèn dữ liệu người dùng vào HTML (chống XSS)
export function anToan(chuoi) {
  if (chuoi === null || chuoi === undefined) return "";
  return String(chuoi)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function dinhDangNgay(ngayISO) {
  const d = new Date(ngayISO);
  if (isNaN(d.getTime())) return "";
  const ngay = String(d.getDate()).padStart(2, "0");
  const thang = String(d.getMonth() + 1).padStart(2, "0");
  return ngay + "/" + thang + "/" + d.getFullYear();
}

export function dinhDangGio(ngayISO) {
  const d = new Date(ngayISO);
  if (isNaN(d.getTime())) return "";
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

export function dinhDangNgayGio(ngayISO) {
  return dinhDangGio(ngayISO) + " · " + dinhDangNgay(ngayISO);
}

// "X giờ trước" / "X ngày trước" - dùng cho trang Thông báo và Hoạt động gần đây
export function thoiGianTuongDoi(ngayISO) {
  const d = new Date(ngayISO);
  if (isNaN(d.getTime())) return "";
  const soPhut = Math.floor((Date.now() - d.getTime()) / 60000);
  if (soPhut < 60) return "Vừa xong";
  const soGio = Math.floor(soPhut / 60);
  if (soGio < 24) return soGio + " giờ trước";
  return Math.floor(soGio / 24) + " ngày trước";
}

// Số giờ SLA theo mức độ ưu tiên (mô phỏng quy định nội bộ)
export function laySoGioSLA(mucDo) {
  if (mucDo === "Khẩn") return 8;
  if (mucDo === "Cao") return 72;
  if (mucDo === "Trung bình") return 96;
  return 120;
}

export function congGio(ngayISO, soGio) {
  const d = new Date(ngayISO);
  d.setHours(d.getHours() + soGio);
  return d.toISOString();
}

export function truocSoGio(soGio) {
  const d = new Date();
  d.setHours(d.getHours() - soGio);
  return d.toISOString();
}

// Số giờ còn lại so với hạn xử lý (âm nếu đã quá hạn)
export function tinhSoGioConLai(ticket) {
  if (!ticket.hanXuLy) return 0;
  const han = new Date(ticket.hanXuLy).getTime();
  return Math.round((han - Date.now()) / 3600000);
}

// Chuỗi hiển thị cho cột SLA trên bảng, phụ thuộc trạng thái ticket
export function dinhDangSLA(ticket) {
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

// Nhãn màu cho trạng thái ticket
export function nhanTrangThai(trangThai) {
  if (trangThai === "Hoàn thành") return "nhan-xanh-la";
  if (trangThai === "Hủy") return "nhan-xam";
  if (trangThai === "Chờ bổ sung") return "nhan-vang";
  if (trangThai === "Mới") return "nhan-xanh";
  return "nhan-vang";
}

// Nhãn màu cho mức độ ưu tiên
export function nhanMucDo(mucDo) {
  if (mucDo === "Khẩn") return "nhan-do";
  if (mucDo === "Cao") return "nhan-vang";
  if (mucDo === "Trung bình") return "nhan-xanh";
  return "nhan-xam";
}

// Thông báo nhỏ góc màn hình; loai: "thanh-cong" | "loi" | ""
export function hienThongBao(noiDung, loai) {
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
