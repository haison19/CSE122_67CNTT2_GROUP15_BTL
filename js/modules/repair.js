/* =========================================================
   REPAIR.JS - TRANG DANG SUA (fixing.html)
   Giu trang thai ticket dang sua, ve checklist xu ly, dem thoi gian,
   luu ghi chu, tam dung va hoan thanh ticket.
   Trang thai trong file nay duoc module ai-suggestion.js dung chung.
   ========================================================= */

import {
  CHECKLIST_MAC_DINH,
  danhSachTicketHangDoi,
  goiYBuocTheoLoai,
  layTicketTheoMa,
  docTicketDangXuLy,
  docDuLieuTicket,
  luuDuLieuTicket
} from "../api.js";
import { hienThongBao, layLopMucDo } from "./utils.js";

let danhSachBuocChecklist = [];

const THOI_GIAN_XU_LY_BAN_DAU = 1 * 3600 + 24 * 60 + 18;

let maTicketDangSua = "TK-2025-001";
let duLieuTicketDangSua = null;
let dongHoXuLy = null;

function saoChepChecklist(danhSachGoc) {
  const ketQua = [];
  for (let i = 0; i < danhSachGoc.length; i++) {
    ketQua.push({ ten: danhSachGoc[i].ten, xong: danhSachGoc[i].xong });
  }
  return ketQua;
}

function taoDuLieuTicketMacDinh(ticket) {
  // Goi y AI sinh theo tung ticket (quy tac mo phong trong generateChecklist)
  const goiYDeXuat = ticket ? generateChecklist(ticket) : saoChepChecklist(CHECKLIST_MAC_DINH);

  const tenGoiY = [];
  for (let i = 0; i < goiYDeXuat.length; i++) {
    tenGoiY.push(goiYDeXuat[i].ten);
  }

  // Ticket binh thuong: checklist bat dau trong de nguoi dung chu dong bam
  // "Chap nhan" dua goi y AI vao hoac tu "Them buoc".
  // Ticket da hoan thanh tu truoc (khong co du lieu luu): nap san va danh dau xong het.
  let checklistBanDau = [];
  if (ticket === null) {
    checklistBanDau = saoChepChecklist(CHECKLIST_MAC_DINH);
  } else if (ticket.trangThai === "Hoàn thành") {
    for (let i = 0; i < tenGoiY.length; i++) {
      checklistBanDau.push({ ten: tenGoiY[i], xong: true });
    }
  }

  return {
    
    trangThai: ticket ? ticket.trangThai : "Đang xử lý",
    statusCode: ticket && ticket.trangThai === "Hoàn thành" ? "completed" : "in_progress",
    ghiChu: "",
    checklist: checklistBanDau,
    batDau: Date.now() - THOI_GIAN_XU_LY_BAN_DAU * 1000,
    giayDaXuLy: 0,
    thoiDiemHoanThanh: "",
    thoiGianXuLy: 0,
    goiYAI: tenGoiY,
    soLanTaoLai: 0,
    trangThaiGoiYAI: "moi"
  };
}

function daHoanThanh() {
  return duLieuTicketDangSua !== null &&
    (duLieuTicketDangSua.trangThai === "Hoàn thành" || duLieuTicketDangSua.statusCode === "completed");
}

function generateChecklist(ticket) {
  const tenSuCo = (ticket.tenSuCo || "").toLowerCase();
  const maThietBi = (ticket.maThietBi || "").toUpperCase();
  let danhSach = null;

  if (tenSuCo.indexOf("máy lạnh") !== -1 || maThietBi.indexOf("AC-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và chế độ làm lạnh", "Kiểm tra bộ lọc gió", "Kiểm tra dàn nóng và dàn lạnh", "Kiểm tra tình trạng gas lạnh", "Chạy thử máy và xác nhận khả năng làm mát"];
  } else if (tenSuCo.indexOf("router") !== -1 || maThietBi.indexOf("RT-") === 0) {
    danhSach = ["Kiểm tra nguồn điện", "Kiểm tra cáp mạng và đèn tín hiệu WAN", "Kiểm tra kết nối giữa router và modem", "Kiểm tra cấu hình mạng", "Thử kết nối lại sau khi xử lý"];
  } else if (tenSuCo.indexOf("máy in") !== -1 || maThietBi.indexOf("PR-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và trạng thái máy in", "Kiểm tra cáp hoặc kết nối Wi-Fi", "Kiểm tra hàng đợi in", "Kiểm tra driver và cấu hình máy in", "In thử để xác nhận hoạt động"];
  } else if (tenSuCo.indexOf("máy tính") !== -1 || maThietBi.indexOf("PC-") === 0) {
    danhSach = ["Kiểm tra nguồn điện và dây kết nối", "Kiểm tra bộ sạc hoặc nguồn máy", "Kiểm tra dấu hiệu khởi động", "Kiểm tra các thành phần phần cứng cơ bản", "Khởi động thử để xác nhận kết quả"];
  }

  if (danhSach === null) {
    danhSach = ["Xác nhận tình trạng thiết bị", "Kiểm tra nguồn điện và kết nối", "Kiểm tra các bộ phận liên quan", "Thực hiện xử lý phù hợp", "Chạy thử và ghi nhận kết quả"];
  }

  const ketQua = [];
  for (let i = 0; i < danhSach.length; i++) {
    ketQua.push({ ten: danhSach[i], xong: false });
  }
  return ketQua;
}

function danhDauDaNhanTicket() {
  if (duLieuTicketDangSua === null) return;
  if (daHoanThanh()) return;
  if (duLieuTicketDangSua.trangThai !== "Chờ nhận") return;

  duLieuTicketDangSua.trangThai = "Đang xử lý";
  duLieuTicketDangSua.statusCode = "in_progress";
  capNhatNhanTrangThai();
}

function luuDuLieuDangSua() {
  if (duLieuTicketDangSua === null) return;
  danhDauDaNhanTicket();
  duLieuTicketDangSua.checklist = danhSachBuocChecklist;
  if (duLieuTicketDangSua.trangThai === "Hoàn thành") {
    duLieuTicketDangSua.statusCode = "completed";
  } else if (duLieuTicketDangSua.trangThai === "Đang xử lý") {
    duLieuTicketDangSua.statusCode = "in_progress";
  }
  luuDuLieuTicket(maTicketDangSua, duLieuTicketDangSua);
}

function kiemTraBuocDaCo(tenBuoc) {
  const tenThuong = tenBuoc.trim().toLowerCase();
  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].ten.trim().toLowerCase() === tenThuong) {
      return true;
    }
  }
  return false;
}

function hienThiChecklistXuLy() {
  const oDanhSach = document.getElementById("danhSachBuocXuLy");
  if (!oDanhSach) return;

  oDanhSach.innerHTML = "";
  const oLoi = document.getElementById("loiChecklist");
  if (oLoi && danhSachBuocChecklist.length > 0) {
    oLoi.hidden = true;
  }

  if (danhSachBuocChecklist.length === 0) {
    const oTrong = document.createElement("li");
    oTrong.className = "thong-diep-trong";
    oTrong.textContent = 'Checklist đang trống. Bấm "Thêm bước" để tạo bước kiểm tra.';
    oDanhSach.appendChild(oTrong);
  }

  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    const buoc = danhSachBuocChecklist[i];

    const oDong = document.createElement("li");
    oDong.className = "dong-buoc";
    if (buoc.xong) {
      oDong.classList.add("da-xong");
    }

    const oChon = document.createElement("input");
    oChon.type = "checkbox";
    oChon.checked = buoc.xong;
    oChon.disabled = daHoanThanh();
    oChon.title = "Đánh dấu bước đã hoàn thành";
    oChon.addEventListener("change", function () {
      buoc.xong = oChon.checked;
      tiepTucNeuDangTamDung();
      luuDuLieuDangSua();
      hienThiChecklistXuLy();
      if (buoc.xong) {
        hienThongBao("Đã xong: " + buoc.ten);
      } else {
        hienThongBao("Đã bỏ đánh dấu: " + buoc.ten);
      }
    });

    const oTen = document.createElement("span");
    oTen.className = "ten-buoc";
    oTen.textContent = buoc.ten;

    oDong.appendChild(oChon);
    oDong.appendChild(oTen);

    // Ticket da hoan thanh thi chi de xem, khong sua/xoa duoc nua
    if (!daHoanThanh()) {
      const oSua = document.createElement("button");
      oSua.className = "nut-nho-bieu-tuong";
      oSua.title = "Sửa tên bước";
      oSua.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
      oSua.addEventListener("click", function () {
        const tenMoi = window.prompt("Nhập tên mới cho bước này:", buoc.ten);
        if (tenMoi === null) return;
        if (tenMoi.trim() === "") {
          hienThongBao("Tên bước không được để trống.");
          return;
        }
        buoc.ten = tenMoi.trim();
        luuDuLieuDangSua();
        hienThiChecklistXuLy();
        hienThongBao("Đã sửa tên bước kiểm tra.");
      });

      const oXoa = document.createElement("button");
      oXoa.className = "nut-nho-bieu-tuong";
      oXoa.title = "Xóa bước";
      oXoa.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
      oXoa.addEventListener("click", function () {
        const dongY = window.confirm('Xóa bước "' + buoc.ten + '" khỏi checklist?');
        if (!dongY) return;
        danhSachBuocChecklist.splice(i, 1);
        luuDuLieuDangSua();
        hienThiChecklistXuLy();
        hienThongBao("Đã xóa một bước kiểm tra.");
      });

      oDong.appendChild(oSua);
      oDong.appendChild(oXoa);
    }

    oDanhSach.appendChild(oDong);
  }

  capNhatTienDoXuLy();
  capNhatTrangThaiNut();
}

function capNhatTrangThaiNut() {
  const daXong = daHoanThanh();
  const cacNut = ["nutThemBuoc", "nutChapNhan", "nutTaoLai", "nutTuChoiChecklist",
                  "nutSuaChecklist", "nutDungThuCong", "nutTamDung", "nutHoanThanh",
                  "nutLuuGhiChu"];

  for (let i = 0; i < cacNut.length; i++) {
    const oNut = document.getElementById(cacNut[i]);
    if (oNut) {
      oNut.disabled = daXong;
    }
  }

  // Ghi chu da duoc chot luc hoan thanh thi khong cho sua nua
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    oGhiChu.disabled = daXong;
  }

  const oHoanThanh = document.getElementById("nutHoanThanh");
  if (oHoanThanh) {
    oHoanThanh.textContent = daXong ? "Đã hoàn thành" : "Hoàn thành";
  }
}

function capNhatTienDoXuLy() {
  const tong = danhSachBuocChecklist.length;
  let soDaXong = 0;

  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].xong) {
      soDaXong = soDaXong + 1;
    }
  }

  let phanTram = 0;
  if (tong > 0) {
    phanTram = Math.round((soDaXong / tong) * 100);
  }

  const oSoTienDo = document.getElementById("soTienDo");
  if (oSoTienDo) {
    oSoTienDo.textContent = soDaXong + "/" + tong;
  }

  const oPhanTram = document.getElementById("phanTramChecklist");
  if (oPhanTram) {
    oPhanTram.textContent = phanTram + "% checklist";
  }

  // Vong tron tien do ve bang conic-gradient, khong can canvas
  const oVongTienDo = document.getElementById("vongTienDo");
  if (oVongTienDo) {
    oVongTienDo.style.background =
      "conic-gradient(var(--mau-xanh) 0% " + phanTram + "%, #dce6f8 " + phanTram + "% 100%)";
  }

  // Lam xong het thi an dong nhac loi checklist
  const oLoi = document.getElementById("loiChecklist");
  if (oLoi && tong > 0 && soDaXong === tong) {
    oLoi.hidden = true;
  }
}

function layGiayDaXuLy() {
  if (duLieuTicketDangSua === null) return 0;
  if (duLieuTicketDangSua.trangThai === "Tạm dừng" || daHoanThanh()) {
    return duLieuTicketDangSua.giayDaXuLy || 0;
  }
  if (!duLieuTicketDangSua.batDau) return 0;

  const giay = Math.floor((Date.now() - duLieuTicketDangSua.batDau) / 1000);
  if (giay < 0) return 0;
  return giay;
}

function dinhDangDongHo(tongGiay) {
  const gio = Math.floor(tongGiay / 3600);
  const phut = Math.floor((tongGiay % 3600) / 60);
  const giay = tongGiay % 60;

  const chuoiGio = (gio < 10 ? "0" : "") + gio;
  const chuoiPhut = (phut < 10 ? "0" : "") + phut;
  const chuoiGiay = (giay < 10 ? "0" : "") + giay;
  return chuoiGio + ":" + chuoiPhut + ":" + chuoiGiay;
}

function capNhatDongHo() {
  const oDongHo = document.getElementById("thoiGianDaXuLy");
  if (!oDongHo) return;
  oDongHo.textContent = dinhDangDongHo(layGiayDaXuLy());
}

function dungDongHoXuLy() {
  if (dongHoXuLy !== null) {
    clearInterval(dongHoXuLy);
    dongHoXuLy = null;
  }
}

function chayDongHoXuLy() {
  dungDongHoXuLy();
  capNhatDongHo();

  // Ticket da hoan thanh hoac dang tam dung thi khong dem thoi gian nua
  if (daHoanThanh()) return;
  if (duLieuTicketDangSua !== null && duLieuTicketDangSua.trangThai === "Tạm dừng") return;

  dongHoXuLy = setInterval(capNhatDongHo, 1000);
}

function tinhSoGioXuLy() {
  const gio = Math.round((layGiayDaXuLy() / 3600) * 10) / 10;
  if (gio < 0.1) return 0.1;
  return gio;
}

function capNhatNhanTrangThai() {
  const oNhan = document.getElementById("nhanMucDoDangSua");
  const ticket = layTicketTheoMa(maTicketDangSua);
  if (!oNhan || duLieuTicketDangSua === null || ticket === null) return;

  ticket.trangThai = duLieuTicketDangSua.trangThai;
  ticket.statusCode = duLieuTicketDangSua.statusCode ||
    (ticket.trangThai === "Hoàn thành" ? "completed" : "in_progress");
  oNhan.textContent = duLieuTicketDangSua.trangThai;
  oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
}

// Dang tam dung ma nguoi dung thao tac tiep thi tu dong tiep tuc dem gio
function tiepTucNeuDangTamDung() {
  if (duLieuTicketDangSua === null) return;
  if (duLieuTicketDangSua.trangThai !== "Tạm dừng") return;

  duLieuTicketDangSua.trangThai = "Đang xử lý";
  duLieuTicketDangSua.batDau = Date.now() - (duLieuTicketDangSua.giayDaXuLy || 0) * 1000;
  capNhatNhanTrangThai();
  chayDongHoXuLy();
}

function hienThiLichSuThietBi(maThietBi) {
  const oDanhSach = document.getElementById("lichSuThietBi");
  if (!oDanhSach) return;

  oDanhSach.innerHTML = "";
  const tienToThietBi = maThietBi.substring(0, 2);
  let soDong = 0;

  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    const ticketCu = danhSachTicketHangDoi[i];
    const cungLoaiThietBi = ticketCu.maThietBi.substring(0, 2) === tienToThietBi;
    if (cungLoaiThietBi === false || ticketCu.trangThai !== "Hoàn thành") {
      continue;
    }

    const oDong = document.createElement("li");
    oDong.textContent = ticketCu.ma + " · " + ticketCu.tenSuCo + " (" + ticketCu.thongTinThoiGian + ")";
    oDanhSach.appendChild(oDong);
    soDong = soDong + 1;
  }

  if (soDong === 0) {
    const oDong = document.createElement("li");
    oDong.textContent = "Chưa có lịch sử sửa chữa cho thiết bị này.";
    oDanhSach.appendChild(oDong);
  }
}

function capNhatThongTinDangSua(ticket) {
  // Tieu de tab trinh duyet
  document.title = "FixFlow · Đang sửa · " + ticket.ma;

  // Duong dan, tieu de trang va dong phu de
  document.getElementById("duongDanMa").textContent = ticket.ma;
  document.getElementById("tieuDeDangSua").textContent = ticket.tenSuCo;
  document.getElementById("phuDeDangSua").textContent =
    ticket.ma + " · " + ticket.maThietBi + " · Ưu tiên " + ticket.mucDo.toLowerCase();

  // The "Thong tin su co"
  document.getElementById("viTriSuCo").textContent = ticket.diaDiem;
  document.getElementById("thietBiSuCo").textContent = ticket.maThietBi;
  document.getElementById("nguoiYeuCauSuCo").textContent = ticket.nguoiYeuCau;
  document.getElementById("moTaSuCo").textContent = ticket.moTa;

  // Tieu de khoi lich su va danh sach lich su cua thiet bi tuong ung
  document.getElementById("tieuDeLichSuThietBi").textContent = "Lịch sử thiết bị " + ticket.maThietBi;
  hienThiLichSuThietBi(ticket.maThietBi);

  // Nhan trang thai / muc do o goc phai tieu de (doi ca mau theo muc do)
  const oNhan = document.getElementById("nhanMucDoDangSua");
  if (oNhan) {
    oNhan.textContent = ticket.trangThai;
    oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
  }
}

function capNhatTrangThaiGhiChu(noiDung) {
  const oTrangThai = document.getElementById("trangThaiGhiChu");
  if (oTrangThai) {
    oTrangThai.textContent = noiDung;
  }
}

function luuGhiChu() {
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (!oGhiChu || duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, ghi chú đã được chốt.");
    return;
  }

  duLieuTicketDangSua.ghiChu = oGhiChu.value.trim();
  luuDuLieuDangSua();
  capNhatTrangThaiGhiChu("Đã lưu lúc " + new Date().toLocaleTimeString("vi-VN"));
  hienThongBao("Đã lưu ghi chú cho ticket " + maTicketDangSua + ".");
}

function tamDungXuLy() {
  if (duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket đã hoàn thành, không thể tạm dừng.");
    return;
  }
  if (duLieuTicketDangSua.trangThai === "Tạm dừng") {
    hienThongBao("Ticket đang ở trạng thái tạm dừng. Đánh dấu một bước để làm tiếp.");
    return;
  }

  const dongY = window.confirm(
    "Tạm dừng xử lý ticket " + maTicketDangSua + "?\n" +
    "Tiến độ checklist vẫn được giữ lại để làm tiếp sau."
  );
  if (!dongY) return;

  // Luu so giay da lam viec roi dung dong ho lai
  duLieuTicketDangSua.giayDaXuLy = layGiayDaXuLy();
  duLieuTicketDangSua.batDau = 0;
  duLieuTicketDangSua.trangThai = "Tạm dừng";

  // Luu ghi chu dang go tren o nhap (neu co) de khong bi mat
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    duLieuTicketDangSua.ghiChu = oGhiChu.value.trim();
  }

  luuDuLieuDangSua();
  dungDongHoXuLy();
  capNhatDongHo();
  capNhatNhanTrangThai();
  hienThongBao("Đã tạm dừng ticket " + maTicketDangSua + ". Tiến độ được giữ nguyên.");
}

function hoanThanhXuLy() {
  if (duLieuTicketDangSua === null) return;

  if (daHoanThanh()) {
    hienThongBao("Ticket " + maTicketDangSua + " đã được hoàn thành trước đó.");
    return;
  }

  // Dieu kien 1: checklist phai co it nhat mot buoc
  if (danhSachBuocChecklist.length === 0) {
    const oLoi = document.getElementById("loiChecklist");
    if (oLoi) {
      oLoi.textContent = "Checklist chưa có bước nào. Hãy thêm bước trước khi hoàn thành.";
      oLoi.hidden = false;
    }
    hienThongBao("Chưa thể hoàn thành: checklist đang trống.");
    return;
  }

  // Dieu kien 2: khong cho phep hoan thanh lai neu da hoan thanh
  // (daHoanThanh() duoc kiem tra o dau ham, nhung kiem tra lai de phong ngu
  //  truong hop trang thai thay doi giua khi nguoi dung giu nut bam)
  if (daHoanThanh()) {
    hienThongBao("Ticket " + maTicketDangSua + " đã được hoàn thành trước đó.");
    return;
  }

  // Dieu kien 2: tat ca cac buoc phai duoc danh dau da xong
  let soChuaXong = 0;
  for (let i = 0; i < danhSachBuocChecklist.length; i++) {
    if (danhSachBuocChecklist[i].xong === false) {
      soChuaXong = soChuaXong + 1;
    }
  }

  if (soChuaXong > 0) {
    const oLoi = document.getElementById("loiChecklist");
    if (oLoi) {
      oLoi.textContent = "Còn " + soChuaXong + "/" + danhSachBuocChecklist.length +
        " bước chưa hoàn thành. Hãy làm xong hết checklist trước khi bấm Hoàn thành.";
      oLoi.hidden = false;
    }
    hienThongBao("Chưa thể hoàn thành: còn " + soChuaXong + " bước chưa xong.");
    return;
  }

  const oGhiChu = document.getElementById("ghiChuSuaChua");
  const ghiChuHienTai = oGhiChu ? oGhiChu.value.trim() : (duLieuTicketDangSua.ghiChu || "");

  const dongY = window.confirm(
    "Hoàn thành ticket " + maTicketDangSua + "?\n" +
    "Thời gian xử lý: " + dinhDangDongHo(layGiayDaXuLy()) + "\n" +
    "Sau khi hoàn thành, ticket sẽ được ghi vào Lịch sử sửa chữa."
  );
  if (!dongY) return;

  // Chot so lieu truoc khi doi trang thai
  duLieuTicketDangSua.giayDaXuLy = layGiayDaXuLy();
  duLieuTicketDangSua.thoiGianXuLy = tinhSoGioXuLy();
  duLieuTicketDangSua.ghiChu = ghiChuHienTai;
  duLieuTicketDangSua.thoiDiemHoanThanh = new Date().toLocaleString("vi-VN");
  duLieuTicketDangSua.trangThai = "Hoàn thành";
  duLieuTicketDangSua.statusCode = "completed";
  duLieuTicketDangSua.batDau = 0;

  luuDuLieuDangSua();
  dungDongHoXuLy();
  capNhatDongHo();
  capNhatNhanTrangThai();
  // Ve lai checklist de checkbox va bieu tuong sua-xoa bi khoa ngay, khong doi tai trang
  hienThiChecklistXuLy();
  capNhatTrangThaiGhiChu("Đã chốt ghi chú khi hoàn thành");
  hienThongBao("Đã hoàn thành ticket " + maTicketDangSua + ". Đang mở Lịch sử sửa chữa…");

  // Cho nguoi dung kip doc thong bao roi moi chuyen trang
  setTimeout(function () {
    window.location.href = "history.html";
  }, 900);
}

function khoiTaoDangSua() {
  // Ưu tiên mã trên URL, sau đó mới dùng ticket đã lưu từ trang Hàng đợi.
  const maTrenUrl = new URLSearchParams(window.location.search).get("ticket");
  const ticketDaLuu = docTicketDangXuLy();
  const maDuocChon = maTrenUrl || (ticketDaLuu ? ticketDaLuu.ma : "TK-2025-001");
  const ticketDangXuLy = layTicketTheoMa(maDuocChon);

  if (ticketDangXuLy === null) {
    maTicketDangSua = maDuocChon;
    const oTieuDe = document.getElementById("tieuDeDangSua");
    const oMoTa = document.getElementById("moTaSuCo");
    if (oTieuDe) oTieuDe.textContent = "Không tìm thấy ticket";
    if (oMoTa) oMoTa.textContent = "Mã ticket không hợp lệ hoặc ticket không còn tồn tại.";
    hienThongBao("Không tìm thấy ticket: " + maDuocChon);
    return;
  }

  maTicketDangSua = ticketDangXuLy.ma;
  capNhatThongTinDangSua(ticketDangXuLy);
  hienThongBao("Đang xử lý: " + ticketDangXuLy.ma + " · " + ticketDangXuLy.maThietBi);

  // Nap du lieu da luu cua ticket (checklist, ghi chu, trang thai, dong ho)
  duLieuTicketDangSua = docDuLieuTicket(maTicketDangSua);
  if (duLieuTicketDangSua === null) {
    duLieuTicketDangSua = taoDuLieuTicketMacDinh(ticketDangXuLy);
    luuDuLieuTicket(maTicketDangSua, duLieuTicketDangSua);
  }
  if (!duLieuTicketDangSua.statusCode) {
    duLieuTicketDangSua.statusCode = duLieuTicketDangSua.trangThai === "Hoàn thành" ? "completed" : "in_progress";
  }

  danhSachBuocChecklist = duLieuTicketDangSua.checklist;
  if (!Array.isArray(danhSachBuocChecklist)) {
    danhSachBuocChecklist = saoChepChecklist(CHECKLIST_MAC_DINH);
    duLieuTicketDangSua.checklist = danhSachBuocChecklist;
  }

  // O ghi chu: nap noi dung da luu va bao "co thay doi chua luu" khi go
  const oGhiChu = document.getElementById("ghiChuSuaChua");
  if (oGhiChu) {
    oGhiChu.value = duLieuTicketDangSua.ghiChu || "";
    oGhiChu.addEventListener("input", function () {
      capNhatTrangThaiGhiChu("Có thay đổi chưa lưu");
    });
  }

  // Vao trang Dang sua tuc la ticket da duoc nhan: bo trang thai "Chờ nhận" va luu lai
  if (!daHoanThanh()) {
    danhDauDaNhanTicket();
  }
  luuDuLieuDangSua();
  capNhatNhanTrangThai();
  hienThiChecklistXuLy();
  // Khoi goi y AI duoc ve boi modules/ai-suggestion.js (ham khoiTaoGoiYAI)
  chayDongHoXuLy();

  if (duLieuTicketDangSua.ghiChu) {
    capNhatTrangThaiGhiChu("Đã lưu ghi chú");
  }

  // Gan su kien cho cac nut cua khoi ghi chu / tam dung / hoan thanh.
  // 6 nut cua khoi goi y AI do modules/ai-suggestion.js gan su kien (ham khoiTaoGoiYAI).
  document.getElementById("nutLuuGhiChu").addEventListener("click", luuGhiChu);
  document.getElementById("nutTamDung").addEventListener("click", tamDungXuLy);
  document.getElementById("nutHoanThanh").addEventListener("click", hoanThanhXuLy);
}

export {
  maTicketDangSua,
  duLieuTicketDangSua,
  danhSachBuocChecklist,
  generateChecklist,
  daHoanThanh,
  kiemTraBuocDaCo,
  luuDuLieuDangSua,
  hienThiChecklistXuLy,
  tiepTucNeuDangTamDung,
  khoiTaoDangSua
};
