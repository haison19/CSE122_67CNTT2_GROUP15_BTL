/* =========================================================
   ticket-form.js - Trang Tạo Ticket
   Biểu mẫu + ảnh đính kèm + luồng "phân tích AI" mô phỏng.
   Kết quả phân loại nằm ở ai-suggestion.js, file này lo giao diện.
   ========================================================= */

import { layDanhSachTicket, themTicket, taoMaTicketMoi, themThongBao } from "../api.js";
import {
  DINH_DANG_ANH, KICH_THUOC_ANH_TOI_DA, anToan, congGio, dinhDangGio,
  hienThongBao, laySoGioSLA
} from "./utils.js";
import { moPhongPhanLoai, DANH_MUC_SU_CO } from "./ai-suggestion.js";

let mucDoDangChon = "Trung bình";
let danhSachAnhDangChon = [];
let dangGuiTicket = false; // cờ chặn bấm gửi nhiều lần khi đang "phân tích"

export function khoiTaoTrangTaoTicket() {
  const form = document.getElementById("bieu-muc-tao-ticket");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      xuLyGuiTicket();
    });
  }

  const cacNutMucDo = document.querySelectorAll(".nut-muc-do");
  for (const nut of cacNutMucDo) {
    nut.addEventListener("click", function () {
      mucDoDangChon = nut.getAttribute("data-muc");
      for (const nutKhac of cacNutMucDo) nutKhac.classList.remove("duoc-chon");
      nut.classList.add("duoc-chon");
    });
  }

  const dauVaoAnh = document.getElementById("dau-vao-anh");
  if (dauVaoAnh) {
    dauVaoAnh.addEventListener("change", function () {
      xuLyChonAnh(dauVaoAnh.files);
      dauVaoAnh.value = ""; // cho phép chọn lại đúng file vừa bỏ
    });
  }

  const vungAnh = document.getElementById("vung-anh");
  if (vungAnh) {
    vungAnh.addEventListener("click", function () { dauVaoAnh.click(); });
    vungAnh.addEventListener("dragover", function (e) {
      e.preventDefault();
      vungAnh.classList.add("keo-vao");
    });
    vungAnh.addEventListener("dragleave", function () { vungAnh.classList.remove("keo-vao"); });
    vungAnh.addEventListener("drop", function (e) {
      e.preventDefault();
      vungAnh.classList.remove("keo-vao");
      xuLyChonAnh(e.dataTransfer.files);
    });
  }

  const nutHuy = document.getElementById("nut-huy-form");
  if (nutHuy) {
    nutHuy.addEventListener("click", function () {
      // Nếu đã nhập dữ liệu thì hỏi lại để tránh mất thông tin ngoài ý muốn
      if (bieuMucCoDuLieu() && !window.confirm("Bạn có chắc muốn hủy? Thông tin đã nhập sẽ không được lưu.")) return;
      window.location.href = "ticket-cua-toi.html";
    });
  }

  datLaiKetQuaPhanLoai();
}

function bieuMucCoDuLieu() {
  const cacTruong = ["truong-thiet-bi", "truong-vi-tri", "truong-tieu-de", "truong-mo-ta"];
  for (const id of cacTruong) {
    const o = document.getElementById(id);
    if (o && o.value.trim()) return true;
  }
  return danhSachAnhDangChon.length > 0;
}

function xuLyChonAnh(danhSachFile) {
  for (const file of danhSachFile) {
    if (!DINH_DANG_ANH.includes(file.type)) {
      hienThongBao("Chỉ chấp nhận ảnh định dạng PNG hoặc JPG.", "loi");
      continue;
    }
    if (file.size > KICH_THUOC_ANH_TOI_DA) {
      hienThongBao("Ảnh " + file.name + " quá lớn, tối đa 1,5 MB.", "loi");
      continue;
    }
    // Đọc ảnh thành data URL để lưu trực tiếp kèm ticket trong LocalStorage
    const docFile = new FileReader();
    docFile.onload = function (e) {
      danhSachAnhDangChon.push(e.target.result);
      hienThiAnhXemTruoc();
    };
    docFile.readAsDataURL(file);
  }
}

function hienThiAnhXemTruoc() {
  const khung = document.getElementById("danh-sach-anh");
  if (!khung) return;
  khung.innerHTML = danhSachAnhDangChon.map(function (duongDan, viTri) {
    return '<div class="anh-o"><img class="anh-xem-truoc" src="' + duongDan + '" alt="Ảnh sự cố">' +
      '<button type="button" class="nut-xoa-anh" data-vi-tri="' + viTri + '" title="Xóa ảnh">×</button></div>';
  }).join("");

  const cacNutXoa = khung.querySelectorAll(".nut-xoa-anh");
  for (const nut of cacNutXoa) {
    nut.addEventListener("click", function () {
      danhSachAnhDangChon.splice(Number(nut.getAttribute("data-vi-tri")), 1);
      hienThiAnhXemTruoc();
    });
  }
}

// Kiểm tra 4 trường bắt buộc, hiện lỗi dưới từng ô và focs vào lỗi đầu tiên
function kiemTraBieuMuc() {
  let hopLe = true;
  let oLoiDauTien = null;

  const cap = function (idTruong, idLoi, thongDiep) {
    const nhom = document.getElementById(idTruong).closest(".nhom-truong");
    const oLoi = document.getElementById(idLoi);
    if (thongDiep) {
      nhom.classList.add("truong-loi");
      oLoi.textContent = thongDiep;
      hopLe = false;
      if (!oLoiDauTien) oLoiDauTien = document.getElementById(idTruong);
    } else {
      nhom.classList.remove("truong-loi");
      oLoi.textContent = "";
    }
  };

  cap("truong-thiet-bi", "loi-thiet-bi", document.getElementById("truong-thiet-bi").value.trim() ? "" : "Vui lòng chọn hoặc nhập thiết bị.");
  cap("truong-vi-tri", "loi-vi-tri", document.getElementById("truong-vi-tri").value.trim() ? "" : "Vui lòng nhập vị trí thiết bị.");
  cap("truong-tieu-de", "loi-tieu-de", document.getElementById("truong-tieu-de").value.trim() ? "" : "Vui lòng nhập tiêu đề sự cố.");
  cap("truong-mo-ta", "loi-mo-ta", document.getElementById("truong-mo-ta").value.trim() ? "" : "Vui lòng nhập mô tả sự cố.");

  if (oLoiDauTien) oLoiDauTien.focus();
  return hopLe;
}

function datLaiKetQuaPhanLoai() {
  const khung = document.getElementById("khung-phan-loai");
  if (!khung) return;
  khung.innerHTML =
    '<div class="nhan-tin-cay">92% tin cậy</div>' +
    '<h3 class="tieu-de-the">Chờ phân tích</h3>' +
    '<p class="dong-ket-qua">Nhập thông tin sự cố rồi bấm <strong>Gửi &amp; Phân tích AI</strong> để hệ thống mô phỏng phân loại.</p>' +
    '<p class="dong-ket-qua">Kết quả chỉ được tính từ tiêu đề và mô tả, hoàn toàn bằng JavaScript.</p>';
}

function xuLyGuiTicket() {
  if (dangGuiTicket) return;
  if (!kiemTraBieuMuc()) {
    hienThongBao("Vui lòng điền đầy đủ các trường bắt buộc.", "loi");
    return;
  }

  dangGuiTicket = true;
  const nutGui = document.getElementById("nut-gui");
  nutGui.setAttribute("disabled", "");

  const tieuDe = document.getElementById("truong-tieu-de").value.trim();
  const moTa = document.getElementById("truong-mo-ta").value.trim();

  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML = '<p class="dang-tai">Đang phân tích nội dung văn bản...</p>';

  // setTimeout mô phỏng độ trễ xử lý; thực tế chỉ là tính từ khóa ngay trên máy
  setTimeout(function () {
    const ketQua = moPhongPhanLoai(tieuDe, moTa);
    hienThiKetQuaPhanLoai(ketQua);
    nutGui.removeAttribute("disabled");
    dangGuiTicket = false;
  }, 700);
}

function hienThiKetQuaPhanLoai(ketQua) {
  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML =
    '<div class="nhan-tin-cay">' + ketQua.doTinCay + "% tin cậy</div>" +
    '<h3 class="tieu-de-the">' + anToan(ketQua.danhMuc) + "</h3>" +
    '<p class="dong-ket-qua">Từ khóa: ' + anToan(ketQua.soTuKhoa) + " từ khóa phù hợp</p>" +
    '<p class="dong-ket-qua">Đây là kết quả mô phỏng phía frontend, không phải AI thật.</p>' +
    (danhSachAnhDangChon.length > 0
      ? '<p class="dong-ket-qua">Ảnh đính kèm chỉ được lưu kèm ticket, KHÔNG được phân tích hình ảnh.</p>'
      : "") +
    (ketQua.doTinCay < 70
      ? '<p class="thong-tiep-nhan">Chưa chắc chắn ' + ketQua.doTinCay + "% · Hãy mô tả chi tiết hơn.</p>"
      : "") +
    '<div class="khung-nut-ai">' +
    '<button class="nut nut-chinh nut-nho" id="nut-chap-nhan">Chấp nhận</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-sua-phan-loai">Sửa</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-tu-choi">Từ chối</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-tao-lai">Tạo lại</button>' +
    "</div>";

  document.getElementById("nut-chap-nhan").addEventListener("click", function () {
    taoTicketMoi(ketQua.danhMuc);
  });
  document.getElementById("nut-tu-choi").addEventListener("click", function () {
    datLaiKetQuaPhanLoai();
    hienThongBao("Đã hủy kết quả phân loại, ticket chưa được tạo.", "thanh-cong");
  });
  document.getElementById("nut-tao-lai").addEventListener("click", function () {
    xuLyGuiTicket(); // phân tích lại nội dung đang nhập, không tải lại trang để không mất dữ liệu
  });
  document.getElementById("nut-sua-phan-loai").addEventListener("click", function () {
    hienThiOChonPhanLoai(ketQua.danhMuc);
  });
}

function hienThiOChonPhanLoai(danhMucHienTai) {
  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML =
    '<h3 class="tieu-de-the">Chọn lại danh mục</h3>' +
    '<select class="o-chon" id="o-chon-danh-muc">' +
    DANH_MUC_SU_CO.map(function (ten) {
      return '<option value="' + anToan(ten) + '"' + (ten === danhMucHienTai ? " selected" : "") + ">" + anToan(ten) + "</option>";
    }).join("") +
    "</select>" +
    '<div class="khung-nut-ai">' +
    '<button class="nut nut-chinh nut-nho" id="nut-xac-nhan-phan-loai">Xác nhận</button>' +
    '<button class="nut nut-phu nut-nho" id="nut-quay-lai">Quay lại</button>' +
    "</div>";

  document.getElementById("nut-xac-nhan-phan-loai").addEventListener("click", function () {
    taoTicketMoi(document.getElementById("o-chon-danh-muc").value);
  });
  document.getElementById("nut-quay-lai").addEventListener("click", function () {
    datLaiKetQuaPhanLoai();
  });
}

// Tạo ticket mới từ nội dung form + danh mục đã chốt, lưu vào LocalStorage
function taoTicketMoi(danhMuc) {
  const ngayTao = new Date().toISOString();
  const ticket = {
    id: taoMaTicketMoi(),
    thietBi: document.getElementById("truong-thiet-bi").value.trim(),
    viTri: document.getElementById("truong-vi-tri").value.trim(),
    tieuDe: document.getElementById("truong-tieu-de").value.trim(),
    moTa: document.getElementById("truong-mo-ta").value.trim(),
    mucDo: mucDoDangChon,
    trangThai: "Mới",
    danhMuc: danhMuc,
    ngayTao: ngayTao,
    ngayCapNhat: ngayTao,
    hanXuLy: congGio(ngayTao, laySoGioSLA(mucDoDangChon)),
    nguoiPhuTran: "Chưa phân công",
    lichSu: [{ thoiGian: ngayTao, noiDung: "Ticket được tạo" },
             { thoiGian: ngayTao, noiDung: "Mô phỏng phân loại sự cố: " + danhMuc }],
    binhLuan: [],
    danhGia: 0,
    lyDoHuy: "",
    anhDinhKem: danhSachAnhDangChon.slice()
  };

  const daLuu = themTicket(ticket);
  if (!daLuu) {
    hienThongBao("Không lưu được ticket, thử lại với ít ảnh hơn.", "loi");
    return;
  }

  themThongBao("Ticket " + ticket.id + " đã được tạo lúc " + dinhDangGio(ngayTao) + ".", "ticket", ticket.id);
  const khung = document.getElementById("khung-phan-loai");
  khung.innerHTML =
    '<div class="nhan-tin-cay">Đã tạo ticket</div>' +
    '<h3 class="tieu-de-the">' + anToan(ticket.id) + "</h3>" +
    '<p class="dong-ket-qua">Ticket đã được lưu trong trình duyệt và xuất hiện ở trang Tổng quan, Ticket của tôi.</p>' +
    '<div class="khung-nut-ai">' +
    '<a class="nut nut-chinh nut-nho" href="chi-tiet-ticket.html?id=' + encodeURIComponent(ticket.id) + '">Xem chi tiết</a>' +
    '<a class="nut nut-phu nut-nho" href="ticket-cua-toi.html">Về danh sách</a>' +
    "</div>";

  hienThongBao("Đã tạo ticket " + ticket.id + " thành công.", "thanh-cong");
}
