// REST verisi + "son başarılı veri" yedeği.
// Sıra: canlı API → tarayıcı önbelleği (localStorage) → derleme anında alınmış /data/snapshot.json
import { REST_BASE, SYMBOLS } from './config.js';
import { RestTickers, RestKlines, Snapshot } from './schemas.js';

const CACHE_KEY = 'kripto-pano:son-veri:v1';

async function getJson(path, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${REST_BASE}${path}`, {
      signal: ctrl.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (text.length > 512_000) throw new Error('Yanıt çok büyük');
    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}

export async function fetchTickers() {
  const q = encodeURIComponent(JSON.stringify(SYMBOLS));
  return RestTickers.parse(await getJson(`/api/v3/ticker/24hr?symbols=${q}`));
}

export async function fetchKlines(symbol, interval, limit) {
  if (!SYMBOLS.includes(symbol)) throw new Error('Geçersiz sembol');
  return RestKlines.parse(await getJson(`/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`));
}

export async function fetchCorrKlines() {
  const out = {};
  // Sırayla: aynı anda 5 istek atmak yerine hız sınırına nazik davran.
  for (const s of SYMBOLS) out[s] = await fetchKlines(s, '5m', 289);
  return out;
}

export function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
  } catch {
    /* gizli sekme vb. — önbellek isteğe bağlı */
  }
}

export function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw || raw.length > 400_000) return null;
    const r = Snapshot.safeParse(JSON.parse(raw));
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export async function loadSnapshot() {
  try {
    const res = await fetch('/data/snapshot.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    const r = Snapshot.safeParse(await res.json());
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}
