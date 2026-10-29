# Olay müdahale runbook'u: "API anahtarım sızdı"

**Kapsam:** `CLOUDFLARE_API_TOKEN` (Pages: Edit) veya `CLOUDFLARE_ANALYTICS_TOKEN` (Analytics: Read) bir commit'e, loga, ekran görüntüsüne ya da sohbete sızdı.
**Hedef süre:** Tespitten sonra en geç 15 dakikada iptal.
**Sorumlu:** Arda Alaçamlı (depo ve Cloudflare hesabı sahibi).

## 1. Tespit (0. dakika)
Sızıntıyı şu kaynaklardan biri bildirir:
- GitHub **secret scanning / push protection** uyarısı (e-posta veya *Security → Secret scanning*)
- CI'daki **gitleaks** adımının başarısız olması
- Cloudflare'den beklenmedik yayın e-postası, ya da *Workers & Pages → Deployments* listesinde tanımadığın bir yayın
- Bir kişinin bildirimi (security.txt / özel güvenlik bildirimi)

Not al: Ne zaman fark edildi? Hangi token? Nerede göründü (commit hash, log satırı, URL)?

## 2. İptal (≤ 15. dakika), ilk yapılacak iş
1. dash.cloudflare.com → *My Profile → API Tokens* → ilgili token → **Roll** (yenile) ya da **Delete**.
2. Token'ın gerçekten geçersiz olduğunu doğrula:
   `curl -s -H "Authorization: Bearer <ESKİ_TOKEN>" https://api.cloudflare.com/client/v4/user/tokens/verify` → `"success": false` dönmeli.

> Önce iptal, sonra temizlik. Commit'i silmek token'ı geçersiz kılmaz: Depo herkese açıktır ve geçmiş kopyalanmış olabilir.

## 3. Yenileme (≤ 30. dakika)
1. Aynı izinlerle yeni token oluştur (Account → Cloudflare Pages → Edit, yalnızca kendi hesabın, 90 gün).
2. GitHub → *Settings → Secrets and variables → Actions* → `CLOUDFLARE_API_TOKEN` → **Update**.
3. *Actions → Yayına al → Run workflow* ile yayının yeni token'la çalıştığını doğrula.

## 4. İnceleme (aynı gün)
- Cloudflare *Audit Log*'da token'ın sızdığı andan iptale kadar yapılan işlemlere bak (yayın, proje silme, ayar değişikliği).
- *Workers & Pages → kripto-piyasa-panosu → Deployments*: Tanımadığın bir yayın varsa son güvenilir yayına **Rollback** yap.
- Canlı sitenin başlıklarını kontrol et: `curl -sI https://kripto-piyasa-panosu.pages.dev | grep -i content-security`
- Sızıntı bir commit'teyse: Dosyayı düzelten bir PR aç. Geçmişi yeniden yazmak gerekiyorsa `git filter-repo` kullan ve GitHub secret scanning uyarısını "revoked" olarak kapat.
- Sızıntının kök nedenini yaz (ör. `.env` commit'lendi, token ekran görüntüsünde göründü) ve tekrarını önleyecek değişikliği yap (ör. `.gitignore`, pre-commit gitleaks).

## 5. Bildirim
- Ders projesi olduğu için: Öğretim elemanına ve güvenlik raporunun "Olaylar" bölümüne kısa not (ne oldu, ne zaman, ne yapıldı).
- Üçüncü taraf etkilendiyse (ör. başka bir hesaba erişildiyse) ilgili sağlayıcıya bildir.
- Kişisel veri işlenmediği için KVKK bildirimi gerekmez. Kişisel veri olsaydı 72 saat içinde KVK Kurulu'na bildirim gerekirdi.

## Önleyici kontroller (zaten açık)
Token'lar yalnızca GitHub Secrets'ta · Gitleaks CI'da · GitHub push protection · Token'lar 90 günlük ve tek izinli · İstemci kodunda hiç anahtar yok (Binance API'si anahtarsız) · `.env` ve `.dev.vars` `.gitignore`'da
