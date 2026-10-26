/* =========================================================
   settings.js - Trang Cài đặt
   Bản nháp cài đặt được giữ trong biến tạm; chỉ ghi xuống
   LocalStorage khi người dùng bấm "Lưu cài đặt".
   Riêng giao diện sáng/tôi được xem trước ngay khi chọn.
   ========================================================= */

import { layCaiDat, luuCaiDat, datLaiDuLieuMau } from "../api.js";
import { hienThongBao } from "./utils.js";
import { apDungGiaoDien } from "./theme.js";
import { moHopThoai, dongHopThoai } from "./layout.js";

let caiDatTam = null; // bản nháp đang chỉnh trên giao diện
let caiDatDaLuu = null; // bản đã lưu trong LocalStorage, dùng để so sánh "chưa lưu"

export function khoiTaoTrangCaiDat() {
  caiDatDaLuu = layCaiDat();
  caiDatTam = Object.assign({}, caiDatDaLuu);
  dienCaiDatLenGiaoDien(caiDatTam);

  // Ba công tắc thông báo + công tắc xác thực hai lớp
  const cacOngTac = {
    "tac-cap-nhat-ticket": "batCapNhatTicket",
    "tac-canh-bao-sla": "batCanhBaoSLA",
    "tac-ban-tin-email": "batBanTinEmail",
    "tac-hai-lop": "xacThucHaiLop"
  };
  for (const id in cacOngTac) {
    const o = document.getElementById(id);
    if (o) {
      o.addEventListener("change", function () {
        caiDatTam[cacOngTac[id]] = o.checked;
        capNhatTrangThaiChuaLuu();
      });
    }
  }

  const oTanSuat = document.getElementById("chon-tan-suat");
  if (oTanSuat) {
    oTanSuat.addEventListener("change", function () {
      caiDatTam.tanSuat = oTanSuat.value;
      capNhatTrangThaiChuaLuu();
    });
  }

  const oCoChu = document.getElementById("chon-co-chu");
  if (oCoChu) {
    oCoChu.addEventListener("change", function () {
      caiDatTam.coChu = oCoChu.value;
      apDungGiaoDien(caiDatTam); // xem trước cỡ chữ ngay
      capNhatTrangThaiChuaLuu();
    });
  }

  // Chip chọn giao diện: áp dụng ngay để người dùng thấy kết quả, chỉ lưu khi bấm Lưu
  const cacChipTheme = document.querySelectorAll(".chip-theme");
  for (const chip of cacChipTheme) {
    chip.addEventListener("click", function () {
      caiDatTam.theme = chip.getAttribute("data-theme-chip");
      for (const chipKhac of cacChipTheme) chipKhac.classList.remove("duoc-chon");
      chip.classList.add("duoc-chon");
      apDungGiaoDien(caiDatTam);
      capNhatTrangThaiChuaLuu();
    });
  }

  const nutLuu = document.getElementById("nut-luu-cai-dat");
  if (nutLuu) {
    nutLuu.addEventListener("click", function () {
      caiDatDaLuu = Object.assign({}, caiDatTam);
      const thanhCong = luuCaiDat(caiDatDaLuu);
      capNhatTrangThaiChuaLuu();
      hienThongBao(thanhCong ? "Đã lưu cài đặt." : "Không lưu được cài đặt.", thanhCong ? "thanh-cong" : "loi");
    });
  }

  const nutDoiMatKhau = document.getElementById("nut-doi-mat-khau-nhanh");
  if (nutDoiMatKhau) {
    nutDoiMatKhau.addEventListener("click", function () {
      window.location.href = "ho-so.html?tab=mat-khau";
    });
  }

  const nutDangXuat = document.getElementById("nut-dang-xuat-tat-ca");
  if (nutDangXuat) {
    nutDangXuat.addEventListener("click", function () {
      hienThongBao("Website chạy hoàn toàn trên trình duyệt, không có phiên đăng nhập thật để thoát.", "loi");
    });
  }

  const nutDatLaiDuLieu = document.getElementById("nut-dat-lai-du-lieu");
  if (nutDatLaiDuLieu) {
    nutDatLaiDuLieu.addEventListener("click", hienXacNhanDatLaiDuLieu);
  }
}

function dienCaiDatLenGiaoDien(caiDat) {
  const giaTriOngTac = {
    "tac-cap-nhat-ticket": caiDat.batCapNhatTicket,
    "tac-canh-bao-sla": caiDat.batCanhBaoSLA,
    "tac-ban-tin-email": caiDat.batBanTinEmail,
    "tac-hai-lop": caiDat.xacThucHaiLop
  };
  for (const id in giaTriOngTac) {
    const o = document.getElementById(id);
    if (o) o.checked = giaTriOngTac[id];
  }

  const oTanSuat = document.getElementById("chon-tan-suat");
  if (oTanSuat) oTanSuat.value = caiDat.tanSuat;

  const oCoChu = document.getElementById("chon-co-chu");
  if (oCoChu) oCoChu.value = caiDat.coChu;

  const cacChipTheme = document.querySelectorAll(".chip-theme");
  for (const chip of cacChipTheme) {
    chip.classList.toggle("duoc-chon", chip.getAttribute("data-theme-chip") === caiDat.theme);
  }
}

// Dòng chân trang đổi giữa "Thay đổi chưa lưu" và "Đã lưu" tùy trạng thái bản nháp
function capNhatTrangThaiChuaLuu() {
  const o = document.getElementById("trang-thai-luu");
  if (!o) return;
  const chuaLuu = JSON.stringify(caiDatTam) !== JSON.stringify(caiDatDaLuu);
  o.textContent = chuaLuu ? "Thay đổi chưa lưu" : "Đã lưu đầy đủ";
  o.classList.toggle("chua-luu", chuaLuu);
}

// Cảnh báo rõ ràng trước khi xóa dữ liệu, theo đúng yêu cầu "phải thông báo trước"
function hienXacNhanDatLaiDuLieu() {
  moHopThoai(
    '<h3 class="tieu-de-hop-thoai">Đặt lại dữ liệu mẫu?</h3>' +
    "<p>Toàn bộ ticket, bình luận, đánh giá và thông báo đang lưu trong trình duyệt này sẽ bị xóa và nạp lại dữ liệu mẫu ban đầu.</p>" +
    '<p class="thong-tiep-nhan">Hành động này không thể hoàn tác.</p>' +
    '<div class="khung-nut" style="margin-top:16px">' +
    '<button class="nut nut-nguy-hiem" id="nut-xac-nhan-dat-lai">Có, đặt lại dữ liệu</button>' +
    '<button class="nut nut-phu" id="nut-khong-dat-lai">Không</button>' +
    "</div>"
  );
  document.getElementById("nut-xac-nhan-dat-lai").addEventListener("click", async function () {
    await datLaiDuLieuMau();
    window.location.reload();
  });
  document.getElementById("nut-khong-dat-lai").addEventListener("click", dongHopThoai);
}
