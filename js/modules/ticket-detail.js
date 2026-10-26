/* =========================================================
   ticket-detail.js - Trang Chi tiết Ticket
   Xem/sửa thông tin, thêm bình luận, hủy ticket, đánh giá sao, in.
   Mọi thay đổi được ghi lại ngay vào LocalStorage qua api.js.
   ========================================================= */

import {
  timTicketTheoMa, capNhatTicket, themThongBao, layHoSo, layDanhSachKyThuatVien
} from "../api.js";
import {
  DANH_SACH_MUC_DO, anToan, dinhDangGio, dinhDangNgay, dinhDangNgayGio,
  hienThongBao, laySoGioSLA, tinhSoGioConLai, congGio, nhanMucDo, nhanTrangThai
} from "./utils.js";

let ticketDangXem = null;

export function khoiTaoTrangChiTiet() {
  const thamSo = new URLSearchParams(window.location.search);
  const ma = thamSo.get("id");
  const ticket = ma ? timTicketTheoMa(ma) : null;

  if (!ticket) {
    // Không tìm thấy (URL sai hoặc đã xóa dữ liệu trình duyệt) -> hiện khung báo lỗi
    document.getElementById("khung-chi-tiet").classList.add("an");
    document.getElementById("khung-khong-tim-thay").classList.remove("an");
    const oMa = document.getElementById("ma-khong-tim-thay");
    if (oMa) oMa.textContent = ma || "(không có mã)";
    return;
  }

  ticketDangXem = ticket;
  hienThiChiTietTicket(ticket);
}

// Ticket đã kết thúc (đã hủy hoặc hoàn thành) thì không cho sửa/hủy nữa
function coTheHuy(ticket) {
  return ticket.trangThai !== "Hủy" && ticket.trangThai !== "Hoàn thành";
}

function hienThiChiTietTicket(ticket) {
  const khung = document.getElementById("khung-chi-tiet");
  khung.classList.remove("an");
  document.getElementById("khung-khong-tim-thay").classList.add("an");

  // Dữ liệu cũ có thể thiếu 2 mảng này, bổ sung để tránh lỗi khi hiển thị
  ticket.lichSu = ticket.lichSu || [];
  ticket.binhLuan = ticket.binhLuan || [];

  const maDuongDan = document.getElementById("ma-duong-dan");
  if (maDuongDan) maDuongDan.textContent = ticket.id;

  const anhHTML = ticket.anhDinhKem && ticket.anhDinhKem.length > 0
    ? ticket.anhDinhKem.map(function (duongDan) {
        return '<img class="anh-chi-tiet" src="' + duongDan + '" alt="Ảnh sự cố">';
      }).join("")
    : '<p class="chu-thich">Chưa có ảnh đính kèm.</p>';

  const lichSuHTML = ticket.lichSu.map(function (moc) {
    return '<li class="moc-thoi-gian"><span class="cham-thoi-gian"></span>' +
      '<span class="thoi-gian-moc">' + anToan(dinhDangGio(moc.thoiGian) + " · " + dinhDangNgay(moc.thoiGian)) + "</span>" +
      "<span>" + anToan(moc.noiDung) + "</span></li>";
  }).join("");

  const binhLuanHTML = ticket.binhLuan.map(function (bl) {
    return '<div class="binh-luan"><div class="nguoi-viet">' + anToan(bl.nguoiViet) +
      '<span class="thoi-gian-binh-luan">' + anToan(dinhDangNgayGio(bl.thoiGian)) + "</span></div>" +
      "<div>" + anToan(bl.noiDung) + "</div></div>";
  }).join("");

  const gioConLai = tinhSoGioConLai(ticket);
  const soGioToiDa = laySoGioSLA(ticket.mucDo);
  let phanTramSLA = Math.round(100 - (gioConLai / soGioToiDa) * 100);
  if (phanTramSLA < 0) phanTramSLA = 0;
  if (phanTramSLA > 100) phanTramSLA = 100;

  let chuoiSLA = "";
  if (ticket.trangThai === "Hoàn thành") chuoiSLA = "Đã hoàn thành";
  else if (ticket.trangThai === "Hủy") chuoiSLA = "Đã hủy";
  else if (gioConLai >= 0) chuoiSLA = "Còn " + gioConLai + " giờ";
  else chuoiSLA = "Quá hạn " + Math.abs(gioConLai) + " giờ";

  let saoHTML = "";
  for (let i = 1; i <= 5; i++) {
    saoHTML += '<button class="sao' + (i <= ticket.danhGia ? " duoc-chon" : "") + '" data-diem="' + i +
      '" title="' + i + ' sao">★</button>';
  }
  const danhGiaChoPhep = ticket.trangThai === "Hoàn thành";

  khung.innerHTML =
    '<div class="dau-chi-tiet">' +
    "<div>" +
    '<h1 class="tieu-de-trang">' + anToan(ticket.tieuDe) + "</h1>" +
    '<p class="dong-meta">' +
    "<span>" + anToan(ticket.id) + "</span>" +
    '<span class="nhan ' + nhanTrangThai(ticket.trangThai) + '">' + anToan(ticket.trangThai) + "</span>" +
    '<span class="nhan ' + nhanMucDo(ticket.mucDo) + '">' + anToan(ticket.mucDo) + "</span>" +
    "<span>Tạo ngày " + anToan(dinhDangNgay(ticket.ngayTao)) + "</span>" +
    "</p>" +
    "</div>" +
    '<div class="khung-nut" id="khung-nut-xem">' +
    (coTheHuy(ticket) ? '<button class="nut nut-phu" id="nut-sua">Sửa</button>' : "") +
    (coTheHuy(ticket) ? '<button class="nut nut-nguy-hiem" id="nut-huy-ticket">Hủy</button>' : "") +
    '<button class="nut nut-phu" id="nut-in">In</button>' +
    "</div>" +
    "</div>" +
    '<div class="khung-nut an" id="khung-nut-chinh-sua">' +
    '<button class="nut nut-chinh" id="nut-luu-chinh-sua">Lưu thay đổi</button>' +
    '<button class="nut nut-phu" id="nut-huy-chinh-sua">Hủy bỏ</button>' +
    "</div>" +

    '<div class="luoi-hai-cot">' +
    "<div>" +
    '<div class="the">' +
    '<h2 class="tieu-de-the">Thông tin sự cố</h2>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-tieu-de">Tiêu đề</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-tieu-de" value="' + anToan(ticket.tieuDe) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-mo-ta">Mô tả</label>' +
    '<textarea class="o-textarea truong-chinh-sua" id="ct-mo-ta" disabled>' + anToan(ticket.moTa) + "</textarea></div>" +
    '<div class="nhom-truong"><label class="nhan-truong">Ảnh đính kèm</label>' + anhHTML + "</div>" +
    "</div>" +

    '<div class="the"><h2 class="tieu-de-the">Dòng thời gian</h2>' +
    '<ul class="dong-thoi-gian">' + lichSuHTML + "</ul></div>" +

    '<div class="the"><h2 class="tieu-de-the">Bình luận</h2>' +
    '<div class="danh-sach-binh-luan">' + (binhLuanHTML || '<p class="chu-thich">Chưa có bình luận nào.</p>') + "</div>" +
    '<div class="nhom-truong"><textarea class="o-textarea" id="o-binh-luan" placeholder="Viết bình luận..." style="min-height:80px"></textarea></div>' +
    '<button class="nut nut-chinh" id="nut-them-binh-luan">Gửi bình luận</button>' +
    "</div>" +
    "</div>" +

    '<div class="cot-phai">' +
    '<div class="the">' +
    '<h2 class="tieu-de-the">Thông tin thiết bị</h2>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-thiet-bi">Thiết bị</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-thiet-bi" value="' + anToan(ticket.thietBi) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-vi-tri">Vị trí</label>' +
    '<input class="o-nhap truong-chinh-sua" id="ct-vi-tri" value="' + anToan(ticket.viTri) + '" disabled></div>' +
    '<div class="nhom-truong"><label class="nhan-truong" for="ct-muc-do">Mức độ ưu tiên</label>' +
    '<select class="o-chon truong-chinh-sua" id="ct-muc-do" disabled>' +
    DANH_SACH_MUC_DO.map(function (muc) {
      return '<option value="' + muc + '"' + (muc === ticket.mucDo ? " selected" : "") + ">" + muc + "</option>";
    }).join("") + "</select></div>" +
    '<div class="dong-thong-tin"><span>Danh mục</span><strong>' + anToan(ticket.danhMuc) + "</strong></div>" +
    '<div class="dong-thong-tin"><span>Người phụ trách</span><strong id="ct-thong-tin-ktv">' + anToan(ticket.nguoiPhuTran) + "</strong></div>" +
    "</div>" +

    '<div class="the the-sla">' +
    '<p class="so-sla">' + chuoiSLA + "</p>" +
    '<div class="thanh-tien-do"><span class="' + (phanTramSLA >= 85 ? "nguy-hiem" : (phanTramSLA >= 60 ? "canh-bao" : "")) + '" style="width:' + phanTramSLA + '%"></span></div>' +
    '<p class="chu-thich">Hạn xử lý: ' + anToan(dinhDangGio(ticket.hanXuLy) + " · " + dinhDangNgay(ticket.hanXuLy)) + "</p>" +
    "</div>" +

    '<div class="the"><h2 class="tieu-de-the">Đánh giá</h2>' +
    '<div class="khung-danh-gia">' + saoHTML + "</div>" +
    '<p class="chu-thich">' + (danhGiaChoPhep ? "Bấm vào sao để đánh giá dịch vụ." : "Chỉ đánh giá được khi ticket đã hoàn thành.") + "</p>" +
    "</div>" +

    (ticket.trangThai === "Hủy"
      ? '<div class="the"><h2 class="tieu-de-the">Ticket đã hủy</h2>' +
        "<p>Lý do hủy: <strong>" + anToan(ticket.lyDoHuy || "Không ghi rõ") + "</strong></p>" +
        '<p class="chu-thich">Ticket vẫn được giữ trong danh sách, không bị xóa khỏi dữ liệu.</p></div>'
      : "") +
    (coTheHuy(ticket)
      ? '<div class="khung-huy an" id="khung-xac-nhan-huy">' +
        '<h3 class="tieu-de-the">Xác nhận hủy ticket</h3>' +
        '<p class="chu-thich">Hành động này không thể hoàn tác. Ticket vẫn được giữ trong lịch sử.</p>' +
        '<div class="nhom-truong"><label class="nhan-truong" for="ly-do-huy">Lý do</label>' +
        '<select class="o-chon" id="ly-do-huy">' +
        '<option value="">-- Chọn lý do --</option>' +
        '<option value="Không còn nhu cầu">Không còn nhu cầu</option>' +
        '<option value="Tự xử lý được">Tự xử lý được</option>' +
        '<option value="Nhập sai thông tin">Nhập sai thông tin</option>' +
        '<option value="Khác">Khác</option>' +
        "</select></div>" +
        '<div class="nhom-truong"><label class="nhan-truong" for="ly-do-khac">Lý do khác (nếu chọn Khác)</label>' +
        '<input class="o-nhap" id="ly-do-khac"></div>' +
        '<button class="nut nut-nguy-hiem" id="nut-xac-nhan-huy">Xác nhận hủy</button>' +
        "</div>"
      : "") +
    "</div>" +
    "</div>";

  ganSuKienChiTiet(ticket);
  hienThiChuyenMonKyThuatVien(ticket);
}

// Tra danh mục chuyên môn của kỹ thuật viên trong technicians.json (nếu có)
function hienThiChuyenMonKyThuatVien(ticket) {
  if (!ticket.nguoiPhuTran || ticket.nguoiPhuTran === "Chưa phân công") return;
  layDanhSachKyThuatVien().then(function (danhSach) {
    const ktv = danhSach.find(function (t) { return t.ten === ticket.nguoiPhuTran; });
    const o = document.getElementById("ct-thong-tin-ktv");
    if (ktv && o) o.textContent = ktv.ten + " · " + ktv.chuyenMon;
  });
}

function ganSuKienChiTiet(ticket) {
  const nutSua = document.getElementById("nut-sua");
  const nutHuyTicket = document.getElementById("nut-huy-ticket");
  const nutIn = document.getElementById("nut-in");
  const nutLuu = document.getElementById("nut-luu-chinh-sua");
  const nutHuyChinhSua = document.getElementById("nut-huy-chinh-sua");
  const nutBinhLuan = document.getElementById("nut-them-binh-luan");
  const nutXacNhanHuy = document.getElementById("nut-xac-nhan-huy");

  // Có nút nào không tồn tại (ticket đã hủy/hoàn thành) thì bỏ qua nút đó
  if (nutSua) nutSua.addEventListener("click", batCheDoChinhSua);
  if (nutHuyTicket) {
    nutHuyTicket.addEventListener("click", function () {
      document.getElementById("khung-xac-nhan-huy").classList.remove("an");
      document.getElementById("khung-xac-nhan-huy").scrollIntoView({ behavior: "smooth" });
    });
  }
  if (nutIn) nutIn.addEventListener("click", function () { window.print(); });
  if (nutHuyChinhSua) nutHuyChinhSua.addEventListener("click", function () { hienThiChiTietTicket(ticket); });
  if (nutLuu) nutLuu.addEventListener("click", function () { luuChinhSua(ticket); });
  if (nutBinhLuan) nutBinhLuan.addEventListener("click", function () { xuLyThemBinhLuan(ticket); });
  if (nutXacNhanHuy) nutXacNhanHuy.addEventListener("click", function () { xuLyXacNhanHuy(ticket); });

  const cacSao = document.querySelectorAll(".sao");
  for (const sao of cacSao) {
    sao.addEventListener("click", function () {
      if (ticket.trangThai !== "Hoàn thành") {
        hienThongBao("Chỉ đánh giá được khi ticket đã hoàn thành.", "loi");
        return;
      }
      ticket.danhGia = Number(sao.getAttribute("data-diem"));
      ticket.ngayCapNhat = new Date().toISOString();
      capNhatTicket(ticket);
      hienThiChiTietTicket(ticket);
      hienThongBao("Cảm ơn bạn đã đánh giá " + ticket.danhGia + " sao.", "thanh-cong");
    });
  }
}

function batCheDoChinhSua() {
  const cacTruong = document.querySelectorAll(".truong-chinh-sua");
  for (const truong of cacTruong) truong.removeAttribute("disabled");
  document.getElementById("khung-nut-xem").classList.add("an");
  document.getElementById("khung-nut-chinh-sua").classList.remove("an");
}

function luuChinhSua(ticket) {
  const tieuDe = document.getElementById("ct-tieu-de").value.trim();
  const moTa = document.getElementById("ct-mo-ta").value.trim();
  const thietBi = document.getElementById("ct-thiet-bi").value.trim();
  const viTri = document.getElementById("ct-vi-tri").value.trim();
  const mucDoMoi = document.getElementById("ct-muc-do").value;

  if (!tieuDe || !moTa || !thietBi || !viTri) {
    hienThongBao("Thiết bị, vị trí, tiêu đề và mô tả không được để trống.", "loi");
    return;
  }

  ticket.tieuDe = tieuDe;
  ticket.moTa = moTa;
  ticket.thietBi = thietBi;
  ticket.viTri = viTri;

  // Đổi mức độ ưu tiên thì phải tính lại hạn xử lý theo SLA của mức độ mới
  if (mucDoMoi !== ticket.mucDo) {
    ticket.mucDo = mucDoMoi;
    ticket.hanXuLy = congGio(ticket.ngayTao, laySoGioSLA(mucDoMoi));
  }

  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Cập nhật thông tin ticket" });

  capNhatTicket(ticket);
  themThongBao("Ticket " + ticket.id + " vừa được cập nhật.", "ticket", ticket.id);
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã lưu thay đổi cho ticket " + ticket.id + ".", "thanh-cong");
}

function xuLyThemBinhLuan(ticket) {
  const oBinhLuan = document.getElementById("o-binh-luan");
  const noiDung = oBinhLuan.value.trim();
  if (!noiDung) {
    hienThongBao("Vui lòng nhập nội dung bình luận.", "loi");
    return;
  }

  ticket.binhLuan = ticket.binhLuan || [];
  ticket.binhLuan.push({ nguoiViet: layHoSo().ten, noiDung: noiDung, thoiGian: new Date().toISOString() });
  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Thêm bình luận" });

  capNhatTicket(ticket);
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã thêm bình luận.", "thanh-cong");
}

function xuLyXacNhanHuy(ticket) {
  const lyDoChon = document.getElementById("ly-do-huy").value;
  const lyDoKhac = document.getElementById("ly-do-khac").value.trim();

  if (!lyDoChon) {
    hienThongBao("Vui lòng chọn lý do hủy ticket.", "loi");
    return;
  }
  if (lyDoChon === "Khác" && !lyDoKhac) {
    hienThongBao("Vui lòng nhập lý do hủy.", "loi");
    return;
  }

  const lyDo = lyDoChon === "Khác" ? lyDoKhac : lyDoChon;
  ticket.trangThai = "Hủy";
  ticket.lyDoHuy = lyDo;
  ticket.lichSu = ticket.lichSu || [];
  ticket.ngayCapNhat = new Date().toISOString();
  ticket.lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Hủy ticket - Lý do: " + lyDo });

  capNhatTicket(ticket);
  themThongBao("Ticket " + ticket.id + " đã bị hủy. Lý do: " + lyDo, "ticket", ticket.id);
  hienThiChiTietTicket(ticket);
  hienThongBao("Đã hủy ticket " + ticket.id + ".", "thanh-cong");
}
