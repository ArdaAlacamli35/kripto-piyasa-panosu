export function logReturns(points) {
  const r = [];
  for (let i = 1; i < points.length; i++) r.push(Math.log(points[i].close / points[i - 1].close));
  return r;
}

export function pearson(a, b) {
  const n = Math.min(a.length, b.length);
  if (n < 3) return NaN;
  let ma = 0, mb = 0;
  for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
  ma /= n; mb /= n;
  let cov = 0, va = 0, vb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma, db = b[i] - mb;
    cov += da * db; va += da * da; vb += db * db;
  }
  return va === 0 || vb === 0 ? NaN : cov / Math.sqrt(va * vb);
}

// Zaman damgalarını hizalayıp korelasyon matrisini hesaplar.
export function correlationMatrix(klinesBySymbol, symbols) {
  const common = symbols
    .map((s) => new Set(klinesBySymbol[s].map((p) => p.t)))
    .reduce((acc, set) => new Set([...acc].filter((t) => set.has(t))));
  const aligned = {};
  for (const s of symbols) aligned[s] = logReturns(klinesBySymbol[s].filter((p) => common.has(p.t)));
  return {
    n: Math.max(0, common.size - 1),
    m: symbols.map((a) => symbols.map((b) => (a === b ? 1 : pearson(aligned[a], aligned[b])))),
  };
}
