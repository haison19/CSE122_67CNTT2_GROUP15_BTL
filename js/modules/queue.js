/* =========================================================
   QUEUE.JS - TRANG HANG DOI CONG VIEC (queue.html)
   Loc/tim ticket, ve bang Kanban hoac danh sach, nhan viec,
   tu choi ticket va chuyen sang trang Dang sua.
   ========================================================= */

import { danhSachTicketHangDoi, luuTicketDangXuLy } from "../api.js";
import { hienThongBao, layLopMucDo } from "./utils.js";

// TRANG 01: HANG DOI

let ticketDangChonHangDoi = null;

/* =========================================================
   TRANG 01 - HANG DOI CONG VIEC
   ========================================================= */

// CHỨC NĂNG 1: Tìm kiếm và lọc ticket theo từ khóa, danh mục và mức độ ưu tiên
function layHangDoiDaLoc() {
  const oTuKhoa = document.getElementById("tuKhoaHangDoi");
  const oDanhMuc = document.getElementById("locDanhMuc");
  const oUuTien = document.getElementById("locUuTien");

  const tuKhoa = oTuKhoa.value.toLowerCase().trim();
  const danhMuc = oDanhMuc.value;
  const uuTien = oUuTien.value;

  const ketQua = [];
  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    const ticket = danhSachTicketHangDoi[i];
    const chuoiTim = (ticket.ma + " " + ticket.tenSuCo + " " + ticket.maThietBi + " " + ticket.diaDiem).toLowerCase();

    const khopTuKhoa = tuKhoa === "" || chuoiTim.indexOf(tuKhoa) !== -1;
    const khopDanhMuc = danhMuc === "" || ticket.danhMuc === danhMuc;
    const khopUuTien = uuTien === "" || ticket.mucDo === uuTien;

    if (khopTuKhoa && khopDanhMuc && khopUuTien) {
      ketQua.push(ticket);
    }
  }
  return ketQua;
}

// CHỨC NĂNG 2: Tạo thẻ ticket hiển thị thông tin và nút thao tác
function taoTheTicketHangDoi(ticket) {
  const the = document.createElement("div");
  the.className = "the-ticket";

  const oDongTren = document.createElement("div");
  oDongTren.className = "dong-giua";

  const oMa = document.createElement("span");
  oMa.className = "ma-ticket";
  oMa.textContent = ticket.ma;

  const oMucDo = document.createElement("span");
  oMucDo.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
  oMucDo.textContent = ticket.mucDo;

  oDongTren.appendChild(oMa);
  oDongTren.appendChild(oMucDo);

  const oTen = document.createElement("p");
  oTen.className = "ten-ticket";
  oTen.textContent = ticket.tenSuCo;

  const oThietBi = document.createElement("p");
  oThietBi.className = "thiet-bi-ticket";
  oThietBi.textContent = ticket.maThietBi + " · " + ticket.diaDiem;

  const oDongDuoi = document.createElement("div");
  oDongDuoi.className = "dong-duoi-ticket";

  const oNguoi = document.createElement("span");
  oNguoi.className = "nguoi-yeu-cau";
  oNguoi.textContent = ticket.nguoiYeuCau;

  const oThoiGian = document.createElement("span");
  oThoiGian.className = "thoi-gian-con";
  if (ticket.gioConLai < 2) {
    oThoiGian.classList.add("canh-bao");
  }
  oThoiGian.textContent = ticket.thongTinThoiGian;

  oDongDuoi.appendChild(oNguoi);
  oDongDuoi.appendChild(oThoiGian);

  const oNut = document.createElement("button");
  oNut.className = "nut-chinh nut-nho";
  if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
    oNut.textContent = "Tiếp tục";
  } else if (ticket.trangThai === "Hoàn thành") {
    oNut.className = "nut-phu nut-nho";
    oNut.textContent = "Xem chi tiết";
  } else {
    oNut.textContent = "Nhận việc";
  }
  oNut.addEventListener("click", function (suKien) {
    suKien.stopPropagation();
    xuLyNutHangDoi(ticket);
  });

  the.appendChild(oDongTren);
  the.appendChild(oTen);
  the.appendChild(oThietBi);
  the.appendChild(oDongDuoi);
  the.appendChild(oNut);

  the.addEventListener("click", function () {
    moChiTietHangDoi(ticket);
  });

  return the;
}

// CHỨC NĂNG 3: Hiển thị ticket theo trạng thái và cập nhật số lượng từng cột
function hienThiHangDoi() {
  const danhSach = layHangDoiDaLoc();

  const oChoNhan = document.getElementById("cotChoNhan");
  const oDangXuLy = document.getElementById("cotDangXuLy");
  const oHoanThanh = document.getElementById("cotHoanThanh");

  oChoNhan.innerHTML = "";
  oDangXuLy.innerHTML = "";
  oHoanThanh.innerHTML = "";

  let soCho = 0;
  let soDang = 0;
  let soXong = 0;

  for (let i = 0; i < danhSach.length; i++) {
    const ticket = danhSach[i];
    const the = taoTheTicketHangDoi(ticket);

    if (ticket.trangThai === "Chờ nhận") {
      oChoNhan.appendChild(the);
      soCho = soCho + 1;
    } else if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
      // "Tạm dừng" vẫn là ticket đang làm, không được đếm vào cột Hoàn thành
      oDangXuLy.appendChild(the);
      soDang = soDang + 1;
    } else {
      oHoanThanh.appendChild(the);
      soXong = soXong + 1;
    }
  }

  if (soCho === 0) oChoNhan.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';
  if (soDang === 0) oDangXuLy.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';
  if (soXong === 0) oHoanThanh.innerHTML = '<p class="thong-diep-trong">Không có ticket.</p>';

  document.getElementById("soChoNhanCot").textContent = soCho;
  document.getElementById("soDangXuLyCot").textContent = soDang;
  document.getElementById("soHoanThanhCot").textContent = soXong;
  document.getElementById("phuDeHangDoi").textContent = (soCho + soDang) + " ticket cần ưu tiên hôm nay";

  hienThiBangHangDoi(danhSach);
}

// CHỨC NĂNG 4: Hiển thị danh sách ticket dưới dạng bảng
function hienThiBangHangDoi(danhSach) {
  const oBang = document.getElementById("bangHangDoi");
  if (!oBang) return;

  oBang.innerHTML = "";
  for (let i = 0; i < danhSach.length; i++) {
    const ticket = danhSach[i];
    const oDong = document.createElement("tr");

    const oMa = document.createElement("td");
    oMa.className = "ma-ticket";
    oMa.textContent = ticket.ma;

    const oTen = document.createElement("td");
    oTen.textContent = ticket.tenSuCo;

    const oThietBi = document.createElement("td");
    oThietBi.textContent = ticket.maThietBi + " · " + ticket.diaDiem;

    const oMucDo = document.createElement("td");
    const oNhan = document.createElement("span");
    oNhan.className = "the-muc-do " + layLopMucDo(ticket.mucDo);
    oNhan.textContent = ticket.mucDo;
    oMucDo.appendChild(oNhan);

    const oThoiGian = document.createElement("td");
    oThoiGian.textContent = ticket.thongTinThoiGian;

    const oTrangThai = document.createElement("td");
    oTrangThai.textContent = ticket.trangThai;

    const oXem = document.createElement("td");
    const oLienKet = document.createElement("span");
    oLienKet.className = "lien-ket-xem";
    oLienKet.textContent = "Xem";
    oLienKet.addEventListener("click", function () {
      moChiTietHangDoi(ticket);
    });
    oXem.appendChild(oLienKet);

    oDong.appendChild(oMa);
    oDong.appendChild(oTen);
    oDong.appendChild(oThietBi);
    oDong.appendChild(oMucDo);
    oDong.appendChild(oThoiGian);
    oDong.appendChild(oTrangThai);
    oDong.appendChild(oXem);
    oBang.appendChild(oDong);
  }

  const oSoDong = document.getElementById("soDongBang");
  if (oSoDong) {
    oSoDong.textContent = danhSach.length + " ticket";
  }
}

// CHỨC NĂNG 5: Mở khung chi tiết của ticket được chọn
function moChiTietHangDoi(ticket) {
  ticketDangChonHangDoi = ticket;
  const oKhung = document.getElementById("khungChiTiet");
  if (!oKhung) return;

  let html = "";
  const daXong = ticket.trangThai === "Hoàn thành";
  html += '<span class="the-muc-do muc-trung-binh mau-ticket-lon">' + ticket.ma + "</span>";
  html += '<h3 class="tieu-de-ct">' + ticket.tenSuCo + "</h3>";
  html += '<p class="mo-ta-ct">' + ticket.moTa + "</p>";
  html += '<div class="dong-ct"><span>Thiết bị</span><strong>' + ticket.maThietBi + "</strong></div>";
  html += '<div class="dong-ct"><span>Vị trí</span><strong>' + ticket.diaDiem + "</strong></div>";
  html += '<div class="dong-ct"><span>Người yêu cầu</span><strong>' + ticket.nguoiYeuCau + "</strong></div>";
  html += '<div class="dong-ct"><span>SLA</span><strong class="chu-canh-bao">' + ticket.thongTinThoiGian + "</strong></div>";
  if (daXong) {
    html += '<p class="ghi-chu" style="margin-top:18px">Ticket đã hoàn thành, chỉ có thể xem lại.</p>';
  } else {
    html += '<button class="nut-chinh" id="nutBatDauXuLy" style="width:100%;margin-top:18px">▶ Bắt đầu xử lý</button>';
  }
  html += '<button class="nut-phu" id="nutTuChoi" style="width:100%;margin-top:10px">✕ Từ chối</button>';
  html += '<label class="nhan-nhap" for="lyDoTuChoi">Lý do từ chối</label>';
  html += '<select class="o-chon o-dong" id="lyDoTuChoi">';
  html += '<option value="">Chọn lý do...</option>';
  html += "<option>Không thuộc chuyên môn</option>";
  html += "<option>Thiếu thiết bị phụ trợ</option>";
  html += "<option>Đã có người khác xử lý</option>";
  html += "<option>Khác</option>";
  html += "</select>";

  oKhung.innerHTML = html;

  const oNutBatDau = document.getElementById("nutBatDauXuLy");
  if (oNutBatDau) {
    oNutBatDau.addEventListener("click", function () {
      batDauXuLy(ticket);
    });
  }
  const oNutTuChoi = document.getElementById("nutTuChoi");
  if (oNutTuChoi) {
    oNutTuChoi.addEventListener("click", function () {
      tuChoiTicket(ticket);
    });
  }
}

// CHỨC NĂNG 6: Xử lý thao tác Nhận việc, Tiếp tục hoặc Xem chi tiết
function xuLyNutHangDoi(ticket) {
  if (ticket.trangThai === "Chờ nhận") {
    ticket.trangThai = "Đang xử lý";
    // Luồng 1 - "Nhận việc": lưu ticket để trang Đang sửa đọc lại sau khi chuyển trang
    luuTicketDangXuLy(ticket);
    hienThiHangDoi();
    moChiTietHangDoi(ticket);
    hienThongBao("Đã nhận việc " + ticket.ma + ". Bấm Tiếp tục để mở trang Đang sửa.");
    return;
  }

  if (ticket.trangThai === "Đang xử lý" || ticket.trangThai === "Tạm dừng") {
    // Luồng 2 - "Tiếp tục": lưu ticket trước khi mở trang Đang sửa
    // Ticket đang tạm dừng vẫn mở lại được, tiến độ checklist giữ nguyên
    luuTicketDangXuLy(ticket);
    window.location.href = "fixing.html";
    return;
  }

  moChiTietHangDoi(ticket);
}

// CHỨC NĂNG 7: Bắt đầu xử lý ticket và chuyển sang trang Đang sửa
function batDauXuLy(ticket) {
  if (ticket.trangThai === "Hoàn thành") {
    hienThongBao("Ticket đã hoàn thành, không thể xử lý lại.");
    return;
  }
  if (ticket.trangThai === "Chờ nhận") {
    ticket.trangThai = "Đang xử lý";
    ticket.statusCode = "in_progress";
    hienThiHangDoi();
  }
  // Luồng 3 - "Bắt đầu xử lý": lưu ticket trước khi mở trang Đang sửa
  luuTicketDangXuLy(ticket);
  hienThongBao("Chuyển sang bước xử lý của ticket " + ticket.ma);
  window.location.href = "fixing.html";
}

// CHỨC NĂNG 8: Từ chối ticket sau khi chọn lý do
function tuChoiTicket(ticket) {
  const oLyDo = document.getElementById("lyDoTuChoi");
  const lyDo = oLyDo.value;

  if (lyDo === "") {
    hienThongBao("Vui lòng chọn lý do từ chối.");
    return;
  }

  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    if (danhSachTicketHangDoi[i].ma === ticket.ma) {
      danhSachTicketHangDoi.splice(i, 1);
      break;
    }
  }

  ticketDangChonHangDoi = null;
  document.getElementById("khungChiTiet").innerHTML =
    '<p class="thong-diep-trong">Chọn một ticket bên trái để xem chi tiết.</p>';
  hienThiHangDoi();
  hienThongBao("Đã từ chối ticket " + ticket.ma + " với lý do: " + lyDo);
}

// CHỨC NĂNG 9: Chuyển đổi giữa chế độ xem Kanban và chế độ danh sách
function chuyenCheDoHangDoi(cheDo) {
  const oKanban = document.getElementById("khungKanban");
  const oBang = document.getElementById("khungBangHangDoi");
  const oNutKanban = document.getElementById("nutKanban");
  const oNutDanhSach = document.getElementById("nutDanhSach");

  if (cheDo === "kanban") {
    oKanban.style.display = "grid";
    oBang.style.display = "none";
    oNutKanban.classList.add("dang-chon");
    oNutDanhSach.classList.remove("dang-chon");
  } else {
    oKanban.style.display = "none";
    oBang.style.display = "block";
    oNutKanban.classList.remove("dang-chon");
    oNutDanhSach.classList.add("dang-chon");
    hienThiBangHangDoi(layHangDoiDaLoc());
  }
}

// CHỨC NĂNG 10: Khởi tạo trang Hàng đợi và thiết lập các sự kiện
 
//hello
function khoiTaoHangDoi() {
  const oKanban = document.getElementById("khungKanban");
  const oBang = document.getElementById("khungBangHangDoi");
  oKanban.style.display = "grid";
  oBang.style.display = "none";

  hienThiHangDoi();

  document.getElementById("tuKhoaHangDoi").addEventListener("input", hienThiHangDoi);
  document.getElementById("locDanhMuc").addEventListener("change", hienThiHangDoi);
  document.getElementById("locUuTien").addEventListener("change", hienThiHangDoi);

  document.getElementById("nutDatLai").addEventListener("click", function () {
    document.getElementById("tuKhoaHangDoi").value = "";
    document.getElementById("locDanhMuc").value = "";
    document.getElementById("locUuTien").value = "";
    hienThiHangDoi();
    hienThongBao("Đã đặt lại bộ lọc.");
  });

  document.getElementById("nutKanban").addEventListener("click", function () {
    chuyenCheDoHangDoi("kanban");
  });

  document.getElementById("nutDanhSach").addEventListener("click", function () {
    chuyenCheDoHangDoi("danh-sach");
  });
}
export { hienThiHangDoi, khoiTaoHangDoi };
