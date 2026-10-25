"""
Kiem thu tu dong giao dien FixFlow bang Playwright + Microsoft Edge.

Cach chay (trong thu muc goc du an):
    python -m pip install playwright
    python tests/kiem_thu_ui.py

Script tu mo mot HTTP server tam thoi (http.server) de localStorage hoat dong,
sau do chay tung kich ban va in bang ket qua PASS/FAIL ra man hinh.
"""

import json
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading

from playwright.sync_api import sync_playwright

# Console Windows mac dinh dung cp1252 nen khong in duoc tieng Viet co dau.
# Chuyen stdout sang UTF-8 de log khong bi loi UnicodeEncodeError.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

GOC = Path(__file__).resolve().parent.parent
CONG = 8765
URL_GOC = "http://127.0.0.1:" + str(CONG) + "/"

ket_qua = []


def ghi_ma(ma, ten, dat, chi_tiet=""):
    ket_qua.append({"ma": ma, "ten": ten, "dat": bool(dat), "chi_tiet": chi_tiet})
    print(("PASS " if dat else "FAIL ") + ma + " - " + ten + ("" if dat else " | " + chi_tiet), flush=True)


def chay_server():
    handler = partial(SimpleHTTPRequestHandler, directory=str(GOC))
    server = ThreadingHTTPServer(("127.0.0.1", CONG), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def mo_trang(ctx, duong_dan):
    trang = ctx.new_page()
    # Tu dong chap nhan confirm()/prompt() de test khong bi treo
    trang.on("dialog", xu_ly_hop_thoai)
    trang.goto(URL_GOC + duong_dan, wait_until="load")
    return trang


def xu_ly_hop_thoai(hop_thoai):
    if hop_thoai.type == "prompt":
        hop_thoai.accept("Bước kiểm tra thủ công")
    else:
        hop_thoai.accept()


def dem(trang, selector):
    return trang.locator(selector).count()


def chu(trang, selector):
    o = trang.locator(selector)
    if o.count() == 0:
        return "<khong co phan tu>"
    return (o.first.inner_text() or "").strip()



def chay():
    server = chay_server()
    try:
        with sync_playwright() as p:
            trinh_duyet = p.chromium.launch(channel="msedge", headless=True)
            ctx = trinh_duyet.new_context(viewport={"width": 1440, "height": 900})

            # ---------- T01: trang Hang doi hien thi 3 cot ----------
            trang = mo_trang(ctx, "queue.html")
            so_cho = dem(trang, "#cotChoNhan .the-ticket")
            so_dang = dem(trang, "#cotDangXuLy .the-ticket")
            ghi_ma("T01", "Trang Hang doi ve du ticket o cot Cho nhan va Dang xu ly",
                   so_cho > 0 and so_dang > 0, "cho=%d dang=%d" % (so_cho, so_dang))

            # ---------- T02: nhan viec -> chuyen sang Dang xu ly ----------
            the_dau = trang.locator("#cotChoNhan .the-ticket").first
            ma_ticket = the_dau.locator(".ma-ticket").inner_text().strip()
            the_dau.locator("button").click()
            trang.wait_for_timeout(400)
            so_dang_sau = dem(trang, "#cotDangXuLy .the-ticket")
            ghi_ma("T02", "Bam 'Nhan viec' chuyen ticket sang cot Dang xu ly",
                   so_dang_sau == so_dang + 1, "ma=%s dang=%d->%d" % (ma_ticket, so_dang, so_dang_sau))

            # ---------- T03: mo trang Dang sua dung ticket ----------
            trang02 = mo_trang(ctx, "fixing.html?ticket=" + ma_ticket)
            tieu_de = chu(trang02, "#tieuDeDangSua")
            phu_de = chu(trang02, "#phuDeDangSua")
            ghi_ma("T03", "Mo trang Dang sua bang ?ticket= hien dung ticket",
                   ma_ticket in phu_de and tieu_de != "<khong co phan tu>",
                   "tieuDe=%s | phuDe=%s" % (tieu_de, phu_de))

            # ---------- T04: hop goi y AI hien thi kem danh sach ----------
            hien_hop = trang02.locator("#hopGoiYAI").is_visible()
            so_goi_y = dem(trang02, "#danhSachGoiYAI li")
            ghi_ma("T04", "Hop 'Goi y AI' hien thi kem danh sach buoc goi y",
                   hien_hop and so_goi_y > 0, "hien=%s soGoiY=%d" % (hien_hop, so_goi_y))

            # ---------- T05: nhan tin cay + so buoc goi y ----------
            nhan = chu(trang02, "#nhanDoTinCay")
            so_buoc_goi_y = chu(trang02, "#soGoiY")
            ghi_ma("T05", "Nhan do tin cay va so buoc goi y co du lieu that",
                   "%" in nhan and "bước" in so_buoc_goi_y, "nhan=%s soBuoc=%s" % (nhan, so_buoc_goi_y))

            # ---------- T06: checklist ticket moi bat dau trong ----------
            so_buoc_dau = dem(trang02, "#danhSachBuocXuLy li.dong-buoc")
            co_thong_diep_trong = dem(trang02, "#danhSachBuocXuLy li.thong-diep-trong") == 1
            ghi_ma("T06", "Checklist cua ticket moi bat dau o 0 buoc va co thong diep trong",
                   so_buoc_dau == 0 and co_thong_diep_trong,
                   "soBuoc=%d thongDiepTrong=%s" % (so_buoc_dau, co_thong_diep_trong))

            # ---------- T07: hoan thanh khi checklist trong bi chan ----------
            trang02.locator("#nutHoanThanh").click()
            trang02.wait_for_timeout(300)
            loi_hien = trang02.locator("#loiChecklist").is_visible()
            van_o_trang02 = "fixing.html" in trang02.url
            ghi_ma("T07", "Chan hoan thanh khi checklist trong",
                   loi_hien and van_o_trang02, "loiHien=%s url=%s" % (loi_hien, trang02.url))

            # ---------- T08: Chap nhan goi y AI them buoc vao checklist ----------
            trang02.locator("#nutChapNhan").click()
            trang02.wait_for_timeout(400)
            so_buoc_sau = dem(trang02, "#danhSachBuocXuLy li.dong-buoc")
            ghi_ma("T08", "Bam 'Chap nhan' dua goi y AI vao checklist",
                   so_buoc_sau == so_goi_y, "goiY=%d checklist=%d" % (so_goi_y, so_buoc_sau))

            # ---------- T09: tien do 0/N ----------
            tien_do = chu(trang02, "#soTienDo")
            phan_tram = chu(trang02, "#phanTramChecklist")
            ghi_ma("T09", "Tien do hien thi dung dang n/tong va phan tram",
                   tien_do == "0/" + str(so_buoc_sau) and phan_tram.startswith("0%"),
                   "tienDo=%s phanTram=%s" % (tien_do, phan_tram))

            # ---------- T10: hoan thanh khi chua xong het bi chan ----------
            o_tick = trang02.locator("#danhSachBuocXuLy input[type=checkbox]")
            o_tick.nth(0).check()
            trang02.wait_for_timeout(250)
            trang02.locator("#nutHoanThanh").click()
            trang02.wait_for_timeout(250)
            thong_diep = chu(trang02, "#loiChecklist")
            ghi_ma("T10", "Chan hoan thanh khi con buoc chua xong",
                   "chưa hoàn thành" in thong_diep and "fixing.html" in trang02.url,
                   "loi=%s" % thong_diep)

            # ---------- T11: tick du cac buoc -> 100% ----------
            for i in range(o_tick.count()):
                o_tick.nth(i).check()
            trang02.wait_for_timeout(350)
            tien_do_full = chu(trang02, "#soTienDo")
            phan_tram_full = chu(trang02, "#phanTramChecklist")
            ghi_ma("T11", "Tick het checklist thi tien do dat 100%",
                   tien_do_full == "%d/%d" % (so_buoc_sau, so_buoc_sau) and phan_tram_full.startswith("100%"),
                   "tienDo=%s phanTram=%s" % (tien_do_full, phan_tram_full))

            # ---------- T12: ghi chu duoc luu sau khi tai lai ----------
            trang02.fill("#ghiChuSuaChua", "Da thay cap mang va khoi phuc ket noi.")
            trang02.locator("#nutLuuGhiChu").click()
            trang02.wait_for_timeout(300)
            trang02.reload(wait_until="load")
            ghi_chu_luu = trang02.input_value("#ghiChuSuaChua")
            ghi_ma("T12", "Ghi chu duoc luu va con sau khi tai lai trang",
                   ghi_chu_luu.startswith("Da thay cap mang"), "ghiChu=%s" % ghi_chu_luu)

            # ---------- T13: trang thai tick duoc giu sau khi tai lai ----------
            so_da_tick = trang02.locator("#danhSachBuocXuLy input[type=checkbox]:checked").count()
            ghi_ma("T13", "Trang thai tick checklist duoc giu sau khi tai lai",
                   so_da_tick == so_buoc_sau, "daTick=%d/%d" % (so_da_tick, so_buoc_sau))

            # ---------- T14: hoan thanh ticket -> chuyen sang trang Lich su ----------
            trang02.locator("#nutHoanThanh").click()
            trang02.wait_for_url("**/history.html", timeout=8000)
            ghi_ma("T14", "Hoan thanh ticket thi chuyen sang trang Lich su",
                   "history.html" in trang02.url, "url=%s" % trang02.url)

            # ---------- T15: ticket vua xong co dung 1 dong trong Lich su ----------
            trang03 = mo_trang(ctx, "history.html")
            dong_lich_su = [t.strip() for t in
                            trang03.locator("#bangLichSu tr td:first-child").all_inner_texts()]
            so_lan = dong_lich_su.count(ma_ticket)
            ghi_ma("T15", "Ticket vua hoan thanh xuat hien dung 1 dong trong Lich su",
                   so_lan == 1, "soLan=%d" % so_lan)

            # ---------- T16: tai lai Lich su khong sinh dong trung lap ----------
            trang03.reload(wait_until="load")
            dong_lich_su_2 = [t.strip() for t in
                              trang03.locator("#bangLichSu tr td:first-child").all_inner_texts()]
            so_lan_2 = dong_lich_su_2.count(ma_ticket)
            ghi_ma("T16", "Tai lai trang Lich su khong tao dong trung lap",
                   so_lan_2 == 1, "soLan=%d" % so_lan_2)

            # ---------- T17: ticket da xong thi khoa nut Hoan thanh ----------
            trang02b = mo_trang(ctx, "fixing.html?ticket=" + ma_ticket)
            nut_khoa = trang02b.locator("#nutHoanThanh").is_disabled()
            nhan_trang_thai = chu(trang02b, "#nhanMucDoDangSua")
            ghi_ma("T17", "Ticket da hoan thanh thi nut Hoan thanh bi khoa",
                   nut_khoa and nhan_trang_thai == "Hoàn thành",
                   "disabled=%s nhan=%s" % (nut_khoa, nhan_trang_thai))

            # ---------- T18: checklist cua ticket da xong chi con xem ----------
            o_tick_xong = trang02b.locator("#danhSachBuocXuLy input[type=checkbox]")
            so_checkbox = o_tick_xong.count()
            bi_khoa = so_checkbox > 0 and all(o_tick_xong.nth(i).is_disabled()
                                             for i in range(so_checkbox))
            ghi_ma("T18", "Checklist cua ticket da xong chi con xem, khong tick duoc",
                   bi_khoa, "soCheckbox=%d" % so_checkbox)

            # ---------- T19: dong ho khong bi reset sau khi hoan thanh ----------
            dong_ho = chu(trang02b, "#thoiGianDaXuLy")
            ghi_ma("T19", "Dong ho khong bi reset ve 00:00:00 sau khi hoan thanh",
                   dong_ho != "00:00:00", "dongHo=%s" % dong_ho)

            # ---------- T20: Hang doi dua ticket da xong sang cot Hoan thanh ----------
            trang01b = mo_trang(ctx, "queue.html")
            trong_hoan_thanh = ma_ticket in trang01b.locator("#cotHoanThanh").inner_text()
            khong_con_cho = ma_ticket not in trang01b.locator("#cotChoNhan").inner_text()
            khong_con_dang = ma_ticket not in trang01b.locator("#cotDangXuLy").inner_text()
            ghi_ma("T20", "Ticket da xong chi nam o cot Hoan thanh cua trang Hang doi",
                   trong_hoan_thanh and khong_con_cho and khong_con_dang,
                   "hoanThanh=%s conCho=%s conDang=%s"
                   % (trong_hoan_thanh, khong_con_cho, khong_con_dang))


            # ---------- T21: goi y AI khac nhau theo loai thiet bi ----------
            trang_router = mo_trang(ctx, "fixing.html?ticket=TK-2025-014")
            goi_y_router = trang_router.locator("#danhSachGoiYAI .ten-goi-y").all_inner_texts()
            trang_lanh = mo_trang(ctx, "fixing.html?ticket=TK-2025-018")
            goi_y_lanh = trang_lanh.locator("#danhSachGoiYAI .ten-goi-y").all_inner_texts()
            chuoi_router = " / ".join(goi_y_router[:3])
            chuoi_lanh = " / ".join(goi_y_lanh[:3])
            ghi_ma("T21", "Goi y AI sinh theo dung loai thiet bi va khac nhau giua 2 ticket",
                   len(goi_y_router) > 0 and len(goi_y_lanh) > 0
                   and chuoi_router != chuoi_lanh,
                   "router=%s | mayLanh=%s" % (chuoi_router, chuoi_lanh))

            # ---------- T22: tam dung giu nguyen tien do checklist ----------
            trang04 = mo_trang(ctx, "fixing.html?ticket=TK-2025-019")
            trang04.locator("#nutChapNhan").click()
            trang04.wait_for_timeout(400)
            o_tick2 = trang04.locator("#danhSachBuocXuLy input[type=checkbox]")
            o_tick2.nth(0).check()
            trang04.wait_for_timeout(250)
            trang04.locator("#nutTamDung").click()
            trang04.wait_for_timeout(350)
            nhan_tam_dung = chu(trang04, "#nhanMucDoDangSua")
            trang04.reload(wait_until="load")
            tien_do_sau = chu(trang04, "#soTienDo")
            ghi_ma("T22", "Tam dung giu nguyen tien do checklist",
                   nhan_tam_dung == "Tạm dừng" and tien_do_sau.startswith("1/"),
                   "nhan=%s tienDo=%s" % (nhan_tam_dung, tien_do_sau))

            # ---------- T23: ticket tam dung van o cot Dang xu ly ----------
            trang01c = mo_trang(ctx, "queue.html")
            o_dang = trang01c.locator("#cotDangXuLy").inner_text()
            o_xong = trang01c.locator("#cotHoanThanh").inner_text()
            ghi_ma("T23", "Ticket tam dung nam o cot Dang xu ly, khong phai Hoan thanh",
                   "TK-2025-019" in o_dang and "TK-2025-019" not in o_xong,
                   "trongDang=%s trongXong=%s"
                   % ("TK-2025-019" in o_dang, "TK-2025-019" in o_xong))

            # ---------- T24: them buoc thu cong ----------
            trang04.locator("#nutThemBuoc").click()
            trang04.wait_for_timeout(400)
            co_buoc_moi = "Bước kiểm tra thủ công" in trang04.locator("#danhSachBuocXuLy").inner_text()
            ghi_ma("T24", "Nut 'Them buoc' them duoc buoc thu cong", co_buoc_moi, "")


            # ---------- T25: Tao lai khong ghi de checklist dang lam ----------
            so_truoc = dem(trang04, "#danhSachBuocXuLy li.dong-buoc")
            trang04.locator("#nutTaoLai").click()
            trang04.wait_for_timeout(400)
            so_sau = dem(trang04, "#danhSachBuocXuLy li.dong-buoc")
            ghi_ma("T25", "Bam 'Tao lai' khong ghi de checklist dang lam viec",
                   so_truoc == so_sau, "truoc=%d sau=%d" % (so_truoc, so_sau))

            # ---------- T26: Tu choi goi y giu nguyen checklist ----------
            trang04.locator("#nutTuChoiChecklist").click()
            trang04.wait_for_timeout(350)
            so_sau_tu_choi = dem(trang04, "#danhSachBuocXuLy li.dong-buoc")
            ghi_ma("T26", "Bam 'Tu choi' giu nguyen checklist hien tai",
                   so_sau_tu_choi == so_sau, "soBuoc=%d" % so_sau_tu_choi)

            # ---------- T27: tai lai Hang doi khong mat du lieu ----------
            trang01d = mo_trang(ctx, "queue.html")
            so_xong_truoc = chu(trang01d, "#soHoanThanhCot")
            trang01d.reload(wait_until="load")
            so_xong_sau = chu(trang01d, "#soHoanThanhCot")
            ghi_ma("T27", "Tai lai trang Hang doi khong lam mat du lieu da luu",
                   so_xong_truoc == so_xong_sau, "%s -> %s" % (so_xong_truoc, so_xong_sau))

            # ---------- T28: khong co loi JavaScript tren ca 6 trang ----------
            loi_js = []
            trang_loi = ctx.new_page()
            trang_loi.on("pageerror", lambda e: loi_js.append(str(e)))
            for ten_trang in ["index.html", "queue.html", "fixing.html",
                              "history.html", "checklist.html",
                              "analytics.html"]:
                trang_loi.goto(URL_GOC + ten_trang, wait_until="load")
                trang_loi.wait_for_timeout(300)
            ghi_ma("T28", "Khong co loi JavaScript khi mo ca 6 trang",
                   len(loi_js) == 0, " | ".join(loi_js[:3]))

            # ---------- T29: xuat CSV tao duoc file ----------
            trang05 = mo_trang(ctx, "history.html")
            with trang05.expect_download(timeout=8000) as thong_tin:
                trang05.locator("#nutXuatCSV").click()
            ten_tep = thong_tin.value.suggested_filename
            ghi_ma("T29", "Nut xuat CSV tao duoc file tai ve", ten_tep.endswith(".csv"), "file=%s" % ten_tep)

            # ---------- T30: loc lich su theo ma ticket ----------
            trang05.fill("#tuKhoaLichSu", ma_ticket)
            trang05.wait_for_timeout(400)
            so_dong_loc = trang05.locator("#bangLichSu tr").count()
            ghi_ma("T30", "Loc lich su theo ma ticket tra ve dung 1 dong",
                   so_dong_loc == 1, "soDong=%d" % so_dong_loc)

            # ---------- T31: Chap nhan lan 2 khong nhan doi checklist ----------
            trang06 = mo_trang(ctx, "fixing.html?ticket=TK-2025-026")
            trang06.locator("#nutChapNhan").click()
            trang06.wait_for_timeout(400)
            so_buoc_lan1 = dem(trang06, "#danhSachBuocXuLy li.dong-buoc")
            hop_ai_an = not trang06.locator("#hopGoiYAI").is_visible()
            trang_thai_ai = chu(trang06, "#trangThaiGoiYAI")
            ghi_ma("T31", "Chap nhan goi y AI lan 1 thi hop goi y an va bao da ap dung",
                   so_buoc_lan1 == 5 and hop_ai_an and "Đã áp dụng" in trang_thai_ai,
                   "soBuoc=%d hopAn=%s trangThai=%s" % (so_buoc_lan1, hop_ai_an, trang_thai_ai))

            # ---------- T32: Dung thu cong giu nguyen checklist va chan chap nhan lai ----------
            trang06.locator("#nutDungThuCong").click()
            trang06.wait_for_timeout(300)
            trang_thai_thu_cong = chu(trang06, "#trangThaiGoiYAI")
            so_buoc_thu_cong = dem(trang06, "#danhSachBuocXuLy li.dong-buoc")
            ghi_ma("T32", "Nut 'Dung thu cong' chuyen sang che do tu them buoc, khong mat checklist",
                   "thủ công" in trang_thai_thu_cong and so_buoc_thu_cong == so_buoc_lan1,
                   "trangThai=%s soBuoc=%d" % (trang_thai_thu_cong, so_buoc_thu_cong))

            # ---------- T33: ten nguoi dung hien thi giong nhau o ca 6 trang ----------
            ten_sai = []
            for ten_trang in ["index.html", "queue.html", "fixing.html",
                              "history.html", "checklist.html",
                              "analytics.html"]:
                trang_ten = mo_trang(ctx, ten_trang)
                ten_hien = chu(trang_ten, "#tenNguoiDung")
                anh_hien = chu(trang_ten, "#anhDaiDien")
                if ten_hien != "Bùi Huy Quân" or anh_hien != "BQ":
                    ten_sai.append(ten_trang + ": " + ten_hien + "/" + anh_hien)
                trang_ten.close()
            ghi_ma("T33", "Ten nguoi dung 'Bùi Huy Quân' va avatar 'BQ' hien giong nhau o ca 6 trang",
                   len(ten_sai) == 0, " | ".join(ten_sai))


            # ---------- T34: responsive.css duoc nap va doi bo cuc dung breakpoint ----------
            trang_thieu_css = []
            for ten_trang in ["index.html", "queue.html", "fixing.html",
                              "history.html", "checklist.html",
                              "analytics.html"]:
                trang_r = mo_trang(ctx, ten_trang)
                co_css = trang_r.evaluate(
                    "() => Array.from(document.styleSheets).some(function (s) {"
                    " return (s.href || '').indexOf('css/responsive.css') >= 0"
                    " && s.cssRules.length > 0; })")
                if not co_css:
                    trang_thieu_css.append(ten_trang)
                trang_r.close()

            def so_cot_thong_ke(trang):
                return trang.evaluate(
                    "() => getComputedStyle(document.querySelector('.luoi-thong-ke'))"
                    ".gridTemplateColumns.split(' ').length")

            def vi_tri_thanh_ben(trang):
                return trang.evaluate(
                    "() => getComputedStyle(document.querySelector('.thanh-ben')).position")

            trang_r = mo_trang(ctx, "index.html")
            trang_r.set_viewport_size({"width": 1400, "height": 900})
            trang_r.wait_for_timeout(250)
            to_cot = so_cot_thong_ke(trang_r)
            to_vi_tri = vi_tri_thanh_ben(trang_r)
            trang_r.set_viewport_size({"width": 1000, "height": 900})
            trang_r.wait_for_timeout(250)
            vua_cot = so_cot_thong_ke(trang_r)
            trang_r.set_viewport_size({"width": 500, "height": 900})
            trang_r.wait_for_timeout(250)
            nho_cot = so_cot_thong_ke(trang_r)
            nho_vi_tri = vi_tri_thanh_ben(trang_r)
            trang_r.close()

            dat_t34 = (len(trang_thieu_css) == 0 and to_cot == 4 and to_vi_tri == "sticky"
                       and vua_cot == 2 and nho_cot == 1 and nho_vi_tri == "fixed")
            ghi_ma("T34", "responsive.css duoc nap o ca 6 trang va doi bo cuc dung breakpoint",
                   dat_t34,
                   "thieuCss=%s | 1400px=%d cot/%s | 1000px=%d cot | 500px=%d cot/%s"
                   % (",".join(trang_thieu_css) or "khong", to_cot, to_vi_tri,
                      vua_cot, nho_cot, nho_vi_tri))

            # ---------- T35: che do sang / toi ----------
            def do_sang(mau):
                # Tong 3 kenh mau: cang nho cang toi (thang 0..765)
                so = re.findall(r"\d+", mau or "")
                return sum(int(x) for x in so[:3]) if len(so) >= 3 else -1

            thieu_nut = []
            for ten_trang in ["index.html", "queue.html", "fixing.html",
                              "history.html", "checklist.html", "analytics.html"]:
                trang_d = mo_trang(ctx, ten_trang)
                if dem(trang_d, "#nutGiaoDien") != 1:
                    thieu_nut.append(ten_trang)
                trang_d.close()

            trang_sang = mo_trang(ctx, "index.html")
            mac_dinh = trang_sang.evaluate(
                "() => document.documentElement.getAttribute('data-giao-dien')")
            nen_sang = do_sang(trang_sang.evaluate(
                "() => getComputedStyle(document.body).backgroundColor"))

            trang_sang.locator("#nutGiaoDien").click()
            trang_sang.wait_for_timeout(400)
            sau_bam = trang_sang.evaluate(
                "() => document.documentElement.getAttribute('data-giao-dien')")
            nen_toi = do_sang(trang_sang.evaluate(
                "() => getComputedStyle(document.body).backgroundColor"))
            luu_toi = trang_sang.evaluate("() => localStorage.getItem('fixflowGiaoDien')")
            aria_toi = trang_sang.get_attribute("#nutGiaoDien", "aria-pressed")
            icon_toi_hien = trang_sang.locator(".nut-giao-dien .bieu-tuong-toi").is_visible()
            icon_sang_an = not trang_sang.locator(".nut-giao-dien .bieu-tuong-sang").is_visible()
            trang_sang.close()

            # Mo trang khac trong cung phien: phai giu che do toi da luu
            trang_toi = mo_trang(ctx, "queue.html")
            giu_che_do = trang_toi.evaluate(
                "() => document.documentElement.getAttribute('data-giao-dien')")
            nen_trang_khac = do_sang(trang_toi.evaluate(
                "() => getComputedStyle(document.body).backgroundColor"))

            trang_toi.locator("#nutGiaoDien").click()
            trang_toi.wait_for_timeout(300)
            ve_sang = trang_toi.evaluate(
                "() => document.documentElement.getAttribute('data-giao-dien')")
            luu_sang = trang_toi.evaluate("() => localStorage.getItem('fixflowGiaoDien')")
            trang_toi.close()

            dat_t35 = (len(thieu_nut) == 0 and mac_dinh == "sang" and nen_sang > 600
                       and sau_bam == "toi" and nen_toi < 200 and luu_toi == "toi"
                       and aria_toi == "true" and icon_toi_hien and icon_sang_an
                       and giu_che_do == "toi" and nen_trang_khac < 200
                       and ve_sang == "sang" and luu_sang == "sang")
            ghi_ma("T35", "Nut chuyen che do sang/toi co o ca 6 trang, doi mau va luu vao localStorage",
                   dat_t35,
                   "thieuNut=%s | macDinh=%s/%d | sauBam=%s/%d luu=%s aria=%s icon=%s/%s |"
                   " trangKhac=%s/%d | veSang=%s/%s"
                   % (",".join(thieu_nut) or "khong", mac_dinh, nen_sang, sau_bam, nen_toi,
                      luu_toi, aria_toi, icon_toi_hien, icon_sang_an, giu_che_do,
                      nen_trang_khac, ve_sang, luu_sang))

            trinh_duyet.close()
    finally:
        server.shutdown()

    dat = len([k for k in ket_qua if k["dat"]])
    print("\n===== KET QUA: " + str(dat) + "/" + str(len(ket_qua)) + " PASS =====")
    for k in ket_qua:
        if not k["dat"]:
            print("  FAIL " + k["ma"] + ": " + k["ten"] + " | " + k["chi_tiet"])
    (GOC / "tests" / "ket_qua_kiem_thu.json").write_text(
        json.dumps(ket_qua, ensure_ascii=False, indent=2), encoding="utf-8")
    return 0 if dat == len(ket_qua) else 1


if __name__ == "__main__":
    sys.exit(chay())

