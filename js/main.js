/* =========================================================
   main.js - File khởi chạy chính của mọi trang
   Trình tự: nạp dữ liệu -> áp giao diện -> khung chung -> trang riêng.
   Mỗi trang HTML chỉ cần: <script type="module" src="js/main.js"></script>
   và <body data-trang="..."> để biết phải chạy module nào.
   ========================================================= */

import { khoiTaoDuLieu, layCaiDat } from "./api.js";
import { khoiTaoThanhBen, khoiTaoThanhTren } from "./modules/layout.js";
import { apDungGiaoDien } from "./modules/theme.js";
import { khoiTaoTrangTongQuan } from "./modules/dashboard.js";
import { khoiTaoTrangTaoTicket } from "./modules/ticket-form.js";
import { khoiTaoTrangDanhSach } from "./modules/ticket-list.js";
import { khoiTaoTrangChiTiet } from "./modules/ticket-detail.js";
import { khoiTaoTrangThongBao } from "./modules/notifications.js";
import { khoiTaoTrangHoSo } from "./modules/profile.js";
import { khoiTaoTrangCaiDat } from "./modules/settings.js";

document.addEventListener("DOMContentLoaded", async function () {
  // 1. Đọc dữ liệu đã lưu; nếu chưa có thì nạp JSON mẫu vào LocalStorage
  await khoiTaoDuLieu();

  // 2. Áp giao diện sáng/tối và cỡ chữ đã lưu (làm sớm để tránh nháy trắng)
  apDungGiaoDien(layCaiDat());

  // 3. Khung chung: thanh bên, thanh trên, badge thông báo
  khoiTaoThanhBen();
  khoiTaoThanhTren();

  // 4. Gọi module của đúng trang đang mở
  const trang = document.body.getAttribute("data-trang");
  if (trang === "tong-quan") khoiTaoTrangTongQuan();
  else if (trang === "tao-ticket") khoiTaoTrangTaoTicket();
  else if (trang === "danh-sach") khoiTaoTrangDanhSach();
  else if (trang === "chi-tiet") khoiTaoTrangChiTiet();
  else if (trang === "thong-bao") khoiTaoTrangThongBao();
  else if (trang === "ho-so") khoiTaoTrangHoSo();
  else if (trang === "cai-dat") khoiTaoTrangCaiDat();
});
