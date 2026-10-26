/* =========================================================
   ai-suggestion.js - Mô phỏng phân loại sự cố ("AI")
   Hoàn toàn chạy bằng JavaScript trên trình duyệt:
   đếm từ khóa trong tiêu đề + mô tả, chọn danh mục khớp nhiều nhất.
   KHÔNG phải AI thật, KHÔNG gọi máy chủ.
   ========================================================= */

export const DANH_MUC_SU_CO = [
  "Điện lạnh", "Mạng", "Máy in", "Thiết bị trình chiếu",
  "Điện", "Âm thanh", "Camera", "Cơ điện", "Thiết bị văn phòng", "Chưa xác định"
];

const CAC_NHOM_TU_KHOA = [
  { danhMuc: "Điện lạnh", tuKhoa: ["máy lạnh", "điều hòa", "lanh", "không mát", "gas", "chảy nước"] },
  { danhMuc: "Mạng", tuKhoa: ["wifi", "router", "mạng", "internet", "chập chờn", "switch", "mạng chậm"] },
  { danhMuc: "Máy in", tuKhoa: ["máy in", "kẹt giấy", "mực", "in"] },
  { danhMuc: "Thiết bị trình chiếu", tuKhoa: ["máy chiếu", "màn hình", "projector", "chiếu"] },
  { danhMuc: "Điện", tuKhoa: ["ổ cắm", "điện", "đèn", "cầu dao", "chập", "mất điện"] },
  { danhMuc: "Âm thanh", tuKhoa: ["loa", "micro", "âm thanh", "rè"] },
  { danhMuc: "Camera", tuKhoa: ["camera", "tín hiệu", "giám sát"] }
];

// Trả về { danhMuc, doTinCay, soTuKhoa } của nhóm khớp nhiều từ khóa nhất
export function moPhongPhanLoai(tieuDe, moTa) {
  const vanBan = (tieuDe + " " + moTa).toLowerCase();
  let ketQua = { danhMuc: "Chưa xác định", doTinCay: 40, soTuKhoa: 0 };

  for (const nhom of CAC_NHOM_TU_KHOA) {
    let soTuKhoa = 0;
    for (const tu of nhom.tuKhoa) {
      if (vanBan.includes(tu)) soTuKhoa++;
    }
    if (soTuKhoa > ketQua.soTuKhoa) {
      // Càng nhiều từ khóa khớp thì "độ tin cậy" càng cao, tối đa 95%
      ketQua = { danhMuc: nhom.danhMuc, doTinCay: Math.min(95, 55 + soTuKhoa * 13), soTuKhoa: soTuKhoa };
    }
  }
  return ketQua;
}
