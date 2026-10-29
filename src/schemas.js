// Dışarıdan gelen HER veri bu şemalardan geçer. Geçemeyen mesaj atılır ve sayılır.
import { z } from 'zod';
import { SYMBOLS } from './config.js';

// CSP'de 'unsafe-eval' yok: zod'un Function() ile hızlandırma denemesini tamamen kapat.
z.config({ jitless: true });

// Binance sayıları metin olarak yollar: yalnızca rakam, nokta ve eksi işaretine izin ver.
const numStr = z
  .string()
  .max(32)
  .regex(/^-?\d{1,20}(\.\d{1,12})?$/, 'sayı değil')
  .transform(Number)
  .refine(Number.isFinite, 'sonlu sayı değil');

const positive = numStr.refine((n) => n > 0, 'pozitif değil');
const symbol = z.enum(SYMBOLS);
const epochMs = z.number().int().min(1_500_000_000_000).max(4_000_000_000_000);

export const WsTickerMessage = z
  .object({
    stream: z.string().max(40).regex(/^[a-z]{2,15}usdt@ticker$/),
    data: z.object({
      e: z.literal('24hrTicker'),
      E: epochMs,
      s: symbol,
      P: numStr, // yüzde değişim
      c: positive, // son fiyat
      h: positive,
      l: positive,
      v: numStr,
      q: numStr,
    }),
  })
  .refine((m) => m.stream === `${m.data.s.toLowerCase()}@ticker`, 'akış adı ile sembol uyuşmuyor')
  .transform(({ data: d }) => ({
    symbol: d.s,
    time: d.E,
    price: d.c,
    changePct: d.P,
    high: d.h,
    low: d.l,
    volume: d.v,
    quoteVolume: d.q,
  }));

export const RestTickers = z
  .array(
    z.object({
      symbol,
      priceChangePercent: numStr,
      lastPrice: positive,
      highPrice: positive,
      lowPrice: positive,
      volume: numStr,
      quoteVolume: numStr,
      closeTime: epochMs,
    }),
  )
  .max(SYMBOLS.length)
  .transform((arr) =>
    arr.map((t) => ({
      symbol: t.symbol,
      time: t.closeTime,
      price: t.lastPrice,
      changePct: t.priceChangePercent,
      high: t.highPrice,
      low: t.lowPrice,
      volume: t.volume,
      quoteVolume: t.quoteVolume,
    })),
  );

// [açılış zamanı, açılış, yüksek, düşük, kapanış, hacim, kapanış zamanı, ...]
export const RestKlines = z
  .array(z.tuple([epochMs, positive, positive, positive, positive, numStr, epochMs]).rest(z.unknown()))
  .max(1000)
  .transform((rows) => rows.map((r) => ({ t: r[6], close: r[4] })));

const point = z.object({ t: epochMs, close: z.number().positive().finite() });
const ticker = z.object({
  symbol,
  time: epochMs,
  price: z.number().positive().finite(),
  changePct: z.number().finite(),
  high: z.number().positive().finite(),
  low: z.number().positive().finite(),
  volume: z.number().finite(),
  quoteVolume: z.number().finite(),
});

// Yerel önbellek ve /data/snapshot.json için şema (bunlar da güvenilmez kabul edilir).
export const Snapshot = z.object({
  savedAt: epochMs,
  tickers: z.array(ticker).max(SYMBOLS.length),
  corrKlines: z.record(symbol, z.array(point).max(1000)),
  klines: z.record(z.string().max(20), z.array(point).max(1000)).optional(),
});
