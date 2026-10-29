// Cloudflare Pages Functions (Workers) ara katmanı: güvenlik başlıkları EDGE'de, her yanıta eklenir.
// Kartın tehdidi: WebSocket'ten gelen kötü niyetli verinin script çalıştırması (XSS) ve
// CSP'nin wss bağlantıları için fazla gevşetilmesi. Bu yüzden connect-src yalnızca iki tam adres içerir;
// "wss:" veya "*" gibi joker değerler YOKTUR.

const CONNECT_SRC = ["'self'", 'https://data-api.binance.vision', 'wss://data-stream.binance.vision'];

export function buildCsp(extraConnect = '') {
  const connect = [...CONNECT_SRC, ...extraConnect.split(' ').filter(Boolean)].join(' ');
  return [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    // Yerel testte sahte sunucu http://127.0.0.1 üzerinde olduğu için bu yönerge yalnızca üretimde eklenir.
    ...(extraConnect ? [] : ['upgrade-insecure-requests']),
    // Trusted Types: innerHTML gibi tehlikeli DOM yazma noktaları tamamen kapalı.
    // Tek izinli politika 'sw': yalnızca /sw.js adresini servis çalışanı olarak kaydetmeye izin verir.
    "require-trusted-types-for 'script'",
    "trusted-types sw",
    // report-uri: ihlal raporu anında gönderilir. (report-to eklenirse Chrome raporları ~1 dk biriktirir.)
    'report-uri /csp-report',
  ].join('; ');
}

export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Başka kaynaktan gelen her şey ya CORS ya da CORP ile izin vermeli (Binance REST, CORS ile uyumlu).
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

export async function onRequest(context) {
  const res = await context.next();
  const headers = new Headers(res.headers);
  // EXTRA_CONNECT_SRC yalnızca yerel güvenlik testinde (.dev.vars) tanımlanır; üretimde boştur.
  headers.set('Content-Security-Policy', buildCsp(context.env.EXTRA_CONNECT_SRC || ''));
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  const path = new URL(context.request.url).pathname;
  if (path.startsWith('/assets/')) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  else if (path === '/sw.js') headers.set('Cache-Control', 'no-cache');
  headers.delete('X-Powered-By');
  // Cloudflare Pages varsayılan olarak her dosyaya "Access-Control-Allow-Origin: *" ekler.
  // Sitenin içeriğini başka kökenlerin okumasına gerek yok: kaldırılır (ZAP 10098 bulgusu).
  headers.delete('Access-Control-Allow-Origin');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
