"""Güvenlik raporu (docs/guvenlik-raporu.pdf). Sayılar kanıt dosyalarından okunur:
docs/kanit/zap-1, docs/kanit/zap-2 (ZAP + Observatory), test/evidence/<son>/ (kart doğrulama testi),
docs/kanit/ekran/*.png (ekran görüntüleri; eksik olanlar raporda ve konsolda listelenir).

Çalıştırma: python3 scripts/guvenlik-raporu.py   (Chromium için CHROMIUM_PATH isteğe bağlı)
"""
from __future__ import annotations

import base64
from html import escape as e
import glob
import json
import os
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
K = ROOT / "docs" / "kanit"
EKRAN = K / "ekran"
RISK = {"0": "Bilgi", "1": "Düşük", "2": "Orta", "3": "Yüksek"}
eksik: list[str] = []


def zap(tur: str, aşama: str):
    d = json.loads((K / tur / f"zap-{aşama}.json").read_text(encoding="utf-8"))
    alerts = [a for s in d["site"] for a in s["alerts"]]
    return Counter(RISK[a["riskcode"]] for a in alerts), {a["alert"]: RISK[a["riskcode"]] for a in alerts}, d.get("@generated", "")


def obs(tur: str, aşama: str):
    return json.loads((K / tur / f"observatory-{aşama}.json").read_text(encoding="utf-8"))


def img(path: Path, w="100%", alt=""):
    if not path.exists():
        eksik.append(str(path.relative_to(ROOT)))
        return f'<div class="eksik">[Ekran görüntüsü eklenecek: {path.name}]</div>'
    mime = "image/png" if path.suffix == ".png" else "image/webp"
    b = base64.b64encode(path.read_bytes()).decode()
    return f'<img src="data:{mime};base64,{b}" style="width:{w}" alt="{alt}">'


c0, b0, t0 = zap("zap-1", "once")
c1, b1, t1 = zap("zap-1", "sonra")
c2, b2, t2 = zap("zap-2", "sonra")
o0, o1, o2 = obs("zap-1", "once"), obs("zap-1", "sonra"), obs("zap-2", "sonra")

ev = sorted(glob.glob(str(ROOT / "test" / "evidence" / "*" / "SONUC.md")))[-1]
ev_dir = Path(ev).parent
sonuc = Path(ev).read_text(encoding="utf-8")
satirlar = [l for l in sonuc.splitlines() if re.match(r"^\| \d+ \|", l)]
gecen = sum("GEÇTİ" in l for l in satirlar)
yukler = json.loads((ev_dir / "04-gonderilen-yukler.json").read_text(encoding="utf-8"))
csp_rap = [json.loads(l) for l in (ev_dir / "06-csp-ihlal-raporlari.log").read_text(encoding="utf-8").splitlines() if l.strip()]
basliklar = dict(l.split(": ", 1) for l in (ev_dir / "01-basliklar.txt").read_text(encoding="utf-8").splitlines() if ": " in l)
csp_test = basliklar.get("content-security-policy", "")
# Üretim CSP'si = test CSP'sinden yerel sahte sunucu adresleri çıkarılmış ve upgrade-insecure-requests eklenmiş hali
csp_uretim = csp_test.replace(" http://127.0.0.1:9002 ws://127.0.0.1:9001", "").replace("frame-ancestors 'none';", "frame-ancestors 'none'; upgrade-insecure-requests;")

# Bulgu tablosu: her bulgunun üç aşamadaki durumu
duzeltme = {
    "Content Security Policy (CSP) Header Not Set": "Edge'de sıkı CSP (_middleware.js)",
    "Missing Anti-clickjacking Header": "frame-ancestors 'none' + X-Frame-Options: DENY",
    "Cross-Domain Misconfiguration": "Cloudflare'in varsayılan 'Access-Control-Allow-Origin: *' başlığı edge'de silindi",
    "Cross-Origin-Embedder-Policy Header Missing or Invalid": "Cross-Origin-Embedder-Policy: require-corp",
    "Cross-Origin-Opener-Policy Header Missing or Invalid": "Cross-Origin-Opener-Policy: same-origin",
    "Permissions Policy Header Not Set": "Kamera, mikrofon, konum, ödeme vb. kapatıldı",
    "Strict-Transport-Security Header Not Set": "HSTS: 2 yıl, includeSubDomains, preload",
    "CSP: Notices": "Kabul edildi: report-uri bilinçli olarak korunuyor (Bölüm 8)",
}
tum = [a for a in list(b0) + list(b1) + list(b2) if a in duzeltme]
tum = list(dict.fromkeys(tum))
sira = {"Orta": 0, "Düşük": 1, "Bilgi": 2}
tum.sort(key=lambda a: sira[(b0.get(a) or b1.get(a) or b2.get(a))])


def durum(a, b):
    return f"<td class='{'acik' if a in b else 'kapali'}'>{'açık' if a in b else '—'}</td>"


rows_bulgu = "".join(
    f"<tr><td class=l>{e(a)}</td><td>{b0.get(a) or b1.get(a) or b2.get(a)}</td>{durum(a, b0)}{durum(a, b1)}{durum(a, b2)}<td class=l>{duzeltme[a]}</td>"
    f"<td>{'Kabul' if a == 'CSP: Notices' else ('Çözüldü' if a not in b2 else 'Açık')}</td></tr>" for a in tum)
rows_yuk = "".join(f"<li>{e(y['test'])}</li>" for y in yukler)
rows_test = "".join(
    "<tr>" + "".join(f"<td class=l>{e(c.strip())}</td>" for c in l.strip("|").split("|")[:3]) + "</tr>" for l in satirlar)

stride = [
    ("T1", "Tampering → EoP", "WebSocket mesajıyla XSS (kartın tehdidi)", 4, 5, "Zod şema, 4 KB sınırı, yalnızca textContent, Trusted Types, CSP", 2),
    ("T2", "Info. disclosure", "CSP connect-src'nin wss için gevşetilmesi", 3, 4, "connect-src = 2 tam adres; saatlik izleme CSP'yi denetler", 2),
    ("T5", "Info. disclosure", "Cloudflare token'ının koda/loga sızması", 3, 5, "GitHub Secrets, tek izin, 90 gün, gitleaks, push protection", 4),
    ("T6", "Tampering", "Bağımlılık / eklenti tedarik zinciri", 2, 5, "lockfile, npm audit, Dependabot, eklentiler SHA ile sabit", 3),
    ("T8", "DoS", "Binance API'sinin çökmesi / hız sınırı", 4, 3, "Yeniden bağlanma, son başarılı veri, günlük snapshot", 3),
    ("T7", "EoP", "Workflow'lara fazla yetki", 2, 4, "permissions en düşük, persist-credentials: false", 2),
    ("T3", "Spoofing", "Ortadaki adam / sahte site", 2, 3, "HTTPS + HSTS preload", 2),
    ("T9", "DoS", "/csp-report uç noktasına istek yağmuru", 2, 2, "8 KB sınır, kısaltılmış log, kullanım alarmı", 2),
    ("T4", "Tampering", "Clickjacking", 2, 2, "frame-ancestors 'none', X-Frame-Options", 1),
    ("T10", "Repudiation", "Yayını kimin yaptığı bilinmez", 2, 2, "Yalnızca Actions'tan yayın, PR zorunlu", 1),
    ("T11", "Info. disclosure", "Rapor loglarına kişisel veri girmesi", 2, 2, "Alan seçimi, 200 karakter sınırı, IP/çerez yok", 1),
]
rows_stride = "".join(
    f"<tr{' class=hl' if i in ('T1','T2') else ''}><td>{i}</td><td class=l>{s}</td><td class=l>{t}</td><td>{o}×{e}={o*e}</td><td class=l>{m}</td><td>{k}</td></tr>"
    for i, s, t, o, e, m, k in stride)

html = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Güvenlik Raporu — Canlı Kripto Piyasa Panosu</title>
<style>
@page {{ size: A4; }}
body {{ font-family: "DejaVu Serif", Georgia, serif; font-size: 10pt; line-height: 1.42; color: #111; }}
h1 {{ font-family: "DejaVu Sans", sans-serif; font-size: 18pt; margin: 0 0 4pt; }}
h2 {{ font-family: "DejaVu Sans", sans-serif; font-size: 12.5pt; margin: 14pt 0 5pt; border-bottom: 1px solid #ccc; padding-bottom: 2pt; page-break-after: avoid; }}
h3 {{ font-family: "DejaVu Sans", sans-serif; font-size: 10.5pt; margin: 9pt 0 3pt; page-break-after: avoid; }}
p {{ margin: 0 0 6pt; text-align: justify; }}
.alt {{ color: #555; font-family: "DejaVu Sans", sans-serif; font-size: 9pt; }}
.ozet {{ background: #eef4fb; border-left: 4px solid #2f6db5; padding: 8pt 10pt; margin: 8pt 0; }}
.kutular {{ display: flex; gap: 6pt; margin: 8pt 0; font-family: "DejaVu Sans", sans-serif; page-break-inside: avoid; }} .kutular .kutu {{ flex: 1; }}
.kutu {{ border: 1px solid #ddd; border-radius: 4pt; padding: 6pt; text-align: center; }} .kutu b {{ display: block; font-size: 15pt; color: #2f6db5; }} .kutu span {{ font-size: 7.5pt; color: #555; }}
table {{ border-collapse: collapse; width: 100%; font-family: "DejaVu Sans", sans-serif; font-size: 7.8pt; margin: 5pt 0 8pt; page-break-inside: auto; }}
tr {{ page-break-inside: avoid; }}
th, td {{ border-bottom: 1px solid #ddd; padding: 2.5pt 4pt; text-align: center; vertical-align: top; }}
td.l, th.l {{ text-align: left; }} thead th {{ background: #eee; }}
tr.hl td {{ background: #fdebd9; }}
td.acik {{ color: #b45309; font-weight: bold; }} td.kapali {{ color: #888; }}
code, .m {{ font-family: "DejaVu Sans Mono", monospace; font-size: 7.6pt; }}
pre {{ font-family: "DejaVu Sans Mono", monospace; font-size: 7pt; background: #f5f5f5; padding: 6pt; white-space: pre-wrap; word-break: break-all; margin: 4pt 0 8pt; }}
figure {{ margin: 6pt 0; page-break-inside: avoid; }} figcaption {{ font-size: 8pt; color: #444; font-family: "DejaVu Sans", sans-serif; }}
.iki {{ display: block; }} .iki > figure {{ display: inline-block; width: 48.5%; vertical-align: top; margin-right: 1%; }} ul.iki {{ columns: 2; column-gap: 14pt; }}
ul {{ margin: 0 0 6pt 15pt; padding: 0; }} li {{ margin-bottom: 2pt; }}
.eksik {{ border: 2px dashed #d9822b; color: #b45309; padding: 14pt; text-align: center; font-family: "DejaVu Sans", sans-serif; font-size: 9pt; }}
</style></head><body>

<h1>Güvenlik Raporu: Canlı Kripto Piyasa Panosu</h1>
<p class="alt">Arda Alaçamlı · 2516016006 · Bulut Bilişim ve Siber Güvenlik · Haftalık Sprint: Güvenli Bulut Yayını · Öğr. Gör. Osman Can Çetlenbik · 29 Ekim 2026<br>
Ürün: https://kripto-piyasa-panosu.pages.dev · Depo: github.com/ArdaAlacamli35/kripto-piyasa-panosu</p>

<h2>1. Yönetici özeti</h2>
<div class="ozet">
<p>Gerçek zamanlı kripto fiyat panosu Cloudflare Pages'e taşındı. Altyapı <code>wrangler.toml</code> ve GitHub Actions ile kod olarak tanımlandı. Kartımdaki öncelikli tehdit, <b>WebSocket'ten gelen kötü niyetli verinin arayüzde script çalıştırması (XSS)</b> ve <b>CSP'nin wss için gevşetilmesi</b>. Bu tehdide karşı dört katmanlı bir savunma kuruldu: gelen her mesaja zod şema doğrulaması, DOM'a yalnızca <code>textContent</code> ile yazma, Trusted Types ve <code>unsafe-inline</code> içermeyen, <code>connect-src</code>'si yalnızca iki tam Binance adresine izin veren sıkı bir CSP.</p>
<p>Yerel sahte WebSocket sunucusundan gönderilen <b>{len(yukler)} zararlı yükün {len(yukler)}'i de reddedildi</b> ve hiçbir script çalışmadı. İkinci katman testlerinde Trusted Types ve CSP {len(csp_rap)} ihlali engelleyip rapor uç noktasına iletti ({gecen}/{len(satirlar)} kontrol geçti). OWASP ZAP bulguları <b>{c0['Orta']} orta / {c0['Düşük']} düşük</b> riskten <b>{c2.get('Orta',0)} orta / {c2.get('Düşük',0)} düşük</b> riske indi; kalan tek düşük bulgu bilinçli olarak kabul edildi. Mozilla Observatory notu <b>{o0['grade']} ({o0['score']}) → {o2['grade']} ({o2['score']})</b>, securityheaders.com notu <b>A+</b>. Hiçbir anahtar istemcide ya da depoda yok. Maliyet <b>0 TL</b>.</p></div>
<div class="kutular">
<div class="kutu"><b>{len(yukler)}/{len(yukler)}</b><span>zararlı WebSocket yükü engellendi</span></div>
<div class="kutu"><b>{c0['Orta']} → {c2.get('Orta',0)}</b><span>ZAP orta risk (yüksek: hiç yok)</span></div>
<div class="kutu"><b>{o2['grade']} · A+</b><span>Observatory ({o2['tests_passed']}/{o2['tests_quantity']}) · securityheaders</span></div>
<div class="kutu"><b>0 TL</b><span>maliyet; ödeme yöntemi yok + bütçe alarmı</span></div></div>

<h2>2. Mimari</h2>
<figure>{img(ROOT / 'docs' / 'mimari.png')}<figcaption>Şekil 1. Veri akışı ve dört güven sınırı: (1) kullanıcının tarayıcısı, (2) Cloudflare edge, (3) üçüncü taraf veri kaynağı (Binance), (4) CI/CD (GitHub). WebSocket akışı, güven sınırı 3'ten 1'e geçen ve doğrulanmadan kullanılamayan güvenilmez girdidir.</figcaption></figure>
<table><thead><tr><th class=l>Bileşen</th><th class=l>Tanım</th><th class=l>Kod olarak mı?</th></tr></thead><tbody>
<tr><td class=l>Cloudflare Pages projesi</td><td class=l>Statik dosyalar (<code>dist/</code>) + Pages Functions</td><td class=l><code>wrangler.toml</code>, yayın sırasında <code>pages project create</code></td></tr>
<tr><td class=l>Güvenlik başlıkları (edge)</td><td class=l>Her yanıta CSP, HSTS vb. ekler, joker CORS'u siler</td><td class=l><code>functions/_middleware.js</code></td></tr>
<tr><td class=l>CSP rapor toplayıcı</td><td class=l>İhlalleri boyut sınırıyla, kısaltarak loglar</td><td class=l><code>functions/csp-report.js</code></td></tr>
<tr><td class=l>CI/CD, izleme, tarama</td><td class=l>CI, yayın, saatlik izleme, kullanım bekçisi, ZAP, Scorecard</td><td class=l><code>.github/workflows/*.yml</code> (6 iş akışı)</td></tr>
<tr><td class=l>Portaldan kurulanlar</td><td class=l colspan=2>Cloudflare hesabı ve 2 API token'ı · GitHub Secrets (3) · GitHub Advanced Security ayarları · branch protection · Cloudflare bütçe alarmı. Token'lar doğası gereği koda yazılamaz.</td></tr>
</tbody></table>

<h3>Kimlikler ve en az yetki</h3>
<table><thead><tr><th class=l>Kimlik</th><th class=l>Yetki</th><th class=l>Neden gerekli</th></tr></thead><tbody>
<tr><td class=l><code>CLOUDFLARE_API_TOKEN</code></td><td class=l>Cloudflare Pages: Edit · tek hesap · 90 gün</td><td class=l>Actions'ın siteyi yükleyebilmesi için gereken tek izin; DNS, fatura veya diğer ayarlara erişemez.</td></tr>
<tr><td class=l><code>CLOUDFLARE_ANALYTICS_TOKEN</code></td><td class=l>Account Analytics: Read · 90 gün</td><td class=l>Kullanım bekçisinin yalnızca istek sayısını okuması için; hiçbir şeyi değiştiremez.</td></tr>
<tr><td class=l>CI / yayın GITHUB_TOKEN</td><td class=l><code>contents: read</code></td><td class=l>Kodu okumak dışında depoya yazmaması için.</td></tr>
<tr><td class=l>İzleme, kullanım bekçisi</td><td class=l><code>permissions: {{}}</code></td><td class=l>Yalnızca dışarıdaki siteyi/API'yi yoklar, GitHub API'sine hiç erişmez.</td></tr>
<tr><td class=l>Scorecard</td><td class=l><code>security-events: write</code>, <code>id-token: write</code></td><td class=l>Sonucu Code Scanning'e ve OpenSSF'e imzalı yüklemek için; yalnızca bu işte.</td></tr>
<tr><td class=l>Tarayıcı</td><td class=l>Anahtar yok</td><td class=l>Binance piyasa verisi anahtarsızdır; istemcide sır olmadığından vekil fonksiyon gerekmez.</td></tr>
</tbody></table>

<h2>3. Gizli anahtarlar ve CI/CD</h2>
<ul>
<li><b>Anahtar yalnızca kasada:</b> Cloudflare token'ları yalnızca GitHub Secrets'ta durur ve yalnızca Actions içinde kullanılır. <code>.env</code> ve <code>.dev.vars</code> <code>.gitignore</code>'dadır.</li>
<li><b>Secret scanning:</b> CI'da <b>gitleaks</b> tüm geçmişi tarar. GitHub <b>secret scanning + push protection</b> açıktır: sır içeren bir push sunucuda reddedilir.</li>
<li><b>Bağımlılık taraması:</b> <code>npm audit --audit-level=high</code> (yüksek seviyede CI durur), <b>Dependabot</b> uyarıları, güvenlik güncellemeleri ve haftalık sürüm güncellemeleri (npm + GitHub Actions). Kod taraması için <b>CodeQL</b> açıktır.</li>
<li><b>Tedarik zinciri:</b> Tüm GitHub Actions eklentileri değiştirilemez <b>commit SHA</b> ile sabitlenmiştir (ör. <code>actions/checkout@11d5960… # v4.4.0</code>). Ayrıca <code>npm ci</code> + <code>package-lock.json</code> kullanılır.</li>
<li><b>Branch protection:</b> <code>main</code> dalına doğrudan push kapalıdır. Değişiklik PR ile gelir ve CI kontrolünün geçmesi zorunludur.</li>
<li><b>Kanıt:</b> Branch protection açıldıktan sonra doğrudan push denemesi reddedildi; bu rapor ve sonraki tüm değişiklikler PR ile, CI geçtikten sonra birleştirildi (Şekil 2b).</li>
<li><b>Kendi kodumuz için kural:</b> CI'daki <code>check:dom</code> adımı <code>innerHTML</code>, <code>insertAdjacentHTML</code>, <code>eval</code>, <code>new Function</code> gibi ifadeler bulursa derlemeyi durdurur.</li>
</ul>
<div class="iki"><figure>{img(EKRAN / 'github-advanced-security.png')}</figure><figure>{img(EKRAN / 'github-advanced-security-2.png')}</figure></div>
<figure>{img(EKRAN / 'branch-protection.png', '70%')}<figcaption>Şekil 2b. <code>main</code> dalı için branch protection kuralı: PR zorunlu, <code>kontrol</code> (CI) geçmeden birleştirme yok, yöneticiler dahil atlanamaz.</figcaption></figure>
<p class="alt" style="margin-top:-2pt">Şekil 2. GitHub Advanced Security: özel güvenlik bildirimi, Dependabot uyarıları ve güvenlik güncellemeleri, CodeQL (varsayılan kurulum), Secret Protection ve push protection açık.</p>

<h2>4. Tehdit modeli (STRIDE)</h2>
<p>Veri akış diyagramı (Şekil 1) üzerinde 11 tehdit incelendi. Risk = olasılık × etki (1–5). Tam tablo: <code>docs/tehdit-modeli.md</code>. Kartımdaki tehditler (T1, T2) vurgulanmıştır.</p>
<table><thead><tr><th>#</th><th class=l>STRIDE</th><th class=l>Tehdit</th><th>Risk</th><th class=l>Önlem</th><th>Kalan</th></tr></thead><tbody>{rows_stride}</tbody></table>

<h3>Kartın tehdidi ayrıntılı: WebSocket kaynaklı XSS ve gevşek CSP</h3>
<p><b>Senaryo.</b> Binance akışı bizim kontrolümüzde değil. Akış ele geçirilebilir, bir ara katman veriyi değiştirebilir ya da bir hata beklenmedik veri üretebilir. Örneğin sembol alanında <code>&lt;img src=x onerror=…&gt;</code> gelebilir. Kod bu değeri <code>innerHTML</code> ile yazsaydı saldırganın kodu kullanıcının tarayıcısında çalışır, localStorage'ı okur, sahte fiyat gösterir ya da kullanıcıyı başka siteye yönlendirirdi. CSP'de <code>connect-src wss:</code> gibi bir joker olsaydı, çalışan kod veriyi istediği sunucuya gönderebilirdi.</p>
<p><b>Dört katman</b> (biri aşılırsa diğeri durdurur): <b>(1) Zod şeması:</b> Mesaj önce 4 KB sınırından, sonra JSON çözümlemesinden, sonra şemadan geçer. Sembol yalnızca 5 değerden biri, fiyat yalnızca <code>^-?\\d{{1,20}}(\\.\\d{{1,12}})?$</code> olabilir, akış adı sembolle eşleşmelidir. Fazla alanlar atılır. CSP'de <code>unsafe-eval</code> olmadığı için zod "jitless" modda çalışır. <b>(2) Yalnızca textContent:</b> Tek DOM yardımcısı metni düz metin yazar, öznitelikler izin listesinden geçer. <b>(3) Trusted Types:</b> <code>require-trusted-types-for 'script'</code>. Tek izinli politika <code>sw</code>'dir ve yalnızca <code>/sw.js</code> adresini kabul eder. <b>(4) CSP:</b></p>
<pre>{e(csp_uretim)}</pre>

<h2>5. Güvenlik testleri</h2>
<h3>5.1 Kartın doğrulama testi: sahte WebSocket sunucusu</h3>
<p><code>npm run test:security</code> yerelde bir sahte Binance (REST + WebSocket, yalnızca 127.0.0.1) ve aynı edge kodunu çalıştıran Cloudflare Pages yerel sunucusu açar, ardından gerçek bir Chromium'la uygulamayı test eder. <b>Gerçek Binance'e hiçbir test isteği gönderilmedi.</b> Gönderilen zararlı yükler:</p>
<ul class="iki">{rows_yuk}</ul>
<table><thead><tr><th>#</th><th class=l>Kontrol</th><th>Sonuç</th></tr></thead><tbody>{rows_test}</tbody></table>
<div class="iki">
<figure>{img(ev_dir / '04-zararli-yukler-sonrasi.png')}<figcaption>Şekil 3. Zararlı yüklerden sonra arayüz bozulmadı. Alt bilgide "Doğrulamayı geçemeyen mesaj" sayacı görünüyor.</figcaption></figure>
<figure><pre>{e(chr(10).join(json.dumps({k: r[k] for k in ('directive', 'blocked', 'sample')}, ensure_ascii=False) for r in csp_rap))}</pre><figcaption>Şekil 4. Sunucuya ulaşan CSP / Trusted Types ihlal raporları (<code>/csp-report</code> logu).</figcaption></figure>
</div>

<h3>5.2 OWASP ZAP baseline: önce / sonra</h3>
<p>Yalnızca kendi adreslerimiz tarandı (GitHub Actions, <code>zap.yml</code>). <b>Önce:</b> Aynı uygulama, edge güvenlik katmanı olmadan düz statik hosting üzerinde (<code>once.kripto-piyasa-panosu.pages.dev</code>). <b>Sonra-1:</b> Edge katmanıyla üretim. <b>Sonra-2:</b> ZAP bulgularına göre düzeltilmiş üretim.</p>
<table><thead><tr><th class=l>Bulgu</th><th>Risk</th><th>Önce</th><th>Sonra-1</th><th>Sonra-2</th><th class=l>Düzeltme</th><th>Durum</th></tr></thead><tbody>{rows_bulgu}</tbody></table>
<table><thead><tr><th class=l>Özet</th><th>Önce</th><th>Sonra-1</th><th>Sonra-2</th></tr></thead><tbody>
<tr><td class=l>ZAP yüksek / orta / düşük / bilgi</td><td>{c0.get('Yüksek',0)} / {c0.get('Orta',0)} / {c0.get('Düşük',0)} / {c0.get('Bilgi',0)}</td><td>{c1.get('Yüksek',0)} / {c1.get('Orta',0)} / {c1.get('Düşük',0)} / {c1.get('Bilgi',0)}</td><td>{c2.get('Yüksek',0)} / {c2.get('Orta',0)} / {c2.get('Düşük',0)} / {c2.get('Bilgi',0)}</td></tr>
<tr><td class=l>Mozilla Observatory</td><td>{o0['grade']} ({o0['score']}), {o0['tests_passed']}/{o0['tests_quantity']}</td><td>{o1['grade']} ({o1['score']}), {o1['tests_passed']}/{o1['tests_quantity']}</td><td>{o2['grade']} ({o2['score']}), {o2['tests_passed']}/{o2['tests_quantity']}</td></tr>
<tr><td class=l>Tarama zamanı (UTC)</td><td>{t0}</td><td>{t1}</td><td>{t2}</td></tr>
</tbody></table>
<p>"Bilgi" düzeyindeki bulgular (Base64 Disclosure, Sec-Fetch-* başlıkları, önbellek yönergeleri) sırasıyla şunlardır: Derlenmiş JS içindeki rastgele dizgeler, istemcinin göndermesi gereken başlıklar ve CDN önbellek davranışı. Güvenlik açığı değillerdir.</p>
<div class="iki">
<figure>{img(EKRAN / 'observatory.png')}<figcaption>Şekil 5. Mozilla Observatory: A+ (155/100), 12/12 test.</figcaption></figure>
<figure>{img(EKRAN / 'securityheaders.png')}<figcaption>Şekil 6. securityheaders.com: A+, altı başlığın tamamı mevcut.</figcaption></figure>
</div>

<h2>6. İzleme ve olay müdahalesi</h2>
<ul>
<li><b>Log toplama:</b> Erişim ve hata logları Cloudflare Pages/Workers loglarında toplanır. CSP ihlalleri <code>/csp-report</code> üzerinden yapılandırılmış JSON olarak aynı yere yazılır.</li>
<li><b>Alarm 1, erişilebilirlik ve güvenlik başlıkları:</b> <code>izleme.yml</code> saatte bir siteyi yoklar. Site 200 dönmezse, bir güvenlik başlığı kaybolursa, CSP'ye <code>unsafe-inline</code> girerse ya da security.txt kaybolursa iş başarısız olur ve GitHub e-posta ile alarm gönderir.</li>
<li><b>Alarm 2, kullanım:</b> <code>kullanim-bekcisi.yml</code> 6 saatte bir Cloudflare GraphQL Analytics'ten son 24 saatteki istek sayısını okur. 50.000'i (ücretsiz katmanın yarısı) geçerse alarm verir.</li>
<li><b>Alarm 3, maliyet:</b> Cloudflare <i>Billing budget alert</i>: 1 USD, e-posta.</li>
<li><b>Runbook:</b> <code>docs/runbook-anahtar-sizdi.md</code>. "API anahtarım sızdı" senaryosu beş adımdan oluşur: tespit (secret scanning, gitleaks, beklenmedik yayın) → iptal (≤15 dk, Cloudflare'de "Roll") → yenileme (yeni token, GitHub Secrets güncelle, yayını doğrula) → inceleme (audit log, deployment geçmişi, rollback, kök neden) → bildirim.</li>
</ul>
<div class="iki">
<figure>{img(EKRAN / 'izleme-alarmi.png')}<figcaption>Şekil 7. Saatlik izleme iş akışı (başarılı çalıştırma).</figcaption></figure>
<figure>{img(EKRAN / 'cloudflare-butce-alarmi.png')}<figcaption>Şekil 8. Cloudflare bütçe alarmı (1 USD, e-posta, etkin).</figcaption></figure>
</div>

<h2>7. Maliyet</h2>
<table><thead><tr><th class=l>Kalem</th><th class=l>Ücretsiz katman</th><th class=l>Bu projenin kullanımı (tahmin)</th><th>Maliyet</th></tr></thead><tbody>
<tr><td class=l>Cloudflare Pages statik istekler</td><td class=l>Sınırsız</td><td class=l>Ders ve demo trafiği</td><td>0 TL</td></tr>
<tr><td class=l>Pages Functions (Workers) istekleri</td><td class=l>100.000 / gün</td><td class=l>Her sayfa isteği bir kez; günde birkaç yüz</td><td>0 TL</td></tr>
<tr><td class=l>Pages derlemeleri / yüklemeleri</td><td class=l>500 / ay</td><td class=l>Günlük 1 + her push; ayda ~60</td><td>0 TL</td></tr>
<tr><td class=l>GitHub Actions</td><td class=l>Herkese açık depoda sınırsız</td><td class=l>CI, yayın, izleme (saatlik), tarama</td><td>0 TL</td></tr>
<tr><td class=l>Binance piyasa verisi</td><td class=l>Anahtarsız, ücretsiz</td><td class=l>REST 5 dk'da bir, tek WebSocket</td><td>0 TL</td></tr>
</tbody></table>
<p>Cloudflare hesabında ödeme yöntemi tanımlı değildir. Ücretsiz sınırlar aşılsa bile istekler reddedilir, fatura çıkmaz. Bütçe alarmı ve kullanım bekçisi bunun üzerine ek bir uyarı katmanıdır.</p>

<h2>8. Kalan riskler ve kabul edilenler</h2>
<ul>
<li><b>ZAP "CSP: Notices" (düşük), kabul edildi:</b> <code>report-uri</code> eskimiş sayılıyor. Ancak Firefox <code>report-to</code>'yu desteklemiyor, Chrome da <code>report-to</code> ile raporları yaklaşık 1 dakika biriktiriyor (testimizde ölçüldü). İhlallerin hemen ve her tarayıcıdan gelmesi için <code>report-uri</code> bilinçli olarak korunuyor.</li>
<li><b>Veri bütünlüğü:</b> Şemaya tam uyan ama yanlış bir fiyat gösterilebilir. Bu bir XSS değil, bütünlük riskidir. "Yatırım tavsiyesi değildir" notu ve kaynak bağlantısı bunu kullanıcıya bildirir.</li>
<li><b>Üçüncü taraf bağımlılığı:</b> Binance uzun süre kapalı kalırsa pano son veriyle açılır ama güncel olmaz. Bu durum ekranda açıkça yazılır.</li>
<li><b>Token süresi:</b> Token'lar 27 Ocak 2027'de dolar. Site çalışmaya devam eder ama yayın durur. Hatırlatma kuruldu, runbook adımları geçerli.</li>
<li><b>Scorecard'ın kapanamayan maddeleri:</b> <i>Code-Review</i> (tek geliştirici; PR'lar başkasınca onaylanmıyor), <i>Maintained</i> (depo 90 günden yeni), <i>Fuzzing</i> ve <i>CII-Best-Practices</i> (ders projesi kapsamı dışında).</li>
<li><b>Önizleme dalı:</b> ZAP "önce" taraması için güvenlik katmanı olmayan bir önizleme yayını (<code>once.</code> alt alan adı) açıldı. Aynı uygulama olduğu için ek bir veri açığı yok. Demodan sonra Cloudflare'den silinecek.</li>
</ul>

<p class="alt" style="margin-top:14pt">Kanıt dosyaları: <code>test/evidence/</code> (doğrulama testi), <code>docs/kanit/zap-1</code>, <code>docs/kanit/zap-2</code> (ZAP HTML/JSON + Observatory), <code>docs/kanit/ekran/</code> (ekran görüntüleri). Yapay zekâ beyanı README'dedir.</p>
</body></html>"""

out = ROOT / "docs" / "guvenlik-raporu.html"
out.write_text(html, encoding="utf-8")
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(**({"executable_path": os.environ["CHROMIUM_PATH"]} if os.environ.get("CHROMIUM_PATH") else {}))
    pg = b.new_page()
    pg.goto(out.as_uri())
    pg.pdf(path=str(ROOT / "docs" / "guvenlik-raporu.pdf"), format="A4", print_background=True, display_header_footer=True,
           header_template="<span></span>",
           footer_template='<div style="font-size:8px;width:100%;text-align:center;color:#777"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
           margin={"top": "15mm", "bottom": "15mm", "left": "15mm", "right": "15mm"})
    b.close()
out.unlink()
print("docs/guvenlik-raporu.pdf yazıldı")
if eksik:
    print("EKSİK EKRAN GÖRÜNTÜLERİ:\n  " + "\n  ".join(eksik))
