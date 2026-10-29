// Günlük anlık görüntü: GitHub Actions her derlemede çalıştırır ve public/data/snapshot.json yazar.
// API kapalıyken uygulama ilk açılışta bu "son başarılı veri" ile açılır.
import { writeFile, mkdir } from 'node:fs/promises';
import { SYMBOLS, RANGES, REST_BASE } from '../src/config.js';
import { RestTickers, RestKlines, Snapshot } from '../src/schemas.js';

async function get(path) {
  const res = await fetch(`${REST_BASE}${path}`, { headers: { 'User-Agent': 'kripto-piyasa-panosu snapshot' } });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tickers = RestTickers.parse(await get(`/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(SYMBOLS))}`));
const corrKlines = {};
const klines = {};
for (const s of SYMBOLS) {
  corrKlines[s] = RestKlines.parse(await get(`/api/v3/klines?symbol=${s}&interval=5m&limit=289`));
  await sleep(200);
  for (const r of RANGES) {
    klines[`${s}:${r.id}`] = RestKlines.parse(await get(`/api/v3/klines?symbol=${s}&interval=${r.interval}&limit=${r.limit}`));
    await sleep(200);
  }
}
const snap = Snapshot.parse({ savedAt: Date.now(), tickers, corrKlines, klines });
await mkdir('public/data', { recursive: true });
await writeFile('public/data/snapshot.json', JSON.stringify(snap));
console.log(`snapshot.json yazıldı: ${new Date(snap.savedAt).toISOString()}`);
