/* =========================================================
   AI-SUGGESTION.JS - GOI Y SUA CHUA (mo phong bang du lieu mau)
   Khong goi AI that: goi y duoc sinh tu quy tac trong repair.js va
   cac mang du lieu mau (goiYBuocAI, khoGoiYThem).
   ========================================================= */

import { goiYBuocAI, khoGoiYThem, layTicketTheoMa } from "../api.js";
import { hienThongBao } from "./utils.js";
import {
  maTicketDangSua,
  duLieuTicketDangSua,
  danhSachBuocChecklist,
  generateChecklist,
  daHoanThanh,
  kiemTraBuocDaCo,
  luuDuLieuDangSua,
  hienThiChecklistXuLy,
  tiepTucNeuDangTamDung
} from "./repair.js";

// Trang thai cua khoi goi y AI: danh sach dang hien thi va so lan bam "Tao lai".
// Hai bien nay thuoc rieng khoi AI nen duoc giu o day (khong de trong repair.js).
let goiYAIHienTai = [];
let soLanTaoLai = 0;

function taoDanhSachGoiYAI(soLan) {
  const ticket = layTicketTheoMa(maTicketDangSua);
  const goiYTheoTicket = ticket ? generateChecklist(ticket).map(function (buoc) { return buoc.ten; }) : goiYBuocAI;
  if (soLan === 0) {
    return goiYTheoTicket.slice();
  }

  // Lan tao lai thu n: giu 2 goi y goc cua chinh ticket nay, thay 3 goi y con lai
  // bang kho goi y bo sung de danh sach van sat voi thiet bi dang sua
  const ketQua = [];
  ketQua.push(goiYTheoTicket[0]);
  if (goiYTheoTicket.length > 1) {
    ketQua.push(goiYTheoTicket[1]);
  }
  for (let i = 0; i < 3; i++) {
    ketQua.push(khoGoiYThem[(soLan * 3 + i) % khoGoiYThem.length]);
  }
  return ketQua;
}

function capNhatNhanTinCay() {
  const oNhan = document.getElementById("nhanDoTinCay");
  const oSoGoiY = document.getElementById("soGoiY");

  const doTinCay = Math.max(70, 85 - soLanTaoLai * 3);
  if (oNhan) {
    oNhan.textContent = doTinCay + "% tin cậy";
  }
  if (oSoGoiY) {
    oSoGoiY.textContent = goiYAIHienTai.length + " bước";
  }
}

function hienThiGoiYAI() {
  const oKhung = document.getElementById("danhSachGoiYAI");
  if (!oKhung) return;

  oKhung.innerHTML = "";

  for (let i = 0; i < goiYAIHienTai.length; i++) {
    const tenGoiY = goiYAIHienTai[i];
    const daCo = kiemTraBuocDaCo(tenGoiY);

    const oDong = document.createElement("li");
    oDong.className = "dong-goi-y";
    if (daCo) {
      oDong.classList.add("da-co");
    }

    const oSo = document.createElement("span");
    oSo.className = "so-goi-y";
    oSo.textContent = i + 1;

    const oTen = document.createElement("span");
    oTen.className = "ten-goi-y";
    oTen.textContent = tenGoiY;

    oDong.appendChild(oSo);
    oDong.appendChild(oTen);

    // Buoc nao da co trong checklist thi ghi ro de nguoi dung biet se bi bo qua
    if (daCo) {
      const oNhan = document.createElement("span");
      oNhan.className = "nhan nhan-xanh";
      oNhan.textContent = "Đã có";
      oDong.appendChild(oNhan);
    }

    oKhung.appendChild(oDong);
  }

  capNhatNhanTinCay();
}

function hienThiTrangThaiGoiYAI() {
  const oHop = document.getElementById("hopGoiYAI");
  const oTrangThai = document.getElementById("trangThaiGoiYAI");
  if (duLieuTicketDangSua === null) return;

  const trangThai = duLieuTicketDangSua.trangThaiGoiYAI || "moi";
  if (oHop) {
    oHop.hidden = trangThai !== "moi";
  }
  if (!oTrangThai) return;

  if (trangThai === "da-chap-nhan") {
    oTrangThai.textContent = "Đã áp dụng gợi ý AI vào checklist xử lý.";
  } else if (trangThai === "da-tu-choi") {
    oTrangThai.textContent = "Đã bỏ qua gợi ý AI. Checklist hiện tại được giữ nguyên.";
  } else if (trangThai === "thu-cong") {
    oTrangThai.textContent = 'Đang xử lý thủ công: tự thêm bước bằng nút "Thêm bước".';
  } else {
    oTrangThai.textContent = "Chưa áp dụng gợi ý nào.";
  }
}

function chapNhanGoiYAI() {
  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể thay đổi checklist.");
    return;
  }
  if (duLieuTicketDangSua.trangThaiGoiYAI !== "moi") {
    hienThongBao('Bấm "Tạo lại" nếu muốn xem gợi ý mới trước khi chấp nhận.');
    return;
  }

  let soThem = 0;
  let soBoQua = 0;

  for (let i = 0; i < goiYAIHienTai.length; i++) {
    const tenGoiY = goiYAIHienTai[i];
    if (kiemTraBuocDaCo(tenGoiY)) {
      soBoQua = soBoQua + 1;
    } else {
      danhSachBuocChecklist.push({ ten: tenGoiY, xong: false });
      soThem = soThem + 1;
    }
  }

  duLieuTicketDangSua.trangThaiGoiYAI = "da-chap-nhan";
  tiepTucNeuDangTamDung();
  luuDuLieuDangSua();

  hienThiChecklistXuLy();
  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();

  if (soThem === 0) {
    hienThongBao("Các bước gợi ý đều đã có trong checklist.");
  } else if (soBoQua > 0) {
    hienThongBao("Đã thêm " + soThem + " bước, bỏ qua " + soBoQua + " bước đã có.");
  } else {
    hienThongBao("Đã thêm " + soThem + " bước từ gợi ý AI.");
  }
}

function taoLaiGoiYAI() {
  if (daHoanThanh()) return;

  soLanTaoLai = soLanTaoLai + 1;
  goiYAIHienTai = taoDanhSachGoiYAI(soLanTaoLai);
  duLieuTicketDangSua.goiYAI = goiYAIHienTai;
  duLieuTicketDangSua.soLanTaoLai = soLanTaoLai;
  duLieuTicketDangSua.trangThaiGoiYAI = "moi";
  luuDuLieuDangSua();

  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();
  hienThongBao("Đã tạo lại gợi ý (mô phỏng từ dữ liệu mẫu, không gọi AI thật).");
}

function tuChoiGoiYAI() {
  if (daHoanThanh()) return;

  duLieuTicketDangSua.trangThaiGoiYAI = "da-tu-choi";
  luuDuLieuDangSua();
  hienThiTrangThaiGoiYAI();
  hienThongBao("Đã bỏ qua gợi ý AI. Checklist hiện tại được giữ nguyên.");
}

function suaGoiYAI() {
  if (daHoanThanh()) return;

  // Mo lai hop goi y de nguoi dung thay ro danh sach truoc khi sua
  if (duLieuTicketDangSua.trangThaiGoiYAI !== "moi") {
    duLieuTicketDangSua.trangThaiGoiYAI = "moi";
    hienThiTrangThaiGoiYAI();
  }

  const chuoiMoi = window.prompt(
    "Sửa danh sách gợi ý (mỗi bước cách nhau bằng dấu ;):",
    goiYAIHienTai.join("; ")
  );
  if (chuoiMoi === null) return;

  const cacPhan = chuoiMoi.split(";");
  const danhSachMoi = [];
  for (let i = 0; i < cacPhan.length; i++) {
    const ten = cacPhan[i].trim();
    if (ten !== "") {
      danhSachMoi.push(ten);
    }
  }

  if (danhSachMoi.length === 0) {
    hienThongBao("Danh sách gợi ý phải có ít nhất một bước.");
    return;
  }

  goiYAIHienTai = danhSachMoi;
  duLieuTicketDangSua.goiYAI = goiYAIHienTai;
  luuDuLieuDangSua();
  hienThiGoiYAI();
  hienThongBao("Đã cập nhật danh sách gợi ý.");
}

function dungThuCong() {
  if (daHoanThanh()) return;

  duLieuTicketDangSua.trangThaiGoiYAI = "thu-cong";
  luuDuLieuDangSua();
  hienThiTrangThaiGoiYAI();
  hienThongBao('Đã chuyển sang xử lý thủ công. Bấm "Thêm bước" để tự tạo checklist.');
}

function themBuocMoi() {
  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể thêm bước.");
    return;
  }

  const tenBuoc = window.prompt("Nhập tên bước kiểm tra:");
  if (tenBuoc === null) return;

  const ten = tenBuoc.trim();
  if (ten === "") {
    hienThongBao("Tên bước không được để trống.");
    return;
  }
  if (kiemTraBuocDaCo(ten)) {
    hienThongBao('Bước "' + ten + '" đã có trong checklist.');
    return;
  }

  danhSachBuocChecklist.push({ ten: ten, xong: false });
  tiepTucNeuDangTamDung();
  luuDuLieuDangSua();
  hienThiChecklistXuLy();
  hienThongBao("Đã thêm bước: " + ten);
}
// Khoi tao khoi goi y AI cua trang Dang sua: nap goi y da luu va gan su kien cho cac nut.
// main.js goi ham nay SAU khoiTaoDangSua() vi can duLieuTicketDangSua da nap xong.
function khoiTaoGoiYAI() {
  goiYAIHienTai = duLieuTicketDangSua.goiYAI || goiYBuocAI.slice();
  soLanTaoLai = duLieuTicketDangSua.soLanTaoLai || 0;

  hienThiGoiYAI();
  hienThiTrangThaiGoiYAI();

  document.getElementById("nutThemBuoc").addEventListener("click", themBuocMoi);
  document.getElementById("nutChapNhan").addEventListener("click", chapNhanGoiYAI);
  document.getElementById("nutTaoLai").addEventListener("click", taoLaiGoiYAI);
  document.getElementById("nutTuChoiChecklist").addEventListener("click", tuChoiGoiYAI);
  document.getElementById("nutSuaChecklist").addEventListener("click", suaGoiYAI);
  document.getElementById("nutDungThuCong").addEventListener("click", dungThuCong);
}

export { hienThiGoiYAI, hienThiTrangThaiGoiYAI, khoiTaoGoiYAI };
