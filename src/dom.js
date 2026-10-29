// DOM'a yazmanın TEK yolu. innerHTML / outerHTML / insertAdjacentHTML kullanılmaz;
// metin her zaman textContent ile yazılır. CI'da bunu denetleyen bir kontrol var.
const SAFE_ATTRS = new Set([
  'class', 'id', 'role', 'tabindex', 'scope', 'type', 'value', 'for', 'href', 'target', 'rel',
  'datetime', 'title', 'hidden', 'colspan', 'aria-label', 'aria-sort', 'aria-checked',
  'aria-hidden', 'aria-live', 'aria-busy', 'aria-describedby', 'aria-labelledby', 'data-key',
  'data-dir', 'data-id',
]);

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (!SAFE_ATTRS.has(k)) throw new Error(`İzin verilmeyen öznitelik: ${k}`);
    if (k === 'href' && !/^(https:\/\/|\/|#)/.test(String(v))) throw new Error('Güvensiz bağlantı');
    node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function setText(node, text) {
  node.textContent = String(text);
}

export function clear(node) {
  node.replaceChildren();
}

export const $ = (sel) => document.querySelector(sel);
