// YEREL SAHTE BİNANCE: yalnızca kendi makinemizde, kendi uygulamamızı test etmek için.
// Gerçek Binance'e hiçbir istek atılmaz (ödev etik kuralı: üçüncü tarafa test yok).
import http from 'node:http';
import { WebSocketServer } from 'ws';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
const BASE = { BTCUSDT: 67250, ETHUSDT: 3410, BNBUSDT: 598, SOLUSDT: 172, XRPUSDT: 0.61 };

function klines(sym, interval, limit) {
  const step = { '5m': 3e5, '1h': 3.6e6, '4h': 1.44e7 }[interval] ?? 3e5;
  const now = Math.floor(Date.now() / step) * step;
  let p = BASE[sym];
  const out = [];
  let seed = sym.charCodeAt(0) * 7 + limit;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const common = [];
  for (let i = 0; i < limit; i++) common.push(rnd() - 0.5);
  for (let i = 0; i < limit; i++) {
    const shock = 0.6 * common[i] + 0.4 * (Math.random() - 0.5);
    const o = p;
    p = p * (1 + shock * 0.006);
    const t = now - (limit - i) * step;
    out.push([t, o.toFixed(4), Math.max(o, p).toFixed(4), Math.min(o, p).toFixed(4), p.toFixed(4), '123.4', t + step - 1, '0', 10, '0', '0', '0']);
  }
  return out;
}

export function ticker(sym, overrides = {}) {
  const c = BASE[sym] * (1 + (Math.random() - 0.5) * 0.002);
  return {
    stream: `${sym.toLowerCase()}@ticker`,
    data: { e: '24hrTicker', E: Date.now(), s: sym, p: '1', P: ((Math.random() - 0.4) * 6).toFixed(3), c: c.toFixed(4),
      h: (c * 1.02).toFixed(4), l: (c * 0.98).toFixed(4), v: '1000', q: (c * 1e5).toFixed(2), ...overrides },
  };
}

export function startFakeBinance({ restPort = 9002, wsPort = 9001 } = {}) {
  let restDown = false;
  let delay = 0;
  const rest = http.createServer(async (req, res) => {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    const u = new URL(req.url, 'http://x');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (restDown) { res.writeHead(503); return res.end('down'); }
    if (u.pathname === '/api/v3/ticker/24hr') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(SYMBOLS.map((s) => {
        const d = ticker(s).data;
        return { symbol: s, priceChangePercent: d.P, lastPrice: d.c, highPrice: d.h, lowPrice: d.l, volume: d.v, quoteVolume: d.q, closeTime: Date.now() };
      })));
    }
    if (u.pathname === '/api/v3/klines') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(klines(u.searchParams.get('symbol'), u.searchParams.get('interval'), Number(u.searchParams.get('limit')))));
    }
    res.writeHead(404); res.end();
  }).listen(restPort, '127.0.0.1');

  let wss = null;
  let timer = null;
  function startWs() {
    wss = new WebSocketServer({ port: wsPort, host: '127.0.0.1' });
    timer = setInterval(() => { for (const s of SYMBOLS) broadcast(JSON.stringify(ticker(s))); }, 1000);
  }
  function stopWs() {
    clearInterval(timer);
    for (const c of wss?.clients ?? []) c.terminate();
    return new Promise((r) => (wss ? wss.close(() => r()) : r()));
  }
  function broadcast(raw) { for (const c of wss?.clients ?? []) if (c.readyState === 1) c.send(raw); }
  startWs();

  return {
    broadcast,
    startWs,
    stopWs,
    setRestDown(v) { restDown = v; },
    setDelay(ms) { delay = ms; },
    async close() { await stopWs(); rest.close(); },
  };
}

// Doğrudan çalıştırılırsa sunucuyu açık tut (elle deneme için)
if (import.meta.url === `file://${process.argv[1]}`) {
  startFakeBinance();
  console.log('Sahte Binance: REST http://127.0.0.1:9002, WS ws://127.0.0.1:9001');
}
