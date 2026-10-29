// Otomatik yeniden bağlanan WebSocket istemcisi.
// - Üstel geri çekilme + rastgele sapma (1 sn → en fazla 30 sn)
// - 20 sn mesaj gelmezse bağlantıyı ölü sayıp yeniden kurar (watchdog)
// - Tarayıcı çevrimdışı olunca bekler, çevrimiçi olunca hemen dener
// - Her mesaj boyut sınırından ve zod şemasından geçer
import { WS_BASE, WS_WATCHDOG_MS, WS_MAX_MESSAGE_BYTES } from './config.js';
import { WsTickerMessage } from './schemas.js';

export function createTickerSocket(symbols, { onTicker, onStatus, onReject, onMessage }) {
  const url = `${WS_BASE}/stream?streams=${symbols.map((s) => `${s.toLowerCase()}@ticker`).join('/')}`;
  let ws = null;
  let attempt = 0;
  let retryTimer = null;
  let watchdog = null;
  let stopped = false;

  const status = (state, extra = {}) => onStatus({ state, attempt, ...extra });

  function armWatchdog() {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      // Sessiz kopma: sunucu bağlantıyı kapatmadan veri göndermeyi bırakmış olabilir.
      if (ws) ws.close(4000, 'watchdog');
    }, WS_WATCHDOG_MS);
  }

  function connect() {
    clearTimeout(retryTimer);
    if (stopped) return;
    if (!navigator.onLine) {
      status('offline');
      return;
    }
    status(attempt === 0 ? 'connecting' : 'reconnecting');
    try {
      ws = new WebSocket(url);
    } catch (err) {
      // CSP connect-src ihlali burada SecurityError olarak düşer.
      status('error', { error: String(err) });
      scheduleRetry();
      return;
    }

    ws.addEventListener('open', () => {
      attempt = 0;
      status('open');
      armWatchdog();
    });

    ws.addEventListener('message', (ev) => {
      armWatchdog();
      onMessage?.();
      if (typeof ev.data !== 'string' || ev.data.length > WS_MAX_MESSAGE_BYTES) {
        onReject('boyut veya tür');
        return;
      }
      let raw;
      try {
        raw = JSON.parse(ev.data);
      } catch {
        onReject('JSON değil');
        return;
      }
      const parsed = WsTickerMessage.safeParse(raw);
      if (!parsed.success) {
        onReject(parsed.error.issues[0]?.message ?? 'şema');
        return;
      }
      onTicker(parsed.data);
    });

    ws.addEventListener('close', () => {
      clearTimeout(watchdog);
      ws = null;
      if (!stopped) scheduleRetry();
    });

    ws.addEventListener('error', () => {
      // close olayı ardından gelir; yeniden deneme orada planlanır.
    });
  }

  function scheduleRetry() {
    attempt += 1;
    const base = Math.min(30_000, 1000 * 2 ** (attempt - 1));
    const delay = Math.round(base / 2 + Math.random() * (base / 2));
    status('waiting', { retryAt: Date.now() + delay });
    retryTimer = setTimeout(connect, delay);
  }

  window.addEventListener('online', () => {
    attempt = 0;
    connect();
  });
  window.addEventListener('offline', () => {
    if (ws) ws.close(4001, 'offline');
    clearTimeout(retryTimer);
    status('offline');
  });

  connect();

  return {
    reconnectNow() {
      attempt = 0;
      if (ws) ws.close(4002, 'manual');
      else connect();
    },
    stop() {
      stopped = true;
      clearTimeout(retryTimer);
      clearTimeout(watchdog);
      ws?.close();
    },
  };
}
