/* =========================================================
   ANALYTICS.JS - TRANG THONG KE HIEU SUAT (analytics.html)
   Bieu do 12 tuan, ty le loi thuong gap, bang danh gia gan day va
   bo loc theo Thang / Quy / Nam.
   ========================================================= */

import { duLieuThongKe, loiThuongGap, danhGiaGanDay } from "../api.js";

/* =========================================================
   TRANG 05 - THONG KE HIEU SUAT
   ========================================================= */

function hienThiBieuDo12Tuan(xuHuong) {
  const oBieuDo = document.getElementById("bieuDo12Tuan");
  oBieuDo.innerHTML = "";

  let giaTriLonNhat = 0;
  for (let i = 0; i < xuHuong.length; i++) {
    if (xuHuong[i] > giaTriLonNhat) {
      giaTriLonNhat = xuHuong[i];
    }
  }

  for (let i = 0; i < xuHuong.length; i++) {
    const oNhom = document.createElement("div");
    oNhom.className = "cot-nhom";

    const oCot = document.createElement("div");
    oCot.className = "cot";
    if (i === xuHuong.length - 1) {
      oCot.classList.add("hien-tai");
    }
    oCot.style.height = Math.round((xuHuong[i] / giaTriLonNhat) * 130) + "px";

    const oNhan = document.createElement("span");
    oNhan.className = "nhan-cot";
    oNhan.textContent = "T" + (i + 1);

    oNhom.appendChild(oCot);
    oNhom.appendChild(oNhan);
    oBieuDo.appendChild(oNhom);
  }
}

function hienThiLoiThuongGap() {
  const oKhung = document.getElementById("danhSachLoi");
  oKhung.innerHTML = "";

  for (let i = 0; i < loiThuongGap.length; i++) {
    const loi = loiThuongGap[i];

    const oDong = document.createElement("div");
    oDong.className = "dong-loi";

    const oTen = document.createElement("div");
    oTen.className = "ten-loi";
    oTen.innerHTML = "<span>" + loi.ten + "</span><span>" + loi.tyLe + "%</span>";

    const oThanh = document.createElement("div");
    oThanh.className = "thanh-tien-do";
    oThanh.innerHTML = '<span style="width: ' + loi.tyLe + '%"></span>';

    oDong.appendChild(oTen);
    oDong.appendChild(oThanh);
    oKhung.appendChild(oDong);
  }
}

function hienThiBangDanhGia() {
  const oBang = document.getElementById("bangDanhGia");
  oBang.innerHTML = "";

  for (let i = 0; i < danhGiaGanDay.length; i++) {
    const d = danhGiaGanDay[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = d.ma;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = d.thietBi;

    const oDiem = document.createElement("td");
    oDiem.className = "diem-sao";
    oDiem.textContent = d.diem;

    const oNhanXet = document.createElement("td");
    oNhanXet.textContent = d.nhanXet;

    oDong.appendChild(oMa);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oDiem);
    oDong.appendChild(oNhanXet);
    oBang.appendChild(oDong);
  }
}

function chonKyThongKe(tenKy) {
  const duLieu = duLieuThongKe[tenKy];
  if (!duLieu) return;

  document.getElementById("soHoanThanhTK").textContent = duLieu.hoanThanh;
  document.getElementById("thayDoiHoanThanh").textContent = duLieu.thayDoiHoanThanh;
  document.getElementById("soThoiGianTBTK").textContent = duLieu.thoiGianTB;
  document.getElementById("thayDoiThoiGian").textContent = duLieu.thayDoiThoiGian;
  document.getElementById("soDanhGiaTK").textContent = duLieu.danhGia;
  document.getElementById("soSLATK").textContent = duLieu.dungSLA;

  const cacNut = document.querySelectorAll(".nut-che-do[data-ky]");
  for (let i = 0; i < cacNut.length; i++) {
    if (cacNut[i].getAttribute("data-ky") === tenKy) {
      cacNut[i].classList.add("dang-chon");
    } else {
      cacNut[i].classList.remove("dang-chon");
    }
  }

  hienThiBieuDo12Tuan(duLieu.xuHuong);
}

function khoiTaoThongKe() {
  chonKyThongKe("Tháng này");
  hienThiLoiThuongGap();
  hienThiBangDanhGia();

  const cacNut = document.querySelectorAll(".nut-che-do[data-ky]");
  for (let i = 0; i < cacNut.length; i++) {
    cacNut[i].addEventListener("click", function () {
      chonKyThongKe(cacNut[i].getAttribute("data-ky"));
    });
  }
}
export { khoiTaoThongKe };
