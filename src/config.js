// Tüm ağ adresleri burada. CSP'deki connect-src ile birebir aynı olmalı.
export const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];

export const NAMES = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ether',
  BNBUSDT: 'BNB',
  SOLUSDT: 'Solana',
  XRPUSDT: 'XRP',
};

export const SHORT = (s) => s.replace('USDT', '');

// Binance'in yalnızca piyasa verisi sunan herkese açık uç noktaları (anahtar gerekmez).
export const REST_BASE = import.meta.env?.VITE_REST_BASE || 'https://data-api.binance.vision';
export const WS_BASE = import.meta.env?.VITE_WS_BASE || 'wss://data-stream.binance.vision';

export const RANGES = [
  { id: '1d', label: '1 gün', interval: '5m', limit: 288 },
  { id: '7d', label: '7 gün', interval: '1h', limit: 168 },
  { id: '30d', label: '30 gün', interval: '4h', limit: 180 },
];

// Hız sınırına saygı: REST verisi en fazla 5 dakikada bir yenilenir.
export const REST_REFRESH_MS = 5 * 60 * 1000;
// Bu kadar süre mesaj gelmezse bağlantı ölü kabul edilir.
export const WS_WATCHDOG_MS = 20 * 1000;
// Tek bir WebSocket mesajının kabul edilen en büyük boyutu (bayt).
export const WS_MAX_MESSAGE_BYTES = 4096;
