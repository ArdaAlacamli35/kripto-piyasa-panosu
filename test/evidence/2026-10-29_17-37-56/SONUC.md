# Güvenlik doğrulama testi — 2026-10-29 17-37-56 (Europe/Istanbul)

Sahte WebSocket/REST sunucusu yalnızca 127.0.0.1 üzerinde çalıştı; gerçek Binance'e test isteği gönderilmedi.

| # | Kontrol | Sonuç | Ayrıntı |
|---|---|---|---|
| 1 | CSP başlığı var | GEÇTİ |  |
| 2 | CSP'de unsafe-inline / unsafe-eval yok | GEÇTİ |  |
| 3 | connect-src joker içermiyor (wss: veya * yok) | GEÇTİ | 'self' https://data-api.binance.vision wss://data-stream.binance.vision http://127.0.0.1:9002 ws://127.0.0.1:9001 |
| 4 | Trusted Types zorunlu | GEÇTİ |  |
| 5 | Canlı bağlantı kuruldu | GEÇTİ |  |
| 6 | Zararlı mesajların tamamı reddedildi (11/11) | GEÇTİ |  |
| 7 | Hiçbir script çalışmadı (window.__xss tanımsız) | GEÇTİ |  |
| 8 | alert penceresi açılmadı | GEÇTİ |  |
| 9 | DOM'a <img>/<script>/olay özniteliği eklenmedi | GEÇTİ |  |
| 10 | Prototip kirlenmedi | GEÇTİ |  |
| 11 | Zararlı metin ekranda görünmüyor | GEÇTİ |  |
| 12 | Trusted Types innerHTML yazımını engelledi | GEÇTİ | TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment. |
| 13 | Satır içi script engellendi | GEÇTİ | TypeError: Failed to set the 'textContent' property on 'HTMLScriptElement': This document requires 'TrustedScript' assignment. |
| 14 | İzinsiz wss adresine bağlantı CSP ile engellendi | GEÇTİ | connect-src → wss://kotu-sunucu.example.com/stream, connect-src → https://kotu-sunucu.example.com/sizdir?d= |
| 15 | Veri sızdırma isteği (fetch) engellendi | GEÇTİ | TypeError: Failed to fetch |
| 16 | Yeni Trusted Types politikası oluşturulamadı | GEÇTİ | TypeError: Failed to execute 'createPolicy' on 'TrustedTypePolicyFactory': Policy "kotu" disallowed. |
| 17 | İkinci katmanda da script çalışmadı | GEÇTİ |  |
| 18 | Tarayıcı 5 CSP/Trusted Types ihlali kaydetti | GEÇTİ | require-trusted-types-for → trusted-types-sink ; require-trusted-types-for → trusted-types-sink ; connect-src → wss://kotu-sunucu.example.com/stream ; connect-s |
| 19 | CSP ihlal raporları sunucuya ulaştı (5 adet) | GEÇTİ |  |
| 20 | Kopma görünür şekilde bildirildi | GEÇTİ | Bağlantı koptu. 1 sn içinde yeniden denenecek (1. deneme) |
| 21 | Otomatik yeniden bağlandı | GEÇTİ |  |
| 22 | API kapalıyken son başarılı veriyle açıldı | GEÇTİ |  |
| 23 | Boş sonuç durumu gösterildi | GEÇTİ |  |
| 24 | 360 px genişlikte yatay taşma yok | GEÇTİ |  |

**Genel sonuç: TÜM KONTROLLER GEÇTİ**
