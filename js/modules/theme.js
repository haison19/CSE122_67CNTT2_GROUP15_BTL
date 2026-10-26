/* =========================================================
   THEME.JS - CHE DO SANG / TOI
   - Che do SANG la mac dinh: the <html> KHONG co lop "giao-dien-toi"
   - Che do TOI bat/tat bang classList.toggle("giao-dien-toi", ...)
   - Lua chon duoc luu trong localStorage qua api.js (khoa fixflowGiaoDien)
   ========================================================= */

import { docGiaoDienDaLuu, luuGiaoDien, GIAO_DIEN_SANG, GIAO_DIEN_TOI } from "../api.js";
import { hienThongBao } from "./utils.js";

const LOP_GIAO_DIEN_TOI = "giao-dien-toi";

// Cap nhat mo ta cho cac nut doi giao dien (de trinh doc man hinh doc dung)
function capNhatNutGiaoDien(dangToi) {
  const nhan = dangToi ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối";
  const cacNut = document.querySelectorAll(".nut-giao-dien");

  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].setAttribute("aria-pressed", dangToi ? "true" : "false");
    cacNut[i].setAttribute("aria-label", nhan);
    cacNut[i].setAttribute("title", nhan);
  }
}

// classList.toggle(tenLop, dieuKien): them lop khi dieu kien = true, xoa lop khi false.
function apDungGiaoDien(giaoDien) {
  const dangToi = giaoDien === GIAO_DIEN_TOI;
  document.documentElement.classList.toggle(LOP_GIAO_DIEN_TOI, dangToi);
  capNhatNutGiaoDien(dangToi);
  return dangToi ? GIAO_DIEN_TOI : GIAO_DIEN_SANG;
}

function doiGiaoDien() {
  // Khong truyen dieu kien -> toggle() tu dao trang thai hien tai
  // va tra ve true/false tuong ung voi che do toi sau khi doi.
  const dangToi = document.documentElement.classList.toggle(LOP_GIAO_DIEN_TOI);
  capNhatNutGiaoDien(dangToi);

  luuGiaoDien(dangToi ? GIAO_DIEN_TOI : GIAO_DIEN_SANG);
  hienThongBao(dangToi ? "Đã bật chế độ tối." : "Đã chuyển sang chế độ sáng.");
}

// Gan su kien cho moi nut doi giao dien tren trang dang mo
function khoiTaoGiaoDien() {
  apDungGiaoDien(docGiaoDienDaLuu());

  const cacNut = document.querySelectorAll(".nut-giao-dien");
  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].addEventListener("click", doiGiaoDien);
  }
}

// Ap dung giao dien NGAY khi module duoc nap (main.js import o dau file),
// truoc khi cac mo dun khac ve noi dung, de han che nhay mau.
apDungGiaoDien(docGiaoDienDaLuu());

export { apDungGiaoDien, doiGiaoDien, khoiTaoGiaoDien };
