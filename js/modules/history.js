/* =========================================================
   HISTORY.JS - TRANG LICH SU SUA CHUA (history.html)
   Loc lich su, ve bang, xem chi tiet mot dong va xuat file CSV.
   ========================================================= */

import { danhSachLichSu } from "../api.js";
import { hienThongBao } from "./utils.js";

/* =========================================================
   TRANG 03 - LICH SU SUA CHUA
   ========================================================= */

function layLichSuDaLoc() {
  const oTuKhoa = document.getElementById("tuKhoaLichSu");
  const oDanhMuc = document.getElementById("locDanhMucLichSu");
  const oThoiGian = document.getElementById("locThoiGianLichSu");

  const tuKhoa = oTuKhoa.value.toLowerCase().trim();
  const danhMuc = oDanhMuc.value;
  const soNgay = parseInt(oThoiGian.value);

  const ketQua = [];
  for (let i = 0; i < danhSachLichSu.length; i++) {
    const dong = danhSachLichSu[i];
    const chuoiTim = (dong.ma + " " + dong.thietBi + " " + dong.danhMuc).toLowerCase();

    const khopTuKhoa = tuKhoa === "" || chuoiTim.indexOf(tuKhoa) !== -1;
    const khopDanhMuc = danhMuc === "" || dong.danhMuc === danhMuc;
    const khopThoiGian = isNaN(soNgay) || dong.ngayTruoc <= soNgay;

    if (khopTuKhoa && khopDanhMuc && khopThoiGian) {
      ketQua.push(dong);
    }
  }
  return ketQua;
}

function hienThiBangLichSu() {
  const oBang = document.getElementById("bangLichSu");
  if (!oBang) return;

  const danhSach = layLichSuDaLoc();
  oBang.innerHTML = "";

  for (let i = 0; i < danhSach.length; i++) {
    const dong = danhSach[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = dong.ma;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = dong.thietBi;

    const oDanhMuc = document.createElement("td");
    oDanhMuc.textContent = dong.danhMuc;

    const oThoiGian = document.createElement("td");
    oThoiGian.textContent = dong.thoiGian;

    const oDanhGia = document.createElement("td");
    oDanhGia.className = "diem-sao";
    if (dong.danhGia > 0) {
      oDanhGia.textContent = dong.danhGia + " ★";
    } else {
      // Ticket vua hoan thanh trong app thi chua duoc cham diem
      oDanhGia.textContent = "Chưa chấm";
      oDanhGia.classList.add("chua-cham");
    }

    const oKetQua = document.createElement("td");
    oKetQua.className = "ket-qua-dung";
    if (dong.ketQua === "Sớm hạn") {
      oKetQua.className = "ket-qua-som";
    }
    if (dong.ketQua === "Trễ hạn") {
      oKetQua.className = "ket-qua-tre";
    }
    oKetQua.textContent = dong.ketQua;

    const oXem = document.createElement("td");
    const oLienKet = document.createElement("span");
    oLienKet.className = "lien-ket-xem";
    oLienKet.textContent = "Xem";
    oLienKet.addEventListener("click", function () {
      moChiTietLichSu(dong);
    });
    oXem.appendChild(oLienKet);

    oDong.appendChild(oMa);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oDanhMuc);
    oDong.appendChild(oThoiGian);
    oDong.appendChild(oDanhGia);
    oDong.appendChild(oKetQua);
    oDong.appendChild(oXem);
    oBang.appendChild(oDong);
  }
}

function moChiTietLichSu(dong) {
  document.getElementById("lsMa").textContent = dong.ma;
  document.getElementById("lsThietBi").textContent = dong.thietBi;
  document.getElementById("lsDanhMuc").textContent = dong.danhMuc;
  document.getElementById("lsThoiGian").textContent = dong.thoiGian;
  if (dong.danhGia > 0) {
    document.getElementById("lsDanhGia").textContent = dong.danhGia + " ★";
  } else {
    document.getElementById("lsDanhGia").textContent = "Chưa chấm điểm";
  }
  document.getElementById("lsKetQua").textContent = dong.ketQua;

  const oGhiChuChiTiet = document.getElementById("lsGhiChu");
  if (oGhiChuChiTiet) {
    if (dong.ghiChu) {
      oGhiChuChiTiet.textContent = dong.ghiChu;
    } else {
      oGhiChuChiTiet.textContent = "Không có ghi chú";
    }
  }

  document.getElementById("nenMoLichSu").classList.add("hien");
}

function dongHopThoaiLichSu() {
  const oNenMo = document.getElementById("nenMoLichSu");
  if (!oNenMo) return;
  oNenMo.classList.remove("hien");
}

// Boc mot o CSV: luon dat trong ngoac kep va nhan doi dau ngoac kep ben trong
// de ghi chu co dau phay van khong lam lech cot khi mo bang Excel
function bocCSV(giaTri) {
  const chuoi = giaTri === null || giaTri === undefined ? "" : String(giaTri);
  return '"' + chuoi.replace(/"/g, '""') + '"';
}

function xuatCSV() {
  const danhSach = layLichSuDaLoc();

  const dong = ["Ma ticket,Thiet bi,Danh muc,Thoi gian,Danh gia,Ket qua,Ghi chu"];
  for (let i = 0; i < danhSach.length; i++) {
    const d = danhSach[i];
    const danhGia = d.danhGia > 0 ? d.danhGia : "Chua cham";
    dong.push(bocCSV(d.ma) + "," + bocCSV(d.thietBi) + "," + bocCSV(d.danhMuc) + "," +
      bocCSV(d.thoiGian) + "," + bocCSV(danhGia) + "," + bocCSV(d.ketQua) + "," +
      bocCSV(d.ghiChu || ""));
  }

  // Ky tu \uFEFF giup Excel hien thi dung tieng Viet co dau
  const noiDung = "\uFEFF" + dong.join("\n");
  const tep = new Blob([noiDung], { type: "text/csv;charset=utf-8;" });
  const duongDan = URL.createObjectURL(tep);

  const lienKet = document.createElement("a");
  lienKet.href = duongDan;
  lienKet.download = "lich-su-sua-chua.csv";
  document.body.appendChild(lienKet);
  lienKet.click();
  lienKet.remove();
  URL.revokeObjectURL(duongDan);

  hienThongBao("Đã xuất file lịch sử sửa chữa dạng CSV.");
}

function khoiTaoLichSu() {
  hienThiBangLichSu();

  document.getElementById("tuKhoaLichSu").addEventListener("input", hienThiBangLichSu);
  document.getElementById("locDanhMucLichSu").addEventListener("change", hienThiBangLichSu);
  document.getElementById("locThoiGianLichSu").addEventListener("change", hienThiBangLichSu);

  document.getElementById("nutDatLaiLichSu").addEventListener("click", function () {
    document.getElementById("tuKhoaLichSu").value = "";
    document.getElementById("locDanhMucLichSu").value = "";
    document.getElementById("locThoiGianLichSu").value = "";
    hienThiBangLichSu();
    hienThongBao("Đã đặt lại bộ lọc lịch sử.");
  });

  document.getElementById("nutXuatCSV").addEventListener("click", xuatCSV);

  document.getElementById("nutDongLichSu").addEventListener("click", dongHopThoaiLichSu);
  document.getElementById("nutDongLichSuDuoi").addEventListener("click", dongHopThoaiLichSu);
  document.getElementById("nenMoLichSu").addEventListener("click", function (suKien) {
    if (suKien.target.id === "nenMoLichSu") {
      dongHopThoaiLichSu();
    }
  });
}
export { hienThiBangLichSu, dongHopThoaiLichSu, khoiTaoLichSu };
