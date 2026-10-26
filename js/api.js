/* =========================================================
   API.JS - MO DUN DU LIEU CUA FIXFLOW
   Tap trung MOI thao tac doc/ghi du lieu vao mot cho:
   - Doc du lieu mau tu thu muc assets/data/ (dung fetch)
   - Doc/ghi localStorage (ticket dang xu ly, du lieu tung ticket, che do sang/toi)
   Cac mo dun giao dien chi goi ham o day, khong tu goi localStorage.
   ========================================================= */

/* ---------- 1. Cac khoa localStorage dang dung (giu nguyen ten cu) ---------- */

const KHOA_TICKET_DANG_XU_LY = "fixflowTicketDangXuLy";
const KHOA_DU_LIEU_TICKET = "fixflowDuLieuTicket";
const KHOA_GIAO_DIEN = "fixflowGiaoDien";
const KHOA_PHIEN_BAN_DU_LIEU = "fixflowPhienBanDuLieu";

// Doi phien ban khi bo du lieu mau thay doi cau truc -> xoa du lieu cu mot lan
const PHIEN_BAN_DU_LIEU_MAU = "3";

/* ---------- 2. Doc du lieu mau tu file JSON ---------- */

// Doc mot file JSON trong assets/data/.
// Luu y: can chay qua mot may chu tinh (vi du VS Code Live Server),
// vi trinh duyet khong cho fetch() file JSON khi mo truc tiep bang file://
async function layDuLieuJSON(tenFile) {
  const duongDan = "assets/data/" + tenFile;
  try {
    const phanHoi = await fetch(duongDan);
    if (!phanHoi.ok) {
      throw new Error("Khong doc duoc " + duongDan + " (ma loi " + phanHoi.status + ")");
    }
    return await phanHoi.json();
  } catch (loi) {
    console.error("FixFlow: loi doc du lieu mau", duongDan, loi);
    return null;
  }
}

// Nap toan bo du lieu mau cua 6 trang. Tra ve null neu file nao bi loi
// de main.js biet ma bao loi cho nguoi dung thay vi dung im lang.
async function napDuLieuMau() {
  const [ticketTongQuan, ticketHangDoi, lichSu, thongKe, checklist] = await Promise.all([
    layDuLieuJSON("tickets-tong-quan.json"),
    layDuLieuJSON("tickets-hang-doi.json"),
    layDuLieuJSON("lich-su.json"),
    layDuLieuJSON("thong-ke.json"),
    layDuLieuJSON("checklist.json")
  ]);

  if (!ticketTongQuan || !ticketHangDoi || !lichSu || !thongKe || !checklist) {
    return null;
  }

  return {
    danhSachTicket: ticketTongQuan,
    danhSachTicketHangDoi: ticketHangDoi,
    danhSachLichSu: lichSu,
    duLieuHieuSuat: thongKe.hieuSuat,
    tiLeDungSLA: thongKe.tiLeDungSLA,
    duLieuThongKe: thongKe.theoKy,
    loiThuongGap: thongKe.loiThuongGap,
    danhGiaGanDay: thongKe.danhGiaGanDay,
    checklistMacDinh: checklist.macDinh,
    goiYBuocAI: checklist.goiYAI,
    khoGoiYThem: checklist.khoGoiYThem,
    danhSachMauChecklist: checklist.mauChecklist,
    goiYBuocTheoLoai: checklist.goiYBuocTheoLoai,
    nhomTheoLoai: checklist.nhomTheoLoai
  };
}


/* ---------- 3. Ticket dang xu ly (chuyen tu trang Hang doi sang trang Dang sua) ---------- */

function luuTicketDangXuLy(ticket) {
  try {
    // Luu ca ticket da chon de trang Dang sua hien thi dung du lieu cua ticket do.
    localStorage.setItem(KHOA_TICKET_DANG_XU_LY, JSON.stringify(ticket));
  } catch (loi) {
    // Khong luu duoc thi bo qua, trang Dang sua se hien noi dung mac dinh
  }
}

function docTicketDangXuLy() {
  try {
    const chuoiTicket = localStorage.getItem(KHOA_TICKET_DANG_XU_LY);
    if (chuoiTicket === null) {
      return null;
    }
    return JSON.parse(chuoiTicket);
  } catch (loi) {
    // Du lieu bi hong hoac bi chan thi tra ve null
    return null;
  }
}

/* ---------- 4. Du lieu xu ly theo tung ticket ---------- */
// Toan bo du lieu nguoi dung nhap o trang "Dang sua" duoc luu trong MOT khoa, dang doi
// tuong: { "TK-2025-001": { trangThai, ghiChu, checklist, ... }, "TK-2025-014": {...} }
// Nho vay moi ticket co du lieu rieng, khoa chinh la ma ticket nen khong bi trung lap.

function docKhoDuLieuTicket() {
  try {
    const chuoiDuLieu = localStorage.getItem(KHOA_DU_LIEU_TICKET);
    if (chuoiDuLieu === null) {
      return {};
    }
    const duLieu = JSON.parse(chuoiDuLieu);
    if (duLieu === null || typeof duLieu !== "object") {
      return {};
    }
    return duLieu;
  } catch (loi) {
    // Du lieu bi hong hoac trinh duyet chan localStorage thi coi nhu chua co gi
    return {};
  }
}

function docDuLieuTicket(maTicket) {
  const kho = docKhoDuLieuTicket();
  if (kho[maTicket]) {
    return kho[maTicket];
  }
  return null;
}

function luuDuLieuTicket(maTicket, duLieu) {
  try {
    const kho = docKhoDuLieuTicket();
    kho[maTicket] = duLieu;
    localStorage.setItem(KHOA_DU_LIEU_TICKET, JSON.stringify(kho));
  } catch (loi) {
    // Khong luu duoc thi bo qua, du lieu van dung trong phien hien tai
  }
}

// Xoa du lieu cua phien ban du lieu mau cu (neu co).
// Chi xoa 2 khoa cua FixFlow, KHONG goi localStorage.clear().
function xoaDuLieuMauCu() {
  try {
    const phienBanDaLuu = localStorage.getItem(KHOA_PHIEN_BAN_DU_LIEU);
    if (phienBanDaLuu === PHIEN_BAN_DU_LIEU_MAU) return;

    localStorage.removeItem(KHOA_DU_LIEU_TICKET);
    localStorage.removeItem(KHOA_TICKET_DANG_XU_LY);
    localStorage.setItem(KHOA_PHIEN_BAN_DU_LIEU, PHIEN_BAN_DU_LIEU_MAU);
  } catch (loi) {
    // Trinh duyet chan localStorage (che do rieng tu, mo file truc tiep bang file://)
    // thi bo qua, trang van chay binh thuong voi du lieu mau
  }
}


/* ---------- 5. Kho du lieu mau trong bo nho ---------- */
// Du lieu mau nam trong assets/data/*.json va duoc nap MOT LAN luc mo trang
// (xem ham napDuLieuMau + ganDuLieuMau). Cac mang duoi day duoc khai bao const
// va do du lieu vao bang push() de moi mo dun dung chung dung mot tham chieu.

const danhSachTicket = [];            // 12 viec cua trang Tong quan
const danhSachTicketHangDoi = [];     // 13 ticket cua trang Hang doi
const danhSachLichSu = [];            // cac dong cua trang Lich su
const danhSachMauChecklist = [];      // mau checklist cua trang Checklist
const duLieuHieuSuat = [];            // bieu do 8 tuan o trang Tong quan
const loiThuongGap = [];              // thong ke loi thuong gap
const danhGiaGanDay = [];             // danh gia gan day
const CHECKLIST_MAC_DINH = [];        // checklist mac dinh cua ticket chua co du lieu
const goiYBuocAI = [];                // goi y AI mac dinh
const khoGoiYThem = [];               // kho goi y dung cho nut "Tao lai"

let tiLeDungSLA = 92;
let duLieuThongKe = {};
let goiYBuocTheoLoai = {};
let nhomTheoLoai = {};

// Thong tin ky thuat vien dang dang nhap (mo phong, du an khong co dang nhap that)
const tenKyThuatVien = "Bùi Huy Quân";
const tenVaiTro = "Kỹ thuật viên";

// Chep noi dung mang nguon vao mang dich ma KHONG doi tham chieu cua mang dich
function chepMang(dich, nguon) {
  dich.length = 0;
  for (let i = 0; i < nguon.length; i++) {
    dich.push(nguon[i]);
  }
}

// Nhan du lieu vua fetch tu JSON (xem napDuLieuMau) va do vao cac mang dung chung
function ganDuLieuMau(duLieu) {
  chepMang(danhSachTicket, duLieu.danhSachTicket);
  chepMang(danhSachTicketHangDoi, duLieu.danhSachTicketHangDoi);
  chepMang(danhSachLichSu, duLieu.danhSachLichSu);
  chepMang(danhSachMauChecklist, duLieu.danhSachMauChecklist);
  chepMang(duLieuHieuSuat, duLieu.duLieuHieuSuat);
  chepMang(loiThuongGap, duLieu.loiThuongGap);
  chepMang(danhGiaGanDay, duLieu.danhGiaGanDay);
  chepMang(CHECKLIST_MAC_DINH, duLieu.checklistMacDinh);
  chepMang(goiYBuocAI, duLieu.goiYBuocAI);
  chepMang(khoGoiYThem, duLieu.khoGoiYThem);

  tiLeDungSLA = duLieu.tiLeDungSLA;
  duLieuThongKe = duLieu.duLieuThongKe;
  goiYBuocTheoLoai = duLieu.goiYBuocTheoLoai;
  nhomTheoLoai = duLieu.nhomTheoLoai;
}

/* ---------- 6. Cac ham truy van du lieu ---------- */

// Tim ticket trong danh sach Hang doi theo ma ticket
function layTicketTheoMa(maTicket) {
  for (let i = 0; i < danhSachTicketHangDoi.length; i++) {
    if (danhSachTicketHangDoi[i].ma === maTicket) {
      return danhSachTicketHangDoi[i];
    }
  }
  return null;
}

// Lay cac viec cua hom nay (dung cho trang Tong quan va nut thong bao tren thanh tren)
function layViecHomNay() {
  const ketQua = [];
  for (let i = 0; i < danhSachTicket.length; i++) {
    if (danhSachTicket[i].homNay === true) {
      ketQua.push(danhSachTicket[i]);
    }
  }
  return ketQua;
}

/* ---------- 7. Dong bo du lieu da luu sang cac trang khac ---------- */

// Nhom danh muc o trang Lich su dung ten ngan hon o trang Hang doi
function doiDanhMucLichSu(danhMuc) {
  if (danhMuc === "Mạng máy tính") return "Mạng";
  if (danhMuc === "Thiết bị trình chiếu") return "Trình chiếu";
  return danhMuc;
}

function tinhKetQuaSLA(ticket, duLieu) {
  if (ticket === null) return "Đúng SLA";
  if (duLieu.thoiGianXuLy <= ticket.gioConLai * 0.8) return "Sớm hạn";
  if (duLieu.thoiGianXuLy <= ticket.gioConLai) return "Đúng SLA";
  return "Trễ hạn";
}

function doiTenThietBiLichSu(maThietBi) {
  // Bang lich su ghi ten thiet bi cho de doc, kem ma de van tra cuu duoc
  const tienTo = maThietBi.substring(0, 2);
  let tenThietBi = "";

  if (tienTo === "AC") tenThietBi = "Máy lạnh";
  else if (tienTo === "RT") tenThietBi = "Router WiFi";
  else if (tienTo === "SW") tenThietBi = "Switch";
  else if (tienTo === "PJ") tenThietBi = "Máy chiếu";
  else if (tienTo === "PR") tenThietBi = "Máy in";
  else if (tienTo === "PC") tenThietBi = "Máy tính";
  else if (tienTo === "CM") tenThietBi = "Camera";
  else if (tienTo === "EL") tenThietBi = "Hệ thống điện";
  else if (tienTo === "SP") tenThietBi = "Loa";

  if (tenThietBi === "") {
    return maThietBi;
  }
  return tenThietBi + " " + maThietBi;
}

function themVaoLichSu(maTicket, duLieu) {
  // Khong them trung: ticket da co trong bang lich su thi bo qua
  for (let i = 0; i < danhSachLichSu.length; i++) {
    if (danhSachLichSu[i].ma === maTicket) {
      return;
    }
  }

  const ticket = layTicketTheoMa(maTicket);
  if (ticket === null) return;

  let thoiGian = "0.1h";
  if (duLieu.thoiGianXuLy > 0) {
    thoiGian = duLieu.thoiGianXuLy.toFixed(1) + "h";
  }

  danhSachLichSu.unshift({
    ma: maTicket,
    thietBi: doiTenThietBiLichSu(ticket.maThietBi),
    danhMuc: doiDanhMucLichSu(ticket.danhMuc),
    thoiGian: thoiGian,
    danhGia: 0,
    ketQua: tinhKetQuaSLA(ticket, duLieu),
    ngayTruoc: 0,
    ghiChu: duLieu.ghiChu || "",
    thoiDiemHoanThanh: duLieu.thoiDiemHoanThanh || ""
  });
}

// Ap dung du lieu da luu vao du lieu mau cua 3 trang:
// Hang doi (trang thai ticket), Tong quan (trang thai viec), Lich su (them dong moi)
function apDungDuLieuDaLuu() {
  const kho = docKhoDuLieuTicket();
  const cacMa = Object.keys(kho);

  for (let i = 0; i < cacMa.length; i++) {
    const maTicket = cacMa[i];
    const duLieu = kho[maTicket];
    if (duLieu === null || typeof duLieu !== "object") continue;

    const ticketHangDoi = layTicketTheoMa(maTicket);
    if (ticketHangDoi === null) continue;

    ticketHangDoi.trangThai = duLieu.trangThai;
    ticketHangDoi.statusCode = duLieu.statusCode ||
      (duLieu.trangThai === "Hoàn thành" ? "completed" : "in_progress");

    if (duLieu.trangThai === "Hoàn thành") {
      // Trang Tong quan: danh dau viec cung thiet bi la da hoan thanh
      for (let j = 0; j < danhSachTicket.length; j++) {
        const viec = danhSachTicket[j];
        if (viec.maThietBi !== ticketHangDoi.maThietBi) continue;
        if (viec.trangThai === "Hoàn thành") continue;
        viec.trangThai = "Hoàn thành";
        viec.homNay = false;
        viec.thoiGianXuLy = duLieu.thoiGianXuLy;
      }

      themVaoLichSu(maTicket, duLieu);
    } else if (duLieu.trangThai === "Tạm dừng") {
      for (let j = 0; j < danhSachTicket.length; j++) {
        if (danhSachTicket[j].maThietBi === ticketHangDoi.maThietBi) {
          danhSachTicket[j].trangThai = "Tạm dừng";
        }
      }
    }
  }
}

/* ---------- 8. Che do sang / toi ---------- */

const GIAO_DIEN_SANG = "sang";
const GIAO_DIEN_TOI = "toi";

// Chi co gia tri "toi" moi la che do toi, con lai (chua luu / "sang") la che do sang.
function docGiaoDienDaLuu() {
  try {
    if (localStorage.getItem(KHOA_GIAO_DIEN) === GIAO_DIEN_TOI) return GIAO_DIEN_TOI;
  } catch (loi) {
    // Trinh duyet chan localStorage -> mac dinh che do sang
  }

  return GIAO_DIEN_SANG;
}

function luuGiaoDien(giaoDien) {
  try {
    localStorage.setItem(KHOA_GIAO_DIEN, giaoDien);
  } catch (loi) {
    // Khong luu duoc thi van doi giao dien cho trang hien tai
  }
}

// Danh sach ten ham/du lieu ma cac mo dun khac duoc phep dung tu api.js
// (mang du lieu duoc export truc tiep de cac trang cung doc/sua tren MOT ban duy nhat)
export {
  KHOA_GIAO_DIEN,
  GIAO_DIEN_SANG,
  GIAO_DIEN_TOI,
  tenKyThuatVien,
  tenVaiTro,
  danhSachTicket,
  danhSachTicketHangDoi,
  danhSachLichSu,
  danhSachMauChecklist,
  duLieuHieuSuat,
  duLieuThongKe,
  tiLeDungSLA,
  loiThuongGap,
  danhGiaGanDay,
  CHECKLIST_MAC_DINH,
  goiYBuocAI,
  khoGoiYThem,
  goiYBuocTheoLoai,
  nhomTheoLoai,
  napDuLieuMau,
  ganDuLieuMau,
  layTicketTheoMa,
  layViecHomNay,
  apDungDuLieuDaLuu,
  luuTicketDangXuLy,
  docTicketDangXuLy,
  docDuLieuTicket,
  luuDuLieuTicket,
  xoaDuLieuMauCu,
  docGiaoDienDaLuu,
  luuGiaoDien
};
