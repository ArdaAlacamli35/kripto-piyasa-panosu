import '@fontsource/schibsted-grotesk/400.css';
import '@fontsource/schibsted-grotesk/600.css';
import '@fontsource/schibsted-grotesk/800.css';
import './styles.css';

import { SYMBOLS, NAMES, SHORT, RANGES, REST_REFRESH_MS } from './config.js';
import { $, el, setText, clear } from './dom.js';
import { fetchTickers, fetchKlines, fetchCorrKlines, saveCache, loadCache, loadSnapshot } from './data.js';
import { createTickerSocket } from './ws.js';
import { correlationMatrix } from './stats.js';
import { createLineChart } from './charts/line.js';
import { createBarChart } from './charts/bar.js';
import {
  renderKpis, renderSimpleTable, createDetailTable, renderCorr, corrSummary, setConn, setBanner,
} from './views.js';
import { fmtPrice, fmtPct, fmtShortDate, fmtDateTime, fmtCorr, direction } from './format.js';

// ---------- durum ----------
const state = {
  asset: 'BTCUSDT',
  range: '1d',
  search: '',
  dir: 'all',
  tickers: new Map(),
  klines: null,
  corrKlines: null,
  updatedAt: null,
  source: 'live', // live | cache | snapshot
  received: 0,
  rejected: 0,
};

// ---------- bileşenler ----------
const lineChart = createLineChart($('#main-chart'));
const barChart = createBarChart($('#bar-chart'));
const table = createDetailTable($('#detail'), resetFilters);
const connEl = $('#conn');
const banner = $('#banner');

// ---------- kontroller ----------
const assetSel = $('#f-asset');
for (const s of SYMBOLS) assetSel.append(el('option', { value: s }, `${NAMES[s]} (${SHORT(s)})`));

const rangeGroup = $('#f-range');
for (const r of RANGES) {
  const b = el('button', { type: 'button', role: 'radio', class: 'seg-btn', 'data-id': r.id, 'aria-checked': r.id === state.range ? 'true' : 'false', tabindex: r.id === state.range ? '0' : '-1' }, r.label);
  b.addEventListener('click', () => setRange(r.id));
  rangeGroup.append(b);
}
rangeGroup.addEventListener('keydown', (ev) => {
  const i = RANGES.findIndex((r) => r.id === state.range);
  let j = null;
  if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = (i + 1) % RANGES.length;
  if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = (i - 1 + RANGES.length) % RANGES.length;
  if (j === null) return;
  ev.preventDefault();
  setRange(RANGES[j].id);
  rangeGroup.querySelector(`[data-id="${RANGES[j].id}"]`).focus();
});

assetSel.addEventListener('change', () => { state.asset = assetSel.value; loadMain(); renderAll(); });
$('#f-search').addEventListener('input', (e) => { state.search = e.target.value.trim().toLocaleLowerCase('tr'); renderTable(true); });
$('#f-dir').addEventListener('change', (e) => { state.dir = e.target.value; renderTable(true); });

function setRange(id) {
  state.range = id;
  for (const b of rangeGroup.children) {
    const on = b.dataset.id === id;
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    b.setAttribute('tabindex', on ? '0' : '-1');
  }
  loadMain();
}

function resetFilters() {
  state.search = '';
  state.dir = 'all';
  $('#f-search').value = '';
  $('#f-dir').value = 'all';
  renderTable(true);
  $('#f-search').focus();
}

// ---------- çizim ----------
function rangeObj() { return RANGES.find((r) => r.id === state.range); }

function renderAll() {
  const t = state.tickers.get(state.asset);
  if (t) {
    const pts = state.klines;
    const rc = pts && pts.length > 1 ? ((t.price - pts[0].close) / pts[0].close) * 100 : null;
    const kpis = $('#kpis');
    kpis.querySelectorAll('.skeleton').forEach((n) => n.classList.remove('skeleton'));
    renderKpis(kpis, t, rangeObj().label, rc);
  }
  renderBar();
  renderHighlights();
  renderTable();
  setText($('#updated'), state.updatedAt ? fmtDateTime(state.updatedAt) : '—');
  $('#updated').setAttribute('datetime', state.updatedAt ? new Date(state.updatedAt).toISOString() : '');
}

function renderMainSummary() {
  const pts = lineChart.data;
  if (!pts.length) return;
  const first = pts[0], last = pts[pts.length - 1];
  let hi = pts[0], lo = pts[0];
  for (const p of pts) { if (p.close > hi.close) hi = p; if (p.close < lo.close) lo = p; }
  const ch = ((last.close - first.close) / first.close) * 100;
  const d = direction(ch);
  setText($('#main-summary'),
    `${NAMES[state.asset]} son ${rangeObj().label} içinde ${fmtPct(ch)} ${d.word} gösterdi; en yüksek ${fmtPrice(hi.close)} (${fmtShortDate(hi.t)}), en düşük ${fmtPrice(lo.close)} (${fmtShortDate(lo.t)}).`);
  const step = Math.max(1, Math.floor(pts.length / 48));
  const sample = pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
  renderSimpleTable($('#main-table'), `${NAMES[state.asset]} fiyat verisi`, ['Zaman', 'Kapanış fiyatı'],
    sample.map((p) => [fmtShortDate(p.t), fmtPrice(p.close)]));
}

function renderBar() {
  const rows = [...state.tickers.values()];
  if (!rows.length) return;
  $('#bar-chart').classList.remove('skeleton');
  barChart.update(rows);
  const up = rows.filter((r) => r.changePct > 0).length;
  const best = rows.reduce((a, b) => (b.changePct > a.changePct ? b : a));
  const worst = rows.reduce((a, b) => (b.changePct < a.changePct ? b : a));
  const n = rows.length;
  let ozet;
  if (up === 0) ozet = `Son 24 saatte ${n} varlığın hepsi düştü; en az düşen ${SHORT(best.symbol)} (${fmtPct(best.changePct)}), en çok düşen ${SHORT(worst.symbol)} (${fmtPct(worst.changePct)}).`;
  else if (up === n) ozet = `Son 24 saatte ${n} varlığın hepsi yükseldi; en çok yükselen ${SHORT(best.symbol)} (${fmtPct(best.changePct)}), en az yükselen ${SHORT(worst.symbol)} (${fmtPct(worst.changePct)}).`;
  else ozet = `Son 24 saatte ${n} varlığın ${up} tanesi yükseldi; en iyi ${SHORT(best.symbol)} (${fmtPct(best.changePct)}), en zayıf ${SHORT(worst.symbol)} (${fmtPct(worst.changePct)}).`;
  setText($('#bar-summary'), ozet);
  renderSimpleTable($('#bar-table'), '24 saatlik getiri', ['Varlık', '24 sa değişim', 'Yön'],
    [...rows].sort((a, b) => b.changePct - a.changePct).map((r) => [SHORT(r.symbol), fmtPct(r.changePct), direction(r.changePct).word]));
}

let tableTimer = null;
let tablePending = false;
function renderTable(force = false) {
  // Canlı akışta tabloyu en fazla saniyede bir yeniden çiz (titremeyi önler); son güncelleme kaybolmaz.
  if (tableTimer && !force) { tablePending = true; return; }
  clearTimeout(tableTimer);
  tableTimer = setTimeout(() => {
    tableTimer = null;
    if (tablePending) { tablePending = false; renderTable(); }
  }, 1000);
  const q = state.search;
  const rows = [...state.tickers.values()].filter((r) => {
    if (state.dir === 'up' && !(r.changePct > 0)) return false;
    if (state.dir === 'down' && !(r.changePct < 0)) return false;
    if (!q) return true;
    return r.symbol.toLocaleLowerCase('tr').includes(q) || NAMES[r.symbol].toLocaleLowerCase('tr').includes(q);
  });
  if (!state.tickers.size) return;
  const active = document.activeElement;
  const keepFocus = active && $('#detail').contains(active) ? active.dataset.key : null;
  table.render(rows);
  if (keepFocus) $('#detail').querySelector(`button[data-key="${keepFocus}"]`)?.focus();
}

// Kullanıcı testinden sonra eklendi: iki katılımcı da "en iyi varlık" ve "en ilişkili çift"
// bilgisini grafiklerden kendisi çıkarmak zorunda kaldı. Bu şerit cevabı tek bakışta veriyor.
function renderHighlights() {
  const rows = [...state.tickers.values()];
  if (!rows.length) return;
  const best = rows.reduce((a, b) => (b.changePct > a.changePct ? b : a));
  const worst = rows.reduce((a, b) => (b.changePct < a.changePct ? b : a));
  const item = (label, sym, value, cls) =>
    el('li', { class: 'hl' }, [el('span', { class: 'hl-label' }, label), ' ', el('strong', {}, sym), ' ', el('span', { class: `mono ${cls}` }, value)]);
  const dB = direction(best.changePct), dW = direction(worst.changePct);
  const items = [
    item(state.tickers.size && rows.every((r) => r.changePct < 0) ? '24 saatte en az düşen:' : '24 saatte en iyi giden:', SHORT(best.symbol), `${dB.arrow} ${fmtPct(best.changePct)}`, dB.cls),
    item('24 saatte en kötü giden:', SHORT(worst.symbol), `${dW.arrow} ${fmtPct(worst.changePct)}`, dW.cls),
  ];
  if (state.corrM) {
    const i = SYMBOLS.indexOf(state.asset);
    let j = -1, v = -2;
    SYMBOLS.forEach((s, k) => { if (k !== i && state.corrM[i][k] > v) { v = state.corrM[i][k]; j = k; } });
    if (j >= 0) items.push(item(`${SHORT(state.asset)} ile en çok birlikte hareket eden:`, SHORT(SYMBOLS[j]), `korelasyon ${fmtCorr(v)}`, ''));
  }
  const ul = $('#highlights .hl-list');
  clear(ul);
  ul.append(...items);
}

function renderCorrFrom(klines) {
  const { n, m } = correlationMatrix(klines, SYMBOLS);
  state.corrM = m;
  renderCorr($('#corr'), SYMBOLS, m);
  setText($('#corr-summary'), corrSummary(SYMBOLS, m, n));
}

// ---------- veri yükleme ----------
async function loadMain() {
  const r = rangeObj();
  const key = `${state.asset}:${r.id}`;
  $('#main-chart').classList.add('skeleton');
  try {
    const pts = await fetchKlines(state.asset, r.interval, r.limit);
    if (`${state.asset}:${state.range}` !== key) return;
    state.klines = pts;
    lineChart.update(pts, r.id);
    persist(key, pts);
  } catch {
    const cached = (loadCache()?.klines ?? {})[key] ?? (await loadSnapshot())?.klines?.[key];
    if (cached) {
      state.klines = cached;
      lineChart.update(cached, r.id);
    } else {
      showMainError();
      return;
    }
  }
  $('#main-chart').classList.remove('skeleton');
  hideMainError();
  renderMainSummary();
  renderAll();
}

function showMainError() {
  const c = $('#main-chart');
  c.classList.remove('skeleton');
  if (c.querySelector('.chart-error')) return;
  const btn = el('button', { type: 'button', class: 'btn small' }, 'Tekrar dene');
  btn.addEventListener('click', loadMain);
  c.append(el('div', { class: 'chart-error', role: 'alert' }, [
    el('p', { class: 'empty-title' }, 'Grafik verisi alınamadı.'),
    el('p', {}, 'Binance API şu an yanıt vermiyor ve bu görünüm için kayıtlı veri yok.'),
    btn,
  ]));
  setText($('#main-summary'), 'Grafik verisi şu an alınamıyor.');
}
function hideMainError() { $('#main-chart').querySelector('.chart-error')?.remove(); }

function persist(klineKey, pts) {
  const prev = loadCache();
  const klines = { ...(prev?.klines ?? {}) };
  if (klineKey) klines[klineKey] = pts;
  if (!state.corrKlines || !state.tickers.size) return;
  saveCache({ tickers: [...state.tickers.values()], corrKlines: state.corrKlines, klines });
}

async function refreshRest() {
  try {
    const [tickers, corrK] = await Promise.all([fetchTickers(), fetchCorrKlines()]);
    for (const t of tickers) state.tickers.set(t.symbol, t);
    state.corrKlines = corrK;
    state.updatedAt = Date.now();
    state.source = 'live';
    renderCorrFrom(corrK);
    persist(`${state.asset}:${state.range}`, state.klines ?? []);
    setBanner(banner, null, null);
    renderAll();
    return true;
  } catch {
    return false;
  }
}

async function fallback() {
  const cached = loadCache();
  const snap = cached ?? (await loadSnapshot());
  if (!snap) {
    setBanner(banner, 'error', 'Canlı veriye ulaşılamadı ve kayıtlı veri bulunamadı. Bağlantınızı kontrol edip sayfayı yenileyin.');
    for (const n of document.querySelectorAll('.skeleton')) n.classList.remove('skeleton');
    clear($('#kpis'));
    $('#kpis').append(el('p', { class: 'empty-title' }, 'Gösterilecek veri yok.'));
    return;
  }
  for (const t of snap.tickers) state.tickers.set(t.symbol, t);
  state.corrKlines = snap.corrKlines;
  state.updatedAt = snap.savedAt;
  state.source = cached ? 'cache' : 'snapshot';
  renderCorrFrom(snap.corrKlines);
  setBanner(banner, 'warn',
    `Canlı veriye şu an ulaşılamıyor. ${fmtDateTime(snap.savedAt)} tarihli son başarılı veri gösteriliyor (${cached ? 'bu tarayıcıda kayıtlı' : 'sunucudaki günlük anlık görüntü'}). Bağlantı gelince otomatik güncellenecek.`);
  renderAll();
}

// ---------- canlı akış ----------
let socket;
function startSocket() {
  socket = createTickerSocket(SYMBOLS, {
    onTicker(t) {
      state.tickers.set(t.symbol, t);
      state.updatedAt = t.time;
      if (state.source !== 'live') { state.source = 'live'; setBanner(banner, null, null); }
      if (t.symbol === state.asset && state.range === '1d') lineChart.pushLive(t.time, t.price, 5 * 60 * 1000);
      renderAll();
    },
    onStatus(s) {
      setConn(connEl, s);
      if (s.state === 'waiting') {
        // Geri sayımı canlı tut
        const iv = setInterval(() => {
          if (Date.now() >= s.retryAt) return clearInterval(iv);
          setConn(connEl, s);
        }, 1000);
      }
    },
    onReject(reason) {
      state.rejected += 1;
      setText($('#rejected'), state.rejected);
      // Gerekçe yalnızca konsola, metin olarak yazılır (DOM'a değil).
      console.warn('[doğrulama] mesaj reddedildi:', reason);
    },
    onMessage() {
      state.received += 1;
      setText($('#received'), state.received);
    },
  });
}
$('#reconnect').addEventListener('click', () => socket?.reconnectNow());

// ---------- başlat ----------
(async function init() {
  setRange(state.range);
  const ok = await refreshRest();
  if (!ok) await fallback();
  startSocket();
  setInterval(async () => {
    const ok2 = await refreshRest();
    if (!ok2 && state.source === 'live' && connEl.dataset.state !== 'ok') await fallback();
  }, REST_REFRESH_MS);
})();

// Trusted Types: servis çalışanı adresi de bir "script URL" sayılır. Tek izinli politika
// yalnızca sabit '/sw.js' değerini kabul eder; başka her şeyi reddeder.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  let swUrl = '/sw.js';
  if (window.trustedTypes?.createPolicy) {
    const policy = window.trustedTypes.createPolicy('sw', {
      createScriptURL: (u) => {
        if (u !== '/sw.js') throw new TypeError('İzin verilmeyen script adresi');
        return u;
      },
    });
    swUrl = policy.createScriptURL('/sw.js');
  }
  navigator.serviceWorker.register(swUrl).catch(() => {});
}
