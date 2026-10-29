const tr = 'tr-TR';

export function fmtPrice(n) {
  const digits = n >= 1000 ? 2 : n >= 1 ? 3 : 5;
  return new Intl.NumberFormat(tr, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n) + ' $';
}

export function fmtPct(n) {
  const s = new Intl.NumberFormat(tr, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
  return (n > 0 ? '+' : n < 0 ? '−' : '') + '%' + s;
}

export function fmtCompact(n) {
  return new Intl.NumberFormat(tr, { notation: 'compact', maximumFractionDigits: 2 }).format(n) + ' $';
}

export function fmtDateTime(ms) {
  return new Intl.DateTimeFormat(tr, { dateStyle: 'medium', timeStyle: 'medium' }).format(ms);
}

export function fmtTime(ms) {
  return new Intl.DateTimeFormat(tr, { hour: '2-digit', minute: '2-digit' }).format(ms);
}

export function fmtShortDate(ms) {
  return new Intl.DateTimeFormat(tr, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(ms);
}

export function fmtCorr(n) {
  return new Intl.NumberFormat(tr, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

// Renk tek başına anlam taşımaz: yön her zaman ok + metinle de verilir.
export function direction(n) {
  if (n > 0) return { cls: 'up', arrow: '▲', word: 'yükseliş' };
  if (n < 0) return { cls: 'down', arrow: '▼', word: 'düşüş' };
  return { cls: 'flat', arrow: '■', word: 'değişim yok' };
}
