// CI kontrolü: kaynak kodda tehlikeli DOM yazma noktası kullanılmasını engeller.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const FORBIDDEN = [/\.innerHTML\b/, /\.outerHTML\b/, /insertAdjacentHTML/, /document\.write/, /\beval\s*\(/, /new Function\s*\(/, /\.html\s*\(/];
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(js|mjs)$/.test(e.name)) yield p;
  }
}
let bad = 0;
for (const dir of ['src', 'functions']) {
  for await (const f of walk(dir)) {
    const lines = (await readFile(f, 'utf8')).split('\n');
    lines.forEach((l, i) => {
      if (l.trim().startsWith('//')) return;
      for (const re of FORBIDDEN) if (re.test(l)) { console.error(`${f}:${i + 1}: yasak DOM yazma noktası → ${l.trim()}`); bad++; }
    });
  }
}
if (bad) process.exit(1);
console.log('DOM yazma noktası kontrolü: temiz (yalnızca textContent / createElement).');
