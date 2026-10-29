# Kullanıcı testi

**Tarih:** 29 Ekim 2026 · **Yöntem:** Discord üzerinden ekran paylaşımı, 3 görev, kronometreyle süre ölçümü, yardım yok.
**Katılımcılar:** 2 öğrenci (19 yaş); ikisi de borsa veya kripto takip etmiyor. Kartımdaki kullanıcı "piyasa hareketini anlamaya
çalışan öğrenci" olduğu için uzman olmayan katılımcılar seçildi. Kişisel veri yayımlanmaz; katılımcılar numarayla anılır.

## Görevler

1. Son 24 saatte fiyatı en iyi giden kripto para hangisi?
2. Ethereum'un son 7 günlük fiyat grafiğini aç.
3. Bitcoin ile en çok birlikte hareket eden varlık hangisi?

## Sonuçlar

| Görev | Katılımcı 1 | Katılımcı 2 |
|---|---|---|
| 1. 24 saatte en iyi giden | Başaramadı. Ana fiyat grafiğinin üzerinden geçti; görevin ifadesini anlamadı | Başardı · 36,2 sn |
| 2. ETH 7 gün | Başardı · 5,9 sn | Başardı · 2,6 sn |
| 3. BTC ile birlikte hareket | Başardı · 17,5 sn; korelasyon matrisini anlamaya çalışırken gecikti | Başardı · 30 sn; önce yanlış tabloya baktı, sonra matristen buldu |
| "Neyi değiştirirdin?" | "Veri tabloları, özellikle 24 saatlik getirinin altındaki, sürekli açık olabilir." | "Tasarım değiştirilebilir." |

## Yöntem notu

Katılımcı 1'e site açılır açılmaz görev verildi ve görev "en çok yükselen ya da en az düşen" diye okundu. Görevin ifadesi
anlaşılmadı, bu yüzden Görev 1'deki başarısızlık kısmen test yönteminden kaynaklanıyor. Katılımcı 2 için 20 saniyelik
tanışma süresi eklendi ve Görev 1 "fiyatı en iyi giden" diye sadeleştirildi.

## Bulgu

İki katılımcı da en çok **özet bilgide** zorlandı: "Bugün en iyi giden hangisi?" ve "Hangi çift birlikte hareket ediyor?"
sorularının cevabını grafiklerden kendileri çıkarmak zorunda kaldılar (Görev 1: 36 sn ya da başarısız; Görev 3: 17–30 sn).
Filtreler ise hemen anlaşıldı (Görev 2: 3–6 sn).

## Testten sonra yapılan değişiklik

1. KPI kartlarının altına **"Bugün öne çıkanlar"** şeridi eklendi: 24 saatte en iyi giden, en kötü giden ve seçili varlıkla
   en çok birlikte hareket eden varlık (korelasyon değeriyle). Görev 1 ve 3'ün cevabı artık tek bakışta görünüyor.
2. 24 saatlik getiri grafiğinin altındaki **"Veriyi tablo olarak gör"** artık açık geliyor (Katılımcı 1'in önerisi).

Önce: [`kanit/kullanici-testi/once.png`](kanit/kullanici-testi/once.png) · Sonra: [`kanit/kullanici-testi/sonra.png`](kanit/kullanici-testi/sonra.png)

## Ayrıca fark edilen (bir sonraki tur için)

"Tabloda ara" ve "Yön" filtreleri yalnızca sayfanın en altındaki tabloyu etkiliyor; kullanıcı yazınca ekranda değişiklik
görmeyebilir. Filtre kutusu tabloya taşınabilir ya da sonuç sayısı filtrenin yanında gösterilebilir.
