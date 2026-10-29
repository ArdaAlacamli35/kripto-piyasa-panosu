// İkincil grafik: 5 varlığın 24 saatlik getirisi. Artış mavi + ▲, düşüş turuncu + ▼.
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { fmtPct, direction } from '../format.js';
import { SHORT } from '../config.js';

export function createBarChart(container) {
  const svg = select(container).append('svg').attr('class', 'bar-svg');
  let rows = [];

  function render() {
    const W = Math.max(260, container.getBoundingClientRect().width);
    const rowH = 34;
    const H = rows.length * rowH + 10;
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);
    if (!rows.length) return;
    const labelW = 48, valueW = 92;
    const lim = Math.max(0.5, max(rows, (r) => Math.abs(r.changePct)));
    const x = scaleLinear().domain([-lim, lim]).range([labelW, W - valueW]);
    const y = scaleBand().domain(rows.map((r) => r.symbol)).range([5, H - 5]).padding(0.28);

    svg.selectAll('line.zero').data([0]).join('line').attr('class', 'zero')
      .attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', H);

    const gRow = svg.selectAll('g.row').data(rows, (d) => d.symbol).join((enter) => {
      const g = enter.append('g').attr('class', 'row');
      g.append('text').attr('class', 'lbl');
      g.append('rect');
      g.append('text').attr('class', 'val');
      return g;
    });
    gRow.attr('transform', (d) => `translate(0,${y(d.symbol)})`);
    gRow.select('text.lbl').attr('x', 0).attr('y', y.bandwidth() / 2).attr('dy', '0.35em').text((d) => SHORT(d.symbol));
    gRow.select('rect')
      .attr('class', (d) => direction(d.changePct).cls)
      .attr('x', (d) => Math.min(x(0), x(d.changePct)))
      .attr('width', (d) => Math.max(1, Math.abs(x(d.changePct) - x(0))))
      .attr('height', y.bandwidth())
      .attr('rx', 2);
    gRow.select('text.val')
      .attr('class', (d) => `val ${direction(d.changePct).cls}`)
      .attr('x', W - valueW + 8).attr('y', y.bandwidth() / 2).attr('dy', '0.35em')
      .text((d) => `${direction(d.changePct).arrow} ${fmtPct(d.changePct)}`);
  }

  new ResizeObserver(render).observe(container);
  return {
    update(r) {
      rows = [...r].sort((a, b) => b.changePct - a.changePct);
      render();
    },
  };
}
