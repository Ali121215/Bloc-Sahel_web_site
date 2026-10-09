// Génère index.html (depuis index.template.html) et js/content.js (depuis content/site.json).
// Usage : node build.mjs   (aucune dépendance)
import { readFileSync, writeFileSync } from 'node:fs';

const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
const template = readFileSync('index.template.html', 'utf8');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => String(n).replace('.', ',');
const dimText = (d) => `${d.map(num).join(' × ')} mm`;
const fullLabel = (p) => `${p.label} ${dimText(p.dims)}`;

// Schéma à l'échelle : face (L × H) pour les blocs, dessus (L × l) pour les pavés.
const SCALE = { hol: 0.25, pav: 0.32 };
function shape(p) {
  const [L, W, H] = p.dims, k = SCALE[p.kind];
  const w = Math.round(L * k), h = Math.round((p.kind === 'hol' ? H : W) * k);
  const inner = p.kind === 'hol' ? '<b></b>' : '';
  return `<i class="${p.kind}" style="width:${w}px;height:${h}px">${inner}</i>`;
}

function card(p) {
  return `<div class="prod" data-p="${esc(fullLabel(p))}">
            <div class="shape">${shape(p)}</div>
            <div><h3>${esc(p.title)}</h3><div class="dim">${esc(dimText(p.dims))}</div><p class="use">${esc(p.use)}</p></div>
            <button class="btn btn-ghost pick" type="button">Devis</button>
          </div>`;
}

let html = template;
for (const group of new Set(site.products.map((p) => p.group))) {
  const cards = site.products.filter((p) => p.group === group).map(card).join('\n          ');
  const marker = `<!--PRODUCTS:${group}-->`;
  if (!html.includes(marker)) throw new Error(`Marqueur manquant dans le template : ${marker}`);
  html = html.replace(marker, cards);
}
writeFileSync('index.html', html);

const runtime = {
  name: site.name,
  phones: site.phones,
  products: [...site.products.map(fullLabel), site.extraOption],
  messages: site.messages,
};
writeFileSync('js/content.js',
  '/* GÉNÉRÉ par build.mjs depuis content/site.json. Ne pas modifier à la main. */\n' +
  'window.SITE = ' + JSON.stringify(runtime, null, 2) + ';\n');
console.log(`OK : ${site.products.length} produits, index.html et js/content.js générés.`);