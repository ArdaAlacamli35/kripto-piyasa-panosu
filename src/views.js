// Tablolar, KPI kartları, korelasyon matrisi ve durum bileşenleri.
import { el, clear, setText } from './dom.js';
import { NAMES, SHORT } from './config.js';
import { fmtPrice, fmtPct, fmtCompact, fmtCorr, fmtShortDate, direction } from './format.js';

export function renderKpis(root, t, rangeLabel, rangeChangePct) {
  clear(root);
  const d = direction(t.changePct);
  const dr = direction(rangeChangePct ?? 0);
  root.append(
    el('article', { class: 'kpi' }, [
      el('h2', { class: 'kpi-label' }, `${NAMES[t.symbol]} fiyatı`),
      el('p', { class: 'kpi-value mono' }, fmtPrice(t.price)),
      el('p', { class: 'kpi-sub' }, `24 sa aralığı: ${fmtPrice(t.low)} – ${fmtPrice(t.high)}`),
    ]),
    el('article', { class: 'kpi' }, [
      el('h2', { class: 'kpi-label' }, '24 saatlik değişim'),
      el('p', { class: `kpi-value mono ${d.cls}` }, [el('span', { 'aria-hidden': 'true' }, d.arrow + ' '), fmtPct(t.changePct)]),
      el('p', { class: 'kpi-sub' }, rangeChangePct === null ? d.word : [`${rangeLabel} içinde: `, el('span', { class: dr.cls }, `${dr.arrow} ${fmtPct(rangeChangePct)}`)]),
    ]),
    el('article', { class: 'kpi' }, [
      el('h2', { class: 'kpi-label' }, '24 saatlik işlem hacmi'),
      el('p', { class: 'kpi-value mono' }, fmtCompact(t.quoteVolume)),
      el('p', { class: 'kpi-sub' }, `USDT cinsinden, ${SHORT(t.symbol)}/USDT paritesi`),
    ]),
  );
}

export function renderSimpleTable(root, caption, headers, rows) {
  clear(root);
  root.append(
    el('table', { class: 'tbl' }, [
      el('caption', { class: 'sr-only' }, caption),
      el('thead', {}, el('tr', {}, headers.map((h) => el('th', { scope: 'col' }, h)))),
      el('tbody', {}, rows.map((r) => el('tr', {}, r.map((c, i) => el(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, c))))),
    ]),
  );
}

const COLS = [
  { key: 'symbol', label: 'Varlık', num: false },
  { key: 'price', label: 'Fiyat', num: true },
  { key: 'changePct', label: '24 sa değişim', num: true },
  { key: 'high', label: '24 sa en yüksek', num: true },
  { key: 'low', label: '24 sa en düşük', num: true },
  { key: 'quoteVolume', label: 'Hacim (USDT)', num: true },
];

export function createDetailTable(root, onEmptyReset) {
  let sort = { key: 'quoteVolume', dir: 'desc' };
  let lastRows = [];

  function render(rows) {
    lastRows = rows;
    clear(root);
    if (!rows.length) {
      const btn = el('button', { type: 'button', class: 'btn small' }, 'Filtreleri temizle');
      btn.addEventListener('click', onEmptyReset);
      root.append(
        el('div', { class: 'empty', role: 'status' }, [
          el('p', { class: 'empty-title' }, 'Bu filtrelerle eşleşen varlık yok.'),
          el('p', {}, 'Aramayı kısaltmayı veya yön filtresini "Tümü" yapmayı deneyin.'),
          btn,
        ]),
      );
      return;
    }
    const sorted = [...rows].sort((a, b) => {
      const va = a[sort.key], vb = b[sort.key];
      const c = typeof va === 'string' ? va.localeCompare(vb, 'tr') : va - vb;
      return sort.dir === 'asc' ? c : -c;
    });
    const head = el('tr', {}, COLS.map((c) => {
      const active = sort.key === c.key;
      const btn = el('button', { type: 'button', class: 'sort', 'data-key': c.key }, [
        c.label,
        el('span', { 'aria-hidden': 'true', class: 'sort-icon' }, active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'),
      ]);
      btn.addEventListener('click', () => {
        sort = { key: c.key, dir: active && sort.dir === 'desc' ? 'asc' : 'desc' };
        render(lastRows);
        root.querySelector(`button[data-key="${c.key}"]`)?.focus();
      });
      return el('th', { scope: 'col', class: c.num ? 'num' : '', 'aria-sort': active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none' }, btn);
    }));
    const body = sorted.map((r) => {
      const d = direction(r.changePct);
      return el('tr', {}, [
        el('th', { scope: 'row' }, [el('span', { class: 'sym' }, SHORT(r.symbol)), ' ', el('span', { class: 'muted' }, NAMES[r.symbol])]),
        el('td', { class: 'num mono' }, fmtPrice(r.price)),
        el('td', { class: `num mono ${d.cls}` }, [el('span', { 'aria-hidden': 'true' }, d.arrow + ' '), fmtPct(r.changePct)]),
        el('td', { class: 'num mono' }, fmtPrice(r.high)),
        el('td', { class: 'num mono' }, fmtPrice(r.low)),
        el('td', { class: 'num mono' }, fmtCompact(r.quoteVolume)),
      ]);
    });
    root.append(el('table', { class: 'tbl sortable' }, [
      el('caption', { class: 'sr-only' }, 'Varlıkların 24 saatlik özeti; başlıklardaki düğmelerle sıralanabilir'),
      el('thead', {}, head),
      el('tbody', {}, body),
    ]));
  }
  return { render };
}

// Korelasyon matrisi: renk + her hücrede sayı (renk tek başına anlam taşımaz).
export function renderCorr(root, symbols, matrix) {
  clear(root);
  root.classList.remove('skeleton');
  const head = el('tr', {}, [el('td', {}), ...symbols.map((s) => el('th', { scope: 'col' }, SHORT(s)))]);
  const rows = symbols.map((a, i) => el('tr', {}, [
    el('th', { scope: 'row' }, SHORT(a)),
    ...symbols.map((b, j) => {
      const v = matrix[i][j];
      const td = el('td', { class: 'cell mono', title: `${SHORT(a)} – ${SHORT(b)}: ${fmtCorr(v)}` }, Number.isNaN(v) ? '—' : fmtCorr(v));
      // CSSOM üzerinden stil: CSP'de 'unsafe-inline' gerektirmez.
      const strength = Math.max(0, Math.min(1, Math.abs(v)));
      td.style.setProperty('--k', strength.toFixed(3));
      if (v < 0) td.classList.add('neg');
      if (strength > 0.55) td.classList.add('strong');
      if (i === j) td.classList.add('diag');
      return td;
    }),
  ]));
  root.append(el('table', { class: 'corr-table' }, [
    el('caption', { class: 'sr-only' }, '24 saatlik getiri korelasyon matrisi'),
    el('thead', {}, head),
    el('tbody', {}, rows),
  ]));
}

export function corrSummary(symbols, matrix, n) {
  let best = { v: -2 }, worst = { v: 2 };
  for (let i = 0; i < symbols.length; i++) for (let j = i + 1; j < symbols.length; j++) {
    const v = matrix[i][j];
    if (v > best.v) best = { v, a: symbols[i], b: symbols[j] };
    if (v < worst.v) worst = { v, a: symbols[i], b: symbols[j] };
  }
  return `Son 24 saatte (${n} adet 5 dakikalık getiri) en birlikte hareket eden çift ${SHORT(best.a)}–${SHORT(best.b)} (${fmtCorr(best.v)}), en bağımsız çift ${SHORT(worst.a)}–${SHORT(worst.b)} (${fmtCorr(worst.v)}).`;
}

export function setConn(root, s) {
  const icon = root.querySelector('.conn-icon');
  const text = root.querySelector('.conn-text');
  const btn = root.querySelector('#reconnect');
  const map = {
    connecting: ['◌', 'Bağlanıyor…', 'pending'],
    open: ['●', 'Canlı: anlık fiyat akışı bağlı', 'ok'],
    reconnecting: ['◌', `Yeniden bağlanıyor (${s.attempt}. deneme)…`, 'pending'],
    waiting: ['◐', `Bağlantı koptu. ${Math.max(1, Math.round((s.retryAt - Date.now()) / 1000))} sn içinde yeniden denenecek (${s.attempt}. deneme)`, 'warn'],
    offline: ['○', 'Çevrimdışı: internet bağlantısı yok, son veri gösteriliyor', 'bad'],
    error: ['○', 'Bağlantı kurulamadı', 'bad'],
  };
  const [i, t, cls] = map[s.state] ?? map.error;
  setText(icon, i);
  setText(text, t);
  root.dataset.state = cls;
  btn.hidden = s.state === 'open' || s.state === 'connecting';
}

export function setBanner(root, kind, message) {
  if (!message) { root.hidden = true; clear(root); return; }
  root.hidden = false;
  root.dataset.kind = kind;
  clear(root);
  root.append(el('p', {}, message));
}

export function fmtUpdated(ms) {
  return fmtShortDate(ms);
}
