/* =========================================================
   CHECKLIST.JS - TRANG MAU CHECKLIST (checklist.html)
   Danh sach mau checklist, xem/sua/xoa tung mau va tao nhanh mot mau
   moi tu goi y theo loai thiet bi.
   ========================================================= */

import { danhSachMauChecklist, goiYBuocTheoLoai, nhomTheoLoai } from "../api.js";
import { hienThongBao } from "./utils.js";

let viTriMauDangChon = 0;

/* =========================================================
   TRANG 04 - QUAN LY CHECKLIST
   ========================================================= */

function hienThiDanhSachMau() {
  const oKhung = document.getElementById("danhSachMau");
  const oTuKhoa = document.getElementById("tuKhoaMau");
  const tuKhoa = oTuKhoa.value.toLowerCase().trim();

  const cacNhom = [];
  for (let i = 0; i < danhSachMauChecklist.length; i++) {
    const nhom = danhSachMauChecklist[i].nhom;
    if (cacNhom.indexOf(nhom) === -1) {
      cacNhom.push(nhom);
    }
  }

  oKhung.innerHTML = "";

  for (let n = 0; n < cacNhom.length; n++) {
    const nhom = cacNhom[n];
    const cacMau = [];
    for (let i = 0; i < danhSachMauChecklist.length; i++) {
      const mau = danhSachMauChecklist[i];
      const khopNhom = mau.nhom === nhom;
      const khopTuKhoa = tuKhoa === "" || mau.ten.toLowerCase().indexOf(tuKhoa) !== -1;
      if (khopNhom && khopTuKhoa) {
        cacMau.push(mau);
      }
    }
    if (cacMau.length === 0) continue;

    const oNhom = document.createElement("div");
    oNhom.className = "nhom-mau";

    const oTenNhom = document.createElement("div");
    oTenNhom.className = "ten-nhom-mau";
    oTenNhom.innerHTML = "<span>" + nhom + "</span><span>" + cacMau.length + " mẫu</span>";
    oNhom.appendChild(oTenNhom);

    for (let i = 0; i < cacMau.length; i++) {
      const mau = cacMau[i];
      const viTri = danhSachMauChecklist.indexOf(mau);

      const oMuc = document.createElement("div");
      oMuc.className = "muc-mau";
      if (viTri === viTriMauDangChon) {
        oMuc.classList.add("dang-chon");
      }

      oMuc.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2.5"/></svg>' +
        "<span>" + mau.ten + "</span>";

      oMuc.addEventListener("click", function () {
        chonMauChecklist(viTri);
      });

      oNhom.appendChild(oMuc);
    }

    oKhung.appendChild(oNhom);
  }
}

function hienThiBuocTemplate() {
  const oDanhSach = document.getElementById("danhSachBuocTemplate");
  const mau = danhSachMauChecklist[viTriMauDangChon];
  if (!mau || !oDanhSach) return;

  oDanhSach.innerHTML = "";
  for (let i = 0; i < mau.buoc.length; i++) {
    const oDong = document.createElement("li");
    oDong.className = "dong-template";

    const oKeo = document.createElement("span");
    oKeo.className = "dau-keo";
    oKeo.textContent = "⋮⋮";

    const oSo = document.createElement("span");
    oSo.className = "so-buoc";
    oSo.textContent = (i + 1);

    const oTen = document.createElement("span");
    oTen.className = "ten-buoc";
    oTen.textContent = mau.buoc[i];

    const oXoa = document.createElement("button");
    oXoa.className = "nut-nho-bieu-tuong";
    oXoa.title = "Xóa bước";
    oXoa.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
    oXoa.addEventListener("click", function () {
      mau.buoc.splice(i, 1);
      hienThiBuocTemplate();
      hienThongBao("Đã xóa một bước khỏi template.");
    });

    oDong.appendChild(oKeo);
    oDong.appendChild(oSo);
    oDong.appendChild(oTen);
    oDong.appendChild(oXoa);
    oDanhSach.appendChild(oDong);
  }
}

function chonMauChecklist(viTri) {
  viTriMauDangChon = viTri;
  document.getElementById("tenTemplate").value = danhSachMauChecklist[viTri].ten;
  hienThiDanhSachMau();
  hienThiBuocTemplate();
}

function taoChecklistBangAI() {
  const loai = document.getElementById("loaiThietBi").value;
  const trieuChung = document.getElementById("trieuChung").value.trim();

  if (trieuChung === "") {
    hienThongBao("Vui lòng nhập triệu chứng của thiết bị.");
    return;
  }

  const buocGoiY = goiYBuocTheoLoai[loai];
  const buoc = [];
  for (let i = 0; i < buocGoiY.length; i++) {
    buoc.push(buocGoiY[i]);
  }

  danhSachMauChecklist.unshift({
    nhom: nhomTheoLoai[loai],
    ten: trieuChung,
    buoc: buoc
  });

  viTriMauDangChon = 0;
  document.getElementById("tenTemplate").value = trieuChung;
  hienThiDanhSachMau();
  hienThiBuocTemplate();

  document.getElementById("khungGoiY").innerHTML =
    '<p class="dong-ai">AI đề xuất ' + buoc.length + " bước</p>" +
    '<p class="ghi-chu">' + buoc.join(" → ") + "</p>";

  hienThongBao("Đã tạo checklist cho: " + trieuChung);
}

function khoiTaoChecklist() {
  hienThiDanhSachMau();
  hienThiBuocTemplate();

  document.getElementById("tuKhoaMau").addEventListener("input", hienThiDanhSachMau);

  document.getElementById("nutThemBuocTemplate").addEventListener("click", function () {
    const tenBuoc = window.prompt("Nhập tên bước kiểm tra:");
    if (tenBuoc === null || tenBuoc.trim() === "") return;
    danhSachMauChecklist[viTriMauDangChon].buoc.push(tenBuoc.trim());
    hienThiBuocTemplate();
    hienThongBao("Đã thêm bước vào template.");
  });

  document.getElementById("nutLuuTemplate").addEventListener("click", function () {
    const tenMoi = document.getElementById("tenTemplate").value.trim();
    if (tenMoi === "") {
      hienThongBao("Tên template không được để trống.");
      return;
    }
    danhSachMauChecklist[viTriMauDangChon].ten = tenMoi;
    hienThiDanhSachMau();
    hienThongBao("Đã lưu thay đổi template.");
  });

  document.getElementById("nutXoaTemplate").addEventListener("click", function () {
    const dongY = window.confirm("Bạn có chắc muốn xóa template này?");
    if (!dongY) return;

    danhSachMauChecklist.splice(viTriMauDangChon, 1);
    if (viTriMauDangChon >= danhSachMauChecklist.length) {
      viTriMauDangChon = 0;
    }

    if (danhSachMauChecklist.length === 0) {
      document.getElementById("tenTemplate").value = "";
      document.getElementById("danhSachBuocTemplate").innerHTML = "";
    } else {
      document.getElementById("tenTemplate").value = danhSachMauChecklist[viTriMauDangChon].ten;
      hienThiBuocTemplate();
    }
    hienThiDanhSachMau();
    hienThongBao("Đã xóa template.");
  });

  document.getElementById("nutTaoChecklistAI").addEventListener("click", taoChecklistBangAI);

  document.getElementById("nutDongAI").addEventListener("click", function () {
    document.getElementById("khungTaoAI").style.display = "none";
    hienThongBao("Đã đóng khung tạo checklist AI.");
  });

  document.getElementById("nutMoTaoAI").addEventListener("click", function () {
    document.getElementById("khungTaoAI").style.display = "block";
  });
}
export { hienThiDanhSachMau, khoiTaoChecklist };
