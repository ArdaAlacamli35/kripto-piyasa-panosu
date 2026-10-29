# Kimlikler ve yetkiler (en az yetki)

| Kimlik | Yetki | Neden gerekli (tek cümle) |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Account → Cloudflare Pages → **Edit**, yalnızca kendi hesap, 90 gün | Actions'ın derlenen siteyi Pages'e yükleyebilmesi için gereken tek izin; DNS, Workers ayarları veya fatura bilgisine erişemez. |
| `CLOUDFLARE_ANALYTICS_TOKEN` | Account → Account Analytics → **Read**, 90 gün | Kullanım bekçisinin istek sayısını okuyabilmesi için; hiçbir şeyi değiştiremez ve yayın token'ından ayrıdır. |
| `ci.yml` GITHUB_TOKEN | `contents: read` | Kodu okumak ve taramak dışında depoya hiçbir şey yazmaması için. |
| `deploy.yml` GITHUB_TOKEN | `contents: read` | Yayın Cloudflare token'ıyla yapılır; GitHub tarafında yazma izni gerekmez. |
| `izleme.yml`, `kullanim-bekcisi.yml` | `permissions: {}` | Yalnızca dışarıdaki siteyi/API'yi yoklar; GitHub API'sine hiç erişmez. |
| `scorecard.yml` | `security-events: write`, `id-token: write` (yalnızca bu iş) | Sonucu Code Scanning'e yüklemek ve OpenSSF'e imzalı yayımlamak için; geri kalan her şey `read-all`. |
| `zap.yml` | `contents: read` | Tarama raporunu yalnızca iş çıktısı (artifact) olarak saklar. |
| Tarayıcıdaki uygulama | Anahtar yok | Binance piyasa verisi anahtarsızdır; istemcide sır tutulmadığı için vekil fonksiyona gerek yoktur. |

## Portaldan (tıklayarak) kurulan kaynaklar

Kod dışında elle yapılan ayarlar; her biri raporda ekran görüntüsüyle belgelenir:
1. Cloudflare hesabı ve iki API token'ı (token'lar koda yazılamaz).
2. GitHub Secrets (3 adet).
3. GitHub *Advanced Security*: Dependabot uyarıları ve güncellemeleri, secret scanning, push protection, özel güvenlik bildirimi.
4. GitHub branch protection kuralı (`main`).
5. Cloudflare Notifications: Bütçe/kullanım uyarısı (hesap türü destekliyorsa).

Pages projesi, güvenlik başlıkları, CSP raporu ve tüm CI/CD **kod olarak** tanımlıdır: `wrangler.toml`, `functions/`, `.github/workflows/`.
