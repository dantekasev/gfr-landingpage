/* Cek hasil /en/: sisa kata Indonesia, path aset, schema, link antarhalaman.
   node _tools/i18n/check.js */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = path.resolve(__dirname, '..', '..');
const EN = path.join(ROOT, 'en');
let bad = 0;
const fail = m => { bad++; console.log('  !!', m); };

/* kata Indonesia yang hampir tidak pernah muncul di teks Inggris */
const ID_WORDS = /\b(dan|yang|untuk|dengan|kami|anda|tidak|dari|atau|tenda|malam|orang|perahu|harga|lihat|sungai|tepi|hutan|kayu|sampai|bisa|sudah|akan|ini|itu|juga|lewat|saat|setiap|dapat|kalau|berapa|bagaimana|pukul|jam|hari|foto|perbesar|tambah|kurangi|jumlah|parkir|sarapan|pembayaran|pelunasan|minimal|maksimal)\b/i;

for (const f of fs.readdirSync(EN).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(EN, f), 'utf8');
  const d = new JSDOM(html).window.document;
  console.log(f);
  if (d.documentElement.lang !== 'en') fail('lang bukan en');

  // teks terlihat (tanpa script/style)
  d.querySelectorAll('script,style').forEach(s => s.remove());
  const texts = [];
  const tw = d.createTreeWalker(d.documentElement, 4);
  while (tw.nextNode()) { const t = tw.currentNode.textContent.trim(); if (t) texts.push(t); }
  d.querySelectorAll('[alt],[aria-label],[title],[placeholder],meta[content]').forEach(e =>
    ['alt', 'aria-label', 'title', 'placeholder', 'content'].forEach(a => { const v = e.getAttribute(a); if (v && /[a-z]{3}/i.test(v) && !/^https?:\/\//.test(v)) texts.push(v); }));
  d.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => texts.push(decodeURIComponent(a.href.split('text=')[1] || '')));
  for (const t of texts) {
    if (/Pulosari|Pangalengan|Palayangan|Kirom|Khoirul|Kurniawan|Afifah|Layangan|Vespa|RGCW/.test(t) && !ID_WORDS.test(t.replace(/Pulosari|Pangalengan|Palayangan/g, ''))) continue;
    const m = t.match(ID_WORDS);
    if (m) fail(`kata Indonesia "${m[0]}": ${t.slice(0, 110)}`);
  }

  // aset & link
  const raw = new JSDOM(html).window.document;
  raw.querySelectorAll('[src],[href],[srcset]').forEach(e => {
    for (const a of ['src', 'href', 'srcset']) {
      const v = e.getAttribute(a); if (!v) continue;
      for (const part of (a === 'srcset' ? v.split(',') : [v])) {
        const u = part.trim().split(/\s+/)[0];
        if (!u || /^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
        const p = path.join(EN, u.split('#')[0]);
        if (!fs.existsSync(p)) fail(`tautan putus ${a}="${u}"`);
      }
    }
  });
  // schema
  raw.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
    try {
      const j = JSON.parse(s.textContent);
      const txt = JSON.stringify(j);
      const words = JSON.stringify(j, (k, v) => (typeof v === 'string' && /^https?:/.test(v) ? '' : v));
      if (j['@type'] === 'BreadcrumbList' && !txt.includes('/en/')) fail('breadcrumb tidak menunjuk /en/');
      const m = words.match(ID_WORDS); if (m && j['@type'] !== 'Campground') fail(`schema ${j['@type']} memuat "${m[0]}"`);
    } catch (e) { fail('JSON-LD tidak valid: ' + e.message); }
  });
}
console.log(bad ? `\n${bad} masalah` : '\nSEMUA LOLOS');
process.exit(bad ? 1 : 0);
