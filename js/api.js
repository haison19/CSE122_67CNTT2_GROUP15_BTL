/* =========================================================
   api.js - Lớp truy cập dữ liệu phía frontend (KHÔNG phải máy chủ)
   Nguồn dữ liệu:
     1. assets/data/*.json - dữ liệu ban đầu, chỉ nạp khi chưa có gì trong trình duyệt
     2. LocalStorage       - dữ liệu sau khi người dùng chỉnh sửa
   Quy tắc: đọc LocalStorage trước, chỉ fetch JSON khi chưa có dữ liệu hợp lệ.
   ========================================================= */

import {
  KHOA_TICKET, KHOA_THONG_BAO, KHOA_HO_SO, KHOA_CAI_DAT,
  docMang, docDoiTuong, ghi, xoa, coDuLieu
} from "./modules/storage.js";
import { congGio, truocSoGio, laySoGioSLA } from "./modules/utils.js";

const DUONG_DAN_JSON = {
  tickets: "assets/data/tickets.json",
  thongBao: "assets/data/thong-bao-mau.json",
  kyThuatVien: "assets/data/technicians.json"
};

const HO_SO_MAC_DINH = {
  ten: "Nguyễn Văn A",
  email: "a@fixflow.com",
  maNhanVien: "NV-1024",
  soDienThoai: "0912 345 678",
  phongBan: "Phòng Giáo vụ",
  anhDaiDien: ""
};

const CAI_DAT_MAC_DINH = {
  theme: "sang", // "sang" | "toi" | "he-thong"
  coChu: "mac-dinh", // "mac-dinh" | "lon"
  tanSuat: "ngay-lap-tuc",
  batCapNhatTicket: true,
  batCanhBaoSLA: true,
  batBanTinEmail: false,
  xacThucHaiLop: false
};

// Bộ đếm kỹ thuật viên đã nạp từ JSON (để hiển thị chuyên môn ở trang chi tiết)
let danhSachKyThuatVienDaNap = [];

/* ---------- Khởi tạo dữ liệu ---------- */

// Hàm khởi chạy: chỉ nạp JSON mẫu khi LocalStorage chưa có dữ liệu hợp lệ,
// tránh ghi đè dữ liệu người dùng đã chỉnh sửa khi tải lại trang
export async function khoiTaoDuLieu() {
  const duLieuThieu = !coDuLieu(KHOA_TICKET) || !coDuLieu(KHOA_THONG_BAO);
  if (!duLieuThieu) return;

  try {
    const [ticketsMau, thongBaoMau, kyThuatVienMau] = await Promise.all([
      fetch(DUONG_DAN_JSON.tickets).then(function (r) { return r.json(); }),
      fetch(DUONG_DAN_JSON.thongBao).then(function (r) { return r.json(); }),
      fetch(DUONG_DAN_JSON.kyThuatVien).then(function (r) { return r.json(); })
    ]);
    danhSachKyThuatVienDaNap = kyThuatVienMau;

    if (!coDuLieu(KHOA_TICKET)) {
      ghi(KHOA_TICKET, ticketsMau.map(taoTicketTuMau));
    }
    if (!coDuLieu(KHOA_THONG_BAO)) {
      ghi(KHOA_THONG_BAO, thongBaoMau.map(taoThongBaoTuMau));
    }
  } catch (e) {
    // fetch JSON lỗi thường do mở bằng file:// thay vì Live Server
    console.error("Không nạp được JSON mẫu. Hãy chạy dự án bằng Live Server.", e);
  }
}

// Chuyển một dòng trong tickets.json thành ticket đầy đủ (tính ngày tạo, hạn SLA, lịch sử)
function taoTicketTuMau(dong) {
  const nam = new Date().getFullYear();
  const ngayTao = truocSoGio(dong.soGioTruoc);
  const ticket = {
    id: "TK-" + nam + "-" + String(dong.so).padStart(3, "0"),
    thietBi: dong.thietBi,
    viTri: dong.viTri,
    tieuDe: dong.tieuDe,
    moTa: dong.moTa,
    mucDo: dong.mucDo,
    trangThai: dong.trangThai,
    danhMuc: dong.danhMuc,
    ngayTao: ngayTao,
    ngayCapNhat: congGio(ngayTao, 3),
    hanXuLy: congGio(ngayTao, laySoGioSLA(dong.mucDo)),
    nguoiPhuTran: dong.nguoiPhuTran || "Chưa phân công",
    binhLuan: (dong.binhLuan || []).map(function (bl) {
      return { nguoiViet: bl.nguoiViet, noiDung: bl.noiDung, thoiGian: truocSoGio(bl.soGioTruoc) };
    }),
    danhGia: dong.danhGia || 0,
    lyDoHuy: dong.lyDoHuy || "",
    anhDinhKem: []
  };
  ticket.lichSu = taoLichSuMacDinh(ticket);
  return ticket;
}

function taoThongBaoTuMau(dong) {
  const nam = new Date().getFullYear();
  return {
    noiDung: dong.noiDung,
    loai: dong.loai || "ticket",
    thoiGian: truocSoGio(dong.soGioTruoc),
    daDoc: !!dong.daDoc,
    maTicket: dong.soThuTuTicket ? "TK-" + nam + "-" + String(dong.soThuTuTicket).padStart(3, "0") : ""
  };
}

function taoLichSuMacDinh(ticket) {
  const lichSu = [{ thoiGian: ticket.ngayTao, noiDung: "Ticket được tạo" }];
  lichSu.push({ thoiGian: ticket.ngayTao, noiDung: "Mô phỏng phân loại sự cố: " + ticket.danhMuc });
  if (ticket.trangThai !== "Mới") {
    lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Cập nhật trạng thái: " + ticket.trangThai });
  }
  if (ticket.trangThai === "Hủy") {
    lichSu.push({ thoiGian: ticket.ngayCapNhat, noiDung: "Hủy ticket - Lý do: " + ticket.lyDoHuy });
  }
  return lichSu;
}

// Xóa dữ liệu đã lưu rồi nạp lại JSON mẫu (chỉ dùng cho nút "Đặt lại" ở trang Cài đặt)
export function datLaiDuLieuMau() {
  xoa(KHOA_TICKET);
  xoa(KHOA_THONG_BAO);
  return khoiTaoDuLieu();
}

/* ---------- Ticket ---------- */

export function layDanhSachTicket() {
  return docMang(KHOA_TICKET);
}

export function luuDanhSachTicket(danhSach) {
  return ghi(KHOA_TICKET, danhSach);
}

export function timTicketTheoMa(ma) {
  return layDanhSachTicket().find(function (t) { return t.id === ma; });
}

// Ghi đè một ticket trong danh sách theo mã, trả true nếu lưu thành công
export function capNhatTicket(ticket) {
  const danhSach = layDanhSachTicket();
  const viTri = danhSach.findIndex(function (t) { return t.id === ticket.id; });
  if (viTri === -1) return false;
  danhSach[viTri] = ticket;
  return luuDanhSachTicket(danhSach);
}

export function themTicket(ticket) {
  const danhSach = layDanhSachTicket();
  danhSach.push(ticket);
  return luuDanhSachTicket(danhSach);
}

// Sinh mã ticket mới: TK-{năm}-{số tiếp theo}, kiểm tra không trùng mã đã có
export function taoMaTicketMoi() {
  const danhSach = layDanhSachTicket();
  const nam = new Date().getFullYear();
  let soLonNhat = 0;
  for (const ticket of danhSach) {
    const phan = String(ticket.id).split("-");
    const so = parseInt(phan[phan.length - 1], 10);
    if (!isNaN(so) && so > soLonNhat) soLonNhat = so;
  }
  return "TK-" + nam + "-" + String(soLonNhat + 1).padStart(3, "0");
}

/* ---------- Thông báo ---------- */

export function layDanhSachThongBao() {
  // Bản ghi cũ có thể thiếu trường loai/maTicket; điền mặc định để trang Thông báo không lỗi
  return docMang(KHOA_THONG_BAO).map(function (tb) {
    return {
      noiDung: tb.noiDung || "",
      loai: tb.loai || "ticket",
      thoiGian: tb.thoiGian || "",
      daDoc: !!tb.daDoc,
      maTicket: tb.maTicket || ""
    };
  });
}

export function luuDanhSachThongBao(danhSach) {
  ghi(KHOA_THONG_BAO, danhSach);
}

export function themThongBao(noiDung, loai, maTicket) {
  const danhSach = layDanhSachThongBao();
  danhSach.unshift({
    noiDung: noiDung,
    loai: loai || "ticket",
    thoiGian: new Date().toISOString(),
    daDoc: false,
    maTicket: maTicket || ""
  });
  if (danhSach.length > 30) danhSach.length = 30; // chỉ giữ 30 tin gần nhất
  luuDanhSachThongBao(danhSach);
}

export function danhDauTatCaDaDoc() {
  const danhSach = layDanhSachThongBao().map(function (tb) {
    tb.daDoc = true;
    return tb;
  });
  luuDanhSachThongBao(danhSach);
}

export function laySoThongBaoChuaDoc() {
  return layDanhSachThongBao().filter(function (tb) { return !tb.daDoc; }).length;
}

/* ---------- Hồ sơ ---------- */

// Dữ liệu đã lưu được "hợp nhất" vào bộ mặc định để bản ghi cũ thiếu trường vẫn chạy được
export function layHoSo() {
  const daLuu = docDoiTuong(KHOA_HO_SO);
  return Object.assign({}, HO_SO_MAC_DINH, daLuu || {});
}

export function luuHoSo(hoSo) {
  return ghi(KHOA_HO_SO, hoSo);
}

/* ---------- Cài đặt ---------- */

export function layCaiDat() {
  const daLuu = docDoiTuong(KHOA_CAI_DAT);
  return Object.assign({}, CAI_DAT_MAC_DINH, daLuu || {});
}

export function luuCaiDat(caiDat) {
  return ghi(KHOA_CAI_DAT, caiDat);
}

/* ---------- Kỹ thuật viên ---------- */

export async function layDanhSachKyThuatVien() {
  if (danhSachKyThuatVienDaNap.length > 0) return danhSachKyThuatVienDaNap;
  try {
    const resp = await fetch(DUONG_DAN_JSON.kyThuatVien);
    danhSachKyThuatVienDaNap = await resp.json();
  } catch (e) {
    danhSachKyThuatVienDaNap = [];
  }
  return danhSachKyThuatVienDaNap;
}
