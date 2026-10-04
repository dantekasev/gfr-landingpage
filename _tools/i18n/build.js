/* ==========================================================================
   Bangun versi Inggris (/en/) dari halaman Indonesia.

   node _tools/i18n/build.js            -> bangun en/*.html (gagal jika ada teks belum diterjemahkan)
   node _tools/i18n/build.js --extract  -> tulis missing.json berisi teks yang belum ada di en.json

   Kamus: en.json  { "teks Indonesia (boleh berisi tag inline)": "English text" }
   Markup halaman Inggris identik dengan halaman Indonesia; hanya teks, path aset,
   URL canonical/hreflang, dan schema yang diubah.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'en');
const DOMAIN = 'https://greenforestriverside.com';
const PAGES = ['index.html', 'cerita.html', 'camping.html', 'outbound.html', 'harga.html', 'galeri.html', 'faq.html', 'ketentuan.html'];
const DICT_FILE = path.join(__dirname, 'en.json');
const EXTRACT = process.argv.includes('--extract');

const dict = fs.existsSync(DICT_FILE) ? JSON.parse(fs.readFileSync(DICT_FILE, 'utf8')) : {};
const missing = new Map();   // key -> halaman
const used = new Set();

const INLINE = new Set(['B', 'STRONG', 'EM', 'I', 'A', 'SMALL', 'BR', 'SPAN', 'ABBR', 'CODE', 'SUP', 'SUB']);
const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'TEMPLATE']);
const norm = s => s.replace(/\s+/g, ' ').trim();
const hasWords = s => /[A-Za-zÀ-ÿ]{2,}/.test(s);

/* teks yang tidak perlu diterjemahkan: nama, kontak, angka */
function auto(key) {
  if (!hasWords(key)) return key;
  let m = key.match(/^Rp ([\d.]+)$/);
  if (m) return 'IDR ' + m[1].replace(/\./g, ',');
  if (/^[\w.+-]+@[\w.-]+$/.test(key) || /^@\w+$/.test(key) || /^https?:\/\//.test(key)) return key;
  if (['Green Forest Riverside', 'Instagram', 'TikTok', 'WhatsApp', 'FAQ', 'ATV', 'Paintball', 'Rafting',
       'Booking', 'Camping', 'English', 'Email', 'Google Maps', 'Fathy Kirom'].includes(key)) return key;
  return null;
}

let curPage = '';
function tr(raw) {
  const key = norm(raw);
  if (!key) return raw;
  const a = auto(key);
  let val = a !== null ? a : dict[key];
  if (val === undefined || val === '') {
    if (!missing.has(key)) missing.set(key, curPage);
    return raw;
  }
  used.add(key);
  const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
  return lead + val + trail;
}

function allInline(el) {
  for (const d of el.querySelectorAll('*')) if (!INLINE.has(d.tagName.toUpperCase())) return false;
  return true;
}

function walk(el) {
  if (SKIP.has(el.tagName.toUpperCase())) return;
  const direct = [...el.childNodes].filter(n => n.nodeType === 3 && hasWords(n.textContent));
  if (direct.length && el.children.length && allInline(el)) {
    el.innerHTML = tr(el.innerHTML);          // kalimat utuh beserta tag inline-nya
    return;
  }
  for (const n of [...el.childNodes]) {
    if (n.nodeType === 3) { if (hasWords(n.textContent)) n.textContent = tr(n.textContent); }
    else if (n.nodeType === 1) walk(n);
  }
}

function waText(href) {
  const m = href.match(/^(https:\/\/wa\.me\/\d+\?text=)(.*)$/);
  if (!m) return href;
  const txt = decodeURIComponent(m[2]);
  const key = txt;                               // pesan WA dipetakan utuh (dengan baris baru)
  const a = dict['WA:' + key];
  if (!a) { if (!missing.has('WA:' + key)) missing.set('WA:' + key, curPage); return href; }
  used.add('WA:' + key);
  return m[1] + encodeURIComponent(a);
}

/* hosting (Cloudflare Pages) menyajikan URL tanpa .html; /camping.html dialihkan ke /camping */
const pageUrl = (f, lang) => DOMAIN + '/' + (lang === 'en' ? 'en/' : '') + (f === 'index.html' ? '' : f.replace(/\.html$/, ''));

function build(file) {
  curPage = file;
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const dom = new JSDOM(src);
  const d = dom.window.document;
  d.documentElement.lang = 'en';

  /* --- head --- */
  d.title = tr(d.title);
  for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image:alt"]']) {
    const m = d.querySelector(sel); if (m) m.content = tr(m.content);
  }
  d.querySelector('link[rel="canonical"]').href = pageUrl(file, 'en');
  const ogu = d.querySelector('meta[property="og:url"]'); if (ogu) ogu.content = pageUrl(file, 'en');
  const loc = d.querySelector('meta[property="og:locale"]'); if (loc) loc.content = 'en_US';
  d.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => {
    l.href = l.getAttribute('hreflang') === 'en' ? pageUrl(file, 'en') : pageUrl(file, 'id');
  });

  /* --- path aset: halaman ada di /en/ --- */
  d.querySelectorAll('[src],[href],[srcset]').forEach(el => {
    for (const at of ['src', 'href', 'srcset']) {
      const v = el.getAttribute(at);
      if (v && /(^|,\s*)assets\//.test(v)) el.setAttribute(at, v.replace(/(^|,\s*)assets\//g, '$1../assets/'));
    }
  });

  d.querySelectorAll('link[href="favicon.ico"], link[href="favicon.svg"]').forEach(l => l.setAttribute('href', '../' + l.getAttribute('href')));

  /* --- atribut teks --- */
  d.querySelectorAll('[alt],[aria-label],[title],[placeholder]').forEach(el => {
    for (const at of ['alt', 'aria-label', 'title', 'placeholder']) {
      const v = el.getAttribute(at);
      if (v && hasWords(v) && el.tagName !== 'TITLE') el.setAttribute(at, tr(v));
    }
  });
  d.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => a.setAttribute('href', waText(a.getAttribute('href'))));

  /* --- peta Google berbahasa Inggris --- */
  d.querySelectorAll('iframe[src*="maps.google."], iframe[src*="google.com/maps"]').forEach(f => f.setAttribute('src', f.getAttribute('src').replace(/([?&])hl=id(?=&|$)/, '$1hl=en')));

  /* --- denah: default versi Inggris --- */
  const plan = d.querySelector('[data-plan-switch]');
  if (plan) {
    plan.querySelectorAll('.plan-tab').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-plan') === 'en')));
    const img = plan.querySelector('.plan-sheet img');
    ['src', 'srcset'].forEach(at => img.setAttribute(at, img.getAttribute(at).replace(/denah-id-/g, 'denah-en-')));
    img.setAttribute('alt', 'Site plan of Green Forest Riverside glamping on the banks of the Palayangan River, showing four tents, toilets, the entrance and the exclusive cabin area');
    const full = plan.querySelector('[data-plan-full]');
    if (full) full.setAttribute('href', full.getAttribute('href').replace('denah-id-', 'denah-en-'));
  }

  /* --- isi halaman --- */
  walk(d.body);

  /* --- schema --- */
  d.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
    const j = JSON.parse(s.textContent);
    if (j['@type'] === 'BreadcrumbList') {
      j.itemListElement.forEach(it => { it.name = tr(it.name); it.item = it.item.replace(DOMAIN + '/', DOMAIN + '/en/'); });
    } else if (j['@type'] === 'FAQPage') {
      j.mainEntity = [...d.querySelectorAll('.acc details')].map(det => ({
        '@type': 'Question', name: norm(det.querySelector('summary').textContent),
        acceptedAnswer: { '@type': 'Answer', text: norm(det.querySelector('.det-body').textContent) }
      }));
    } else if (j['@type'] === 'Campground') {
      j.description = tr(j.description); j.url = pageUrl(file, 'en');
    }
    s.textContent = '\n' + JSON.stringify(j, null, 1) + '\n';
  });

  return dom.serialize();
}

const outputs = {};
for (const f of PAGES) outputs[f] = build(f);

if (EXTRACT || missing.size) {
  const obj = {};
  for (const [k, p] of missing) obj[k] = '';
  fs.writeFileSync(path.join(__dirname, 'missing.json'), JSON.stringify(obj, null, 1));
  console.log(`${missing.size} teks belum diterjemahkan -> _tools/i18n/missing.json`);
  const byPage = {};
  for (const [, p] of missing) byPage[p] = (byPage[p] || 0) + 1;
  console.log(byPage);
  if (!EXTRACT) process.exit(1);
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
for (const [f, html] of Object.entries(outputs)) fs.writeFileSync(path.join(OUT, f), html);
const unused = Object.keys(dict).filter(k => !used.has(k));
console.log(`OK: ${PAGES.length} halaman Inggris di /en/. Entri kamus terpakai: ${used.size}.` +
  (unused.length ? ` Tidak terpakai lagi: ${unused.length} (aman dihapus dari en.json).` : ''));
