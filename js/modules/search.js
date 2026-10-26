/* =========================================================
   search.js - Tìm kiếm và lọc ticket theo từ khóa
   Dùng chung cho trang Tổng quan và trang Ticket của tôi
   để hai nơi không viết lại logic trùng nhau.
   ========================================================= */

// Lọc danh sách theo mã ticket, tiêu đề, thiết bị, vị trí (không phân biệt hoa thường)
export function locTheoTuKhoa(danhSach, tuKhoa) {
  const tuKhoaTim = (tuKhoa || "").trim().toLowerCase();
  if (!tuKhoaTim) return danhSach.slice();
  return danhSach.filter(function (ticket) {
    const chuoiTim = (ticket.id + " " + ticket.tieuDe + " " + ticket.thietBi + " " + ticket.viTri).toLowerCase();
    return chuoiTim.includes(tuKhoaTim);
  });
}
