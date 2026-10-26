/* =========================================================
   storage.js - Lớp đọc/ghi LocalStorage
   Mọi chỗ khác không gọi localStorage trực tiếp, chỉ qua file này.
   Nguồn dữ liệu: LocalStorage của trình duyệt (phía frontend).
   ========================================================= */

// Khóa dữ liệu - đặt tên theo tiền tố fixflow để không đụng code thành viên khác
export const KHOA_TICKET = "fixflow_nguoi_yeu_cau_tickets_v1";
export const KHOA_THONG_BAO = "fixflow_nguoi_yeu_cau_thong_bao_v1";
export const KHOA_HO_SO = "fixflow_nguoi_yeu_cau_ho_so_v1";
export const KHOA_CAI_DAT = "fixflow_nguoi_yeu_cau_cai_dat_v1";

// Đọc một mảng đã lưu; dữ liệu hỏng hoặc thiếu thì trả về mảng rỗng
export function docMang(khoa) {
  try {
    const mang = JSON.parse(localStorage.getItem(khoa));
    return Array.isArray(mang) ? mang : [];
  } catch (e) {
    return [];
  }
}

// Đọc một đối tượng đã lưu; dữ liệu hỏng thì trả về null
export function docDoiTuong(khoa) {
  try {
    const doiTuong = JSON.parse(localStorage.getItem(khoa));
    return doiTuong && typeof doiTuong === "object" ? doiTuong : null;
  } catch (e) {
    return null;
  }
}

// Ghi dữ liệu; trả về false nếu trình duyệt hết bộ nhớ (khi lưu kèm ảnh lớn)
export function ghi(khoa, duLieu) {
  try {
    localStorage.setItem(khoa, JSON.stringify(duLieu));
    return true;
  } catch (e) {
    return false;
  }
}

export function xoa(khoa) {
  localStorage.removeItem(khoa);
}

// Kiểm tra khóa đã có dữ liệu hợp lệ chưa (để quyết định có nạp mẫu hay không)
export function coDuLieu(khoa) {
  return localStorage.getItem(khoa) !== null;
}
