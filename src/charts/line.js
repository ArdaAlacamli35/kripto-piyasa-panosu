// Ana grafik: seçili varlığın fiyat çizgisi. Klavye ile (← →) noktalar arasında gezilebilir.
import { select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { extent, bisector } from 'd3-array';
import { fmtPrice, fmtShortDate, fmtTime } from '../format.js';

export function createLineChart(container) {
  const root = select(container);
  const svg = root.append('svg').attr('class', 'line-svg');
  const g = svg.append('g');
  const gx = g.append('g').attr('class', 'axis x');
  const gy = g.append('g').attr('class', 'axis y');
  const fillPath = g.append('path').attr('class', 'area');
  const path = g.append('path').attr('class', 'line');
  const focus = g.append('g').attr('class', 'focus').style('display', 'none');
  focus.append('line').attr('class', 'focus-line');
  focus.append('circle').attr('r', 4);
  const tip = root.append('div').attr('class', 'tip').attr('aria-hidden', 'true').style('display', 'none');

  let data = [];
  let idx = -1;
  let rangeId = '1d';
  const m = { t: 12, r: 16, b: 28, l: 78 };
  let x, y, W, H;

  function render() {
    const rect = container.getBoundingClientRect();
    W = Math.max(280, rect.width);
    H = W < 500 ? 220 : W > 700 ? 470 : 320;
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);
    g.attr('transform', `translate(${m.l},${m.t})`);
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;
    if (!data.length) return;
    x = scaleTime().domain(extent(data, (d) => d.t)).range([0, iw]);
    const [lo, hi] = extent(data, (d) => d.close);
    const pad = (hi - lo) * 0.08 || hi * 0.01;
    y = scaleLinear().domain([lo - pad, hi + pad]).range([ih, 0]).nice();
    gx.attr('transform', `translate(0,${ih})`).call(
      axisBottom(x).ticks(W < 500 ? 4 : 7).tickFormat((d) => (rangeId === '1d' ? fmtTime(d) : fmtShortDate(d).split(' ').slice(0, 2).join(' '))),
    );
    gy.call(axisLeft(y).ticks(5).tickFormat((d) => fmtPrice(d).replace(' $', '')));
    gy.selectAll('.tick line').attr('x2', iw).attr('class', 'grid');
    path.datum(data).attr('d', line().x((d) => x(d.t)).y((d) => y(d.close)));
    fillPath.datum(data).attr('d', area().x((d) => x(d.t)).y0(ih).y1((d) => y(d.close)));
    if (idx >= 0) showFocus(idx);
  }

  function showFocus(i) {
    if (!data.length) return;
    idx = Math.max(0, Math.min(data.length - 1, i));
    const d = data[idx];
    const px = x(d.t);
    const py = y(d.close);
    focus.style('display', null);
    focus.select('line').attr('x1', px).attr('x2', px).attr('y1', 0).attr('y2', H - m.t - m.b);
    focus.select('circle').attr('cx', px).attr('cy', py);
    tip.style('display', null).text(`${fmtShortDate(d.t)} · ${fmtPrice(d.close)}`);
    const tw = 190;
    tip.style('left', `${Math.min(W - tw, Math.max(0, px + m.l - tw / 2))}px`).style('top', `0px`);
    container.setAttribute('aria-label', `${fmtShortDate(d.t)}: ${fmtPrice(d.close)}`);
  }

  function hideFocus() {
    idx = -1;
    focus.style('display', 'none');
    tip.style('display', 'none');
  }

  const bis = bisector((d) => d.t).center;
  svg.on('pointermove', (ev) => {
    if (!data.length) return;
    const [px] = [ev.offsetX - m.l];
    showFocus(bis(data, x.invert(px)));
  });
  svg.on('pointerleave', hideFocus);
  container.addEventListener('keydown', (ev) => {
    if (!data.length) return;
    const step = ev.shiftKey ? 10 : 1;
    if (ev.key === 'ArrowRight') showFocus((idx < 0 ? data.length - 1 : idx) + step);
    else if (ev.key === 'ArrowLeft') showFocus((idx < 0 ? data.length - 1 : idx) - step);
    else if (ev.key === 'Home') showFocus(0);
    else if (ev.key === 'End') showFocus(data.length - 1);
    else if (ev.key === 'Escape') hideFocus();
    else return;
    ev.preventDefault();
  });
  container.addEventListener('blur', hideFocus);

  new ResizeObserver(() => render()).observe(container);

  return {
    update(points, range) {
      data = points;
      rangeId = range;
      render();
    },
    // Canlı fiyatı son noktaya yansıt (yalnızca 1 günlük görünümde yeni nokta ekler)
    pushLive(t, price, intervalMs) {
      if (!data.length) return;
      const last = data[data.length - 1];
      if (t - last.t >= intervalMs) data = [...data.slice(1), { t, close: price }];
      else data = [...data.slice(0, -1), { t: last.t, close: price }];
      render();
    },
    get data() {
      return data;
    },
  };
}
