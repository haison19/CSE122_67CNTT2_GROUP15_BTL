/* =========================================================
   theme.js - Chuyển giao diện sáng / tối / theo hệ thống
   Chỉ việc gán thuộc tính data-theme vào thẻ <html>,
   toàn bộ màu sắc đổi theo biến CSS trong style.css.
   ========================================================= */

// Áp dụng cài đặt ngay khi trang hiển thị (main.js gọi sau khi đọc cài đặt)
export function apDungGiaoDien(caiDat) {
  const kieu = layKieuGiaoDienThucTe(caiDat.theme);
  if (kieu === "toi") {
    document.documentElement.setAttribute("data-theme", "toi");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  document.body.classList.toggle("chu-lon", caiDat.coChu === "lon");
}

// "he-thong" nghĩa là nghe theo cấu hình sáng/tối của hệ điều hành
function layKieuGiaoDienThucTe(theme) {
  if (theme === "toi") return "toi";
  if (theme === "sang") return "sang";
  const heThongToi = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return heThongToi ? "toi" : "sang";
}
