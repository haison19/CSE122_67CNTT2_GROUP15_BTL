/* =========================================================
   MAIN.JS - DIEM KHOI DAU CUA FIXFLOW
   File nay chi lam 3 viec:
   1. Nap du lieu mau tu assets/data/*.json (qua api.js)
   2. Goi cac ham khoi tao dung voi trang HTML dang mo
   3. Gan vai su kien dung chung cho ca 6 trang (o tim kiem, phim Escape)
   Khong viet nghiep vu o day: moi nghiep vu nam trong js/modules/.
   ========================================================= */

import { napDuLieuMau, ganDuLieuMau, xoaDuLieuMauCu, apDungDuLieuDaLuu } from "./api.js";
import { khoiTaoGiaoDien } from "./modules/theme.js";
import { hienThongBao, dongThanhBen, hienThiThongTinNguoiDung, ganSuKienChung } from "./modules/utils.js";
import {
  hienThiDanhSach,
  locTicketTheoTuKhoa,
  dongHopThoai,
  khoiTaoTongQuan
} from "./modules/dashboard.js";
import { hienThiHangDoi, khoiTaoHangDoi } from "./modules/queue.js";
import { khoiTaoDangSua } from "./modules/repair.js";
import { khoiTaoGoiYAI } from "./modules/ai-suggestion.js";
import { hienThiBangLichSu, dongHopThoaiLichSu, khoiTaoLichSu } from "./modules/history.js";
import { hienThiDanhSachMau, khoiTaoChecklist } from "./modules/checklist.js";
import { khoiTaoThongKe } from "./modules/analytics.js";

// O tim kiem tren thanh tren co o ca 6 trang, nhung moi trang tim tren du lieu khac nhau.
// Ham nay xem trang dang mo co khoi nao roi goi dung ham cua trang do.
function xuLyTimKiem() {
  const oTimKiem = document.getElementById("oTimKiem");
  const tuKhoa = oTimKiem.value;

  if (document.getElementById("danhSachViec")) {
    hienThiDanhSach(locTicketTheoTuKhoa(tuKhoa));
    return;
  }

  if (document.getElementById("khungKanban")) {
    document.getElementById("tuKhoaHangDoi").value = tuKhoa;
    hienThiHangDoi();
    return;
  }

  if (document.getElementById("bangLichSu")) {
    document.getElementById("tuKhoaLichSu").value = tuKhoa;
    hienThiBangLichSu();
    return;
  }

  if (document.getElementById("danhSachMau")) {
    document.getElementById("tuKhoaMau").value = tuKhoa;
    hienThiDanhSachMau();
    return;
  }

  hienThongBao("Đang tìm kiếm: " + tuKhoa);
}

// Tim kiem tren thanh tren + phim Escape de dong hop thoai / thanh ben
function ganSuKienToanTrang() {
  const oTimKiem = document.getElementById("oTimKiem");
  if (oTimKiem) {
    oTimKiem.addEventListener("input", xuLyTimKiem);
  }

  document.addEventListener("keydown", function (suKien) {
    if (suKien.key === "Escape") {
      dongHopThoai();
      dongHopThoaiLichSu();
      dongThanhBen();
    }
  });
}


// Khoi tao phan rieng cua tung trang HTML.
// Moi trang chi co mot khoi "nhan dang" duy nhat nen khong bi chay nham sang trang khac.
function khoiTaoTheoTrang() {
  // TRANG TONG QUAN - index.html
  if (document.getElementById("danhSachViec")) {
    khoiTaoTongQuan();
    return;
  }

  // TRANG 01 - HANG DOI - queue.html
  if (document.getElementById("khungKanban")) {
    khoiTaoHangDoi();
    return;
  }

  // TRANG 02 - DANG SUA - fixing.html
  // Phai goi khoiTaoDangSua() truoc khoiTaoGoiYAI() vi khoi goi y AI can du lieu cua ticket
  if (document.getElementById("danhSachBuocXuLy")) {
    khoiTaoDangSua();
    khoiTaoGoiYAI();
    return;
  }

  // TRANG 03 - LICH SU - history.html
  if (document.getElementById("bangLichSu")) {
    khoiTaoLichSu();
    return;
  }

  // TRANG 04 - CHECKLIST - checklist.html
  if (document.getElementById("danhSachMau")) {
    khoiTaoChecklist();
    return;
  }

  // TRANG 05 - THONG KE - analytics.html
  if (document.getElementById("bieuDo12Tuan")) {
    khoiTaoThongKe();
  }
}

// Hien loi ro rang khi khong doc duoc du lieu mau (thuong do mo file:// thay vi Live Server)
function baoLoiDuLieu() {
  const oThongBao = document.getElementById("thongBao");
  if (oThongBao) {
    oThongBao.textContent = "Không đọc được dữ liệu mẫu trong assets/data. Hãy chạy dự án qua Live Server.";
    oThongBao.classList.add("hien");
  }
  console.error(
    "FixFlow: khong nap duoc assets/data/*.json. Hay chay du an bang VS Code Live Server (khong mo truc tiep file://)."
  );
}

// Ham khoi dong chinh: nap du lieu roi moi ve giao dien
async function khoiDong() {
  // 1. Giao dien sang/toi va thong tin ky thuat vien khong phu thuoc du lieu mau
  khoiTaoGiaoDien();
  hienThiThongTinNguoiDung();
  ganSuKienChung();

  // 2. Nap du lieu mau tu thu muc assets/data/
  const duLieu = await napDuLieuMau();
  if (duLieu === null) {
    baoLoiDuLieu();
    return;
  }
  ganDuLieuMau(duLieu);

  // 3. Xoa du lieu cua phien ban du lieu mau cu (neu co) truoc khi doc du lieu da luu
  xoaDuLieuMauCu();

  // 4. Ap dung du lieu nguoi dung da luu (checklist, ghi chu, ticket da hoan thanh)
  //    truoc khi ve giao dien cua tung trang
  apDungDuLieuDaLuu();

  // 5. Ve giao dien cua trang dang mo
  khoiTaoTheoTrang();

  // 6. Su kien dung chung (o tim kiem, phim Escape) gan sau cung
  ganSuKienToanTrang();
}

khoiDong();
