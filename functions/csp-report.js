// CSP / Trusted Types ihlal raporlarını toplar ve Cloudflare loglarına yazar.
// Rapor içeriği saldırgan kontrolünde olabilir: boyut sınırlı, yalnızca belirli alanlar ve kısaltılmış olarak loglanır.
const MAX_BYTES = 8 * 1024;
const cut = (v, n = 200) => (typeof v === 'string' ? v.slice(0, n) : typeof v === 'number' ? v : undefined);

function pick(r) {
  return {
    directive: cut(r['effective-directive'] ?? r.effectiveDirective ?? r['violated-directive']),
    blocked: cut(r['blocked-uri'] ?? r.blockedURL),
    document: cut(r['document-uri'] ?? r.documentURL),
    sample: cut(r['script-sample'] ?? r.sample, 80),
    source: cut(r['source-file'] ?? r.sourceFile),
    line: cut(r['line-number'] ?? r.lineNumber),
    disposition: cut(r.disposition),
  };
}

export async function onRequestPost({ request }) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX_BYTES) return new Response(null, { status: 413 });
  const text = (await request.text()).slice(0, MAX_BYTES);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  // İki biçim: report-uri ({ "csp-report": {...} }) ve Reporting API ([{ type, body }])
  const reports = Array.isArray(body)
    ? body.filter((x) => x && x.type === 'csp-violation').map((x) => x.body || {})
    : [body['csp-report'] || {}];
  for (const r of reports.slice(0, 10)) {
    console.log(JSON.stringify({ event: 'csp_violation', at: new Date().toISOString(), ...pick(r) }));
  }
  return new Response(null, { status: 204 });
}

export function onRequest() {
  return new Response('Yalnızca POST', { status: 405, headers: { Allow: 'POST' } });
}
