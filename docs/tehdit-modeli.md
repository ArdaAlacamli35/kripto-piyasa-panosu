# Tehdit modeli (STRIDE)

Ürün: Canlı Kripto Piyasa Panosu · Veri akış diyagramı: [`mimari.png`](mimari.png)

**Risk puanı = Olasılık (1–5) × Etki (1–5).** 15+ yüksek, 8–14 orta, ≤7 düşük.
Kalan risk, önlemler uygulandıktan sonraki tahmini puandır.

| # | STRIDE | Varlık / akış | Tehdit | O | E | Risk | Önlem (uygulandı) | Kalan |
|---|---|---|---|---|---|---|---|---|
| **T1** | **Tampering → Elevation** | **WebSocket → uygulama** | **Akışa giren beklenmedik veya kötü niyetli veri arayüzde script çalıştırır (XSS)** | 4 | 5 | **20** | Zod şeması (sembol listesi, sayı biçimi, akış–sembol eşleşmesi), 4 KB mesaj sınırı, DOM'a yalnızca `textContent`, Trusted Types (`trusted-types sw`), CSP'de `unsafe-inline` yok, CI'da `innerHTML` yasağı | **2** |
| **T2** | **Tampering / Info. disclosure** | **CSP yapılandırması** | **`connect-src` wss için fazla gevşetilir (`wss:` veya `*`), ele geçirilmiş bir script veriyi istediği sunucuya sızdırır** | 3 | 4 | **12** | `connect-src` yalnızca 2 tam adres; CI izleme iş akışı CSP'de `unsafe-inline` olup olmadığını saatlik denetler; test, joker kullanılmadığını doğrular | **2** |
| T3 | Spoofing | Tarayıcı → site | Sahte site / ortadaki adam saldırısıyla kullanıcı sahte fiyat görür | 2 | 3 | 6 | HTTPS zorunlu, HSTS (2 yıl, preload), `upgrade-insecure-requests` | 2 |
| T4 | Tampering | Clickjacking | Pano başka sitede çerçeve içine alınıp kullanıcı yanıltılır | 2 | 2 | 4 | `frame-ancestors 'none'`, `X-Frame-Options: DENY` | 1 |
| T5 | Info. disclosure | GitHub deposu / CI | Cloudflare API token'ı koda, loga veya commit'e sızar | 3 | 5 | 15 | Token yalnızca GitHub Secrets'ta; yalnızca "Pages: Edit" izni; 90 gün süre; gitleaks + GitHub push protection; runbook | 4 |
| T6 | Tampering | Tedarik zinciri | Bağımlılıkta (d3, zod, vite) zararlı sürüm veya bilinen açık | 2 | 5 | 10 | `package-lock.json`, `npm ci`, `npm audit` (yüksek seviyede CI durur), Dependabot, Scorecard | 4 |
| T7 | Elevation of privilege | GitHub Actions | Workflow'a fazla yetki verilir; ele geçirilen bir adım depoya yazar | 2 | 4 | 8 | Her workflow'da `permissions` en düşük; `persist-credentials: false`; branch protection | 2 |
| T8 | Denial of service | Binance API | API çöker, yavaşlar veya hız sınırı uygular; pano boş kalır | 4 | 3 | 12 | REST 5 dk'da bir; yeniden bağlanma üstel geri çekilmeli; son başarılı veri (localStorage + günlük snapshot); açık hata durumu | 3 |
| T9 | Denial of service | `/csp-report` | Rapor uç noktası istek yağmuruyla doldurulur, ücretsiz kota tükenir | 2 | 2 | 4 | 8 KB gövde sınırı, rapor başına 10 kayıt, kısaltılmış log; kullanım bekçisi alarmı; ödeme yöntemi yok (0 TL) | 2 |
| T10 | Repudiation | Yayın geçmişi | Kimin neyi ne zaman yayına aldığı bilinmez | 2 | 2 | 4 | Yalnızca Actions üzerinden yayın, PR zorunlu (branch protection), Cloudflare deployment geçmişi | 1 |
| T11 | Info. disclosure | `/csp-report` logları | Saldırgan raporun içine kişisel veri / uzun yük koyar, loglara yazılır | 2 | 2 | 4 | Yalnızca belirli alanlar, 200 karakterle kısaltılmış; çerez veya IP loglanmaz | 1 |

## Kartın tehdidi (T1 + T2), ayrıntılı

**Senaryo.** Binance akışı bizim kontrolümüzde değil. Akışın kendisi ele geçirilebilir, bir ara katman veriyi değiştirebilir ya da bir hata beklenmedik veri üretebilir. Örneğin sembol alanında `<img src=x onerror=...>` gelebilir. Kod bu değeri `innerHTML` ile yazarsa kullanıcının tarayıcısında saldırganın kodu çalışır. Bu kod localStorage'ı okuyabilir, sayfayı değiştirip sahte fiyat gösterebilir ya da kullanıcıyı başka siteye yönlendirebilir.

**Savunma katmanları** (biri aşılsa diğeri durdurur):

1. **Şema doğrulama (zod), uygulamanın kapısı.** Her mesaj önce 4 KB sınırından geçer, sonra JSON olarak çözülür, sonra şemaya uyması gerekir:
   - `s` yalnızca 5 sembolden biri olabilir (enum); `<img…>` gibi bir değer daha burada reddedilir.
   - Fiyatlar yalnızca `^-?\d{1,20}(\.\d{1,12})?$` biçiminde olabilir; `1e309`, `NaN`, `<script>` reddedilir.
   - `stream` adı ile `s` sembolü eşleşmek zorundadır (ETH akışında BTC verisi gelemez).
   - Şemada olmayan alanlar (`html`, `__proto__`) atılır.
   - Reddedilen her mesaj sayılır ve arayüzün altında gösterilir.
2. **Yalnızca `textContent`.** DOM'a yazan tek yardımcı (`src/dom.js`) metni her zaman düz metin olarak yazar. Öznitelikler bir izin listesinden geçer, `on*` olay öznitelikleri yazılamaz. CI'daki `check:dom` adımı `innerHTML`, `insertAdjacentHTML`, `eval` gibi ifadeler bulursa derlemeyi durdurur.
3. **Trusted Types.** `require-trusted-types-for 'script'` sayesinde bir geliştirici ileride hata yapıp `innerHTML` kullansa bile tarayıcı bu yazımı reddeder. Tek izinli politika `sw`'dir ve yalnızca `/sw.js` adresini kabul eder.
4. **CSP.** `script-src 'self'` (satır içi script yok), `connect-src` yalnızca iki tam Binance adresi. Bir kod çalışmayı başarsa bile veriyi başka bir sunucuya gönderemez. İhlaller `/csp-report` uç noktasına raporlanır.

**Doğrulama:** `npm run test:security` ([sonuçlar](../test/evidence/)). Yerel sahte WebSocket sunucusu 11 zararlı yük gönderir: 11/11 reddedildi, script çalışmadı, DOM'a öğe eklenmedi. İkinci katman testlerinde Trusted Types ve CSP 5 ihlali engelledi ve bunları sunucuya raporladı.

**Kalan risk (2):** Şemaya tam uyan ama yanlış bir sayı (örneğin gerçek dışı bir fiyat) gösterilebilir. Bu bir bütünlük riskidir, XSS değildir. "Yatırım tavsiyesi değildir" notu ve veri kaynağı bağlantısı bu riski kullanıcıya açıkça bildirir.
