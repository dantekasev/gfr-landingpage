/* ==========================================================================
   Layout bersama: header, menu mobile, band CTA, footer, tombol WhatsApp.
   Ubah menu atau data kontak di sini — otomatis berlaku di semua halaman.

   Atribut pada <body>:
     data-page="camping"   → menandai menu yang sedang aktif
     data-cta="none"       → sembunyikan band CTA sebelum footer
   ========================================================================== */
(function () {
  /* ---------- bahasa ----------
     Halaman Indonesia di root, halaman Inggris di /en/ dengan nama file yang sama.
     <html lang="en"> memilih teks Inggris; BASE = prefix path aset ('' atau '../'). */
  var LANG = /^en/i.test(document.documentElement.lang) ? 'en' : 'id';
  var me = document.currentScript || document.querySelector('script[src*="assets/js/layout.js"]');
  var BASE = me ? me.getAttribute('src').replace(/assets\/js\/layout\.js.*$/, '') : '';

  var STR = {
    id: {
      home: 'Beranda', story: 'Cerita', camping: 'Camping', outbound: 'Outbound', price: 'Harga',
      gallery: 'Galeri', info: 'Info', rules: 'Tata tertib', faq: 'FAQ', loc: 'Lokasi & rute',
      brandHome: 'Green Forest Riverside — Beranda', mainNav: 'Navigasi utama',
      openMenu: 'Buka menu', closeMenu: 'Tutup menu', skip: 'Lompat ke konten',
      langCode: 'EN', langLabel: 'Read this page in English', langLong: 'English version',
      bandH: 'reservasi dan buat pesananmu.',
      bandP: 'Kirim tanggal rencana Anda sekarang, kami respon dengan ketersediaan dan total biayanya.',
      bandPrice: 'Lihat pricelist',
      footP: 'Destinasi camping tepi sungai dan outbound di Pulosari, Pangalengan. Buka 24 jam.',
      explore: 'Jelajahi', fStory: 'Cerita kami', fCamp: 'Camping tepi sungai', information: 'Informasi',
      fPrice: 'Harga & reservasi', contact: 'Kontak', waPhone: 'WhatsApp & telepon', location: 'Lokasi',
      openMaps: 'Buka di Google Maps', fabLabel: 'Hubungi kami lewat WhatsApp', fab: 'Chat kami',
      photoView: 'Tampilan foto', close: 'Tutup', prevPhoto: 'Foto sebelumnya', nextPhoto: 'Foto berikutnya',
      msgAsk: 'Halo Green Forest Riverside, saya mau tanya ketersediaan tanggal untuk camping.',
      msgBook: 'Halo Green Forest Riverside, saya mau booking.\n\nTanggal: \nJumlah tenda: \nJumlah orang: \nAktivitas tambahan: '
    },
    en: {
      home: 'Home', story: 'Our story', camping: 'Camping', outbound: 'Activities', price: 'Prices',
      gallery: 'Gallery', info: 'Info', rules: 'House rules', faq: 'FAQ', loc: 'Location & directions',
      brandHome: 'Green Forest Riverside — Home', mainNav: 'Main navigation',
      openMenu: 'Open menu', closeMenu: 'Close menu', skip: 'Skip to content',
      langCode: 'ID', langLabel: 'Baca halaman ini dalam Bahasa Indonesia', langLong: 'Versi Bahasa Indonesia',
      bandH: 'Book your riverside stay.',
      bandP: 'Send us your planned dates and we will reply with availability and the total cost.',
      bandPrice: 'See price list',
      footP: 'Riverside camping and outdoor activities in Pulosari, Pangalengan. Open 24 hours.',
      explore: 'Explore', fStory: 'Our story', fCamp: 'Riverside camping', information: 'Information',
      fPrice: 'Prices & booking', contact: 'Contact', waPhone: 'WhatsApp & phone', location: 'Location',
      openMaps: 'Open in Google Maps', fabLabel: 'Contact us on WhatsApp', fab: 'Chat with us',
      photoView: 'Photo viewer', close: 'Close', prevPhoto: 'Previous photo', nextPhoto: 'Next photo',
      msgAsk: 'Hello Green Forest Riverside, I would like to ask about available dates for camping.',
      msgBook: 'Hello Green Forest Riverside, I would like to make a booking.\n\nDate: \nNumber of tents: \nNumber of guests: \nAdditional activities: '
    }
  };
  var T = STR[LANG];
  function esc(s) { return s.replace(/&/g, '&amp;'); }

  /* halaman padanan di bahasa lain (nama file sama, beda folder) */
  function altHref() {
    var f = location.pathname.split('/').pop() || 'index.html';
    return (LANG === 'en' ? '../' : 'en/') + f;
  }

  var SITE = {
    wa: '6282233332919',
    waLabel: '0822-3333-2919',
    email: 'greenforestriverside@gmail.com',
    ig: 'https://www.instagram.com/greenforestriverside/',
    tiktok: 'https://www.tiktok.com/@greenforestriverside',
    handle: '@greenforestriverside',
    maps: 'https://share.google/B7NXZLsKpgqQXzUhm'
  };

  var MSG_ASK = T.msgAsk;
  var MSG_BOOK = T.msgBook;
  function wa(msg) { return 'https://wa.me/' + SITE.wa + (msg ? '?text=' + encodeURIComponent(msg) : ''); }

  var NAV = [
    { id: 'cerita', href: 'cerita.html', label: T.story },
    { id: 'camping', href: 'camping.html', label: T.camping },
    { id: 'outbound', href: 'outbound.html', label: T.outbound },
    { id: 'harga', href: 'harga.html', label: T.price },
    { id: 'galeri', href: 'galeri.html', label: T.gallery },
    { id: 'info', label: T.info, children: [
      { id: 'ketentuan', href: 'ketentuan.html', label: T.rules },
      { id: 'faq', href: 'faq.html', label: T.faq },
      { id: 'lokasi', href: 'index.html#lokasi', label: esc(T.loc) }
    ] }
  ];

  var WA_PATH = 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.89-1.14-4.72-4.1-4.86-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.65.5.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.3.36-.42.48-.14.14-.29.29-.12.57.16.29.73 1.2 1.56 1.95 1.07.95 1.98 1.25 2.26 1.39.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.29.38-.24.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.69-.18 1.38z';
  var TT_PATH = 'M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 01-2.59-2.59 2.59 2.59 0 013.39-2.47V9.7a5.72 5.72 0 00-.8-.06A5.71 5.71 0 004.15 15.4a5.71 5.71 0 005.71 5.71 5.71 5.71 0 005.71-5.71V9.01a7.35 7.35 0 004.28 1.37V7.29a4.28 4.28 0 01-3.25-1.47z';

  function svg(size, path, filled) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' +
      (filled ? 'currentColor' : 'none') + '"' + (filled ? '' : ' stroke="currentColor" stroke-width="1.7"') +
      ' aria-hidden="true">' + path + '</svg>';
  }

  var ICON = {
    wa: function (s) { return svg(s || 16, '<path d="' + WA_PATH + '"/>', true); },
    tiktok: function (s) { return svg(s || 18, '<path d="' + TT_PATH + '"/>', true); },
    ig: function (s) { return svg(s || 18, '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>'); },
    mail: function (s) { return svg(s || 18, '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'); },
    globe: function (s) { return svg(s || 16, '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z"/>'); },
    pin: function (s) { return svg(s || 18, '<path d="M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'); },
    chev: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>'
  };

  window.GFR = { site: SITE, wa: wa, icon: ICON, lang: LANG, base: BASE, t: T };

  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  function cur(id) { return id === page ? ' aria-current="page"' : ''; }

  /* ---------- header ---------- */
  var desk = NAV.map(function (n) {
    if (!n.children) return '<a href="' + n.href + '"' + cur(n.id) + '>' + n.label + '</a>';
    var isCur = n.children.some(function (c) { return c.id === page; });
    return '<div class="dd' + (isCur ? ' is-current' : '') + '">' +
      '<button class="dd-btn" type="button" aria-expanded="false" aria-haspopup="true">' + n.label + ICON.chev + '</button>' +
      '<div class="dd-menu">' + n.children.map(function (c) {
        return '<a href="' + c.href + '"' + cur(c.id) + '>' + c.label + '</a>';
      }).join('') + '</div></div>';
  }).join('');

  var flat = [{ id: 'beranda', href: 'index.html', label: T.home }];
  NAV.forEach(function (n) { (n.children || [n]).forEach(function (c) { flat.push(c); }); });
  var mob = flat.map(function (c, i) {
    return '<a href="' + c.href + '"' + cur(c.id) + ' style="transition-delay:' + (0.04 * i + 0.06).toFixed(2) + 's">' +
      c.label + '<small>' + String(i + 1).padStart(2, '0') + '</small></a>';
  }).join('');

  var header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<div class="hbar">' +
      '<a class="brand" href="index.html" aria-label="' + T.brandHome + '">' +
        '<img src="' + BASE + 'assets/img/logo-mark.png" alt="" width="46" height="31">' +
        '<span class="bt"><b>Green Forest Riverside</b><span class="sub">Pangalengan, Bandung</span></span>' +
      '</a>' +
      '<nav class="nav" aria-label="' + T.mainNav + '">' + desk + '</nav>' +
      '<a class="lang-sw" href="' + altHref() + '" hreflang="' + T.langCode.toLowerCase() + '" aria-label="' + T.langLabel + '">' +
        ICON.globe(16) +
        '<span class="' + (LANG === 'id' ? 'on' : 'to') + '">ID</span>' +
        '<span class="' + (LANG === 'en' ? 'on' : 'to') + '">EN</span>' +
      '</a>' +
      '<a class="btn btn-wa" href="' + wa(MSG_ASK) + '" target="_blank" rel="noopener">' + ICON.wa(15) + 'Booking</a>' +
      '<button class="burger" type="button" aria-label="' + T.openMenu + '" aria-expanded="false" aria-controls="mmenu"><span></span></button>' +
    '</div>';

  var mmenu = document.createElement('div');
  mmenu.className = 'mmenu';
  mmenu.id = 'mmenu';
  mmenu.setAttribute('aria-hidden', 'true');
  mmenu.innerHTML =
    '<nav aria-label="Menu">' + mob + '</nav>' +
    '<div class="mmenu-foot">' +
      '<a class="mmenu-lang" href="' + altHref() + '" hreflang="' + T.langCode.toLowerCase() + '" lang="' + T.langCode.toLowerCase() + '">' + ICON.globe(18) + T.langLong + '</a>' +
      '<a href="' + wa() + '" target="_blank" rel="noopener">WhatsApp ' + SITE.waLabel + '</a>' +
      '<a href="mailto:' + SITE.email + '">' + SITE.email + '</a>' +
      '<div class="mmenu-social">' +
        '<a href="' + SITE.ig + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON.ig(20) + '</a>' +
        '<a href="' + SITE.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok">' + ICON.tiktok(20) + '</a>' +
        '<a href="' + SITE.maps + '" target="_blank" rel="noopener" aria-label="Google Maps">' + ICON.pin(20) + '</a>' +
      '</div>' +
    '</div>';

  var skip = document.createElement('a');
  skip.className = 'skip';
  skip.href = '#utama';
  skip.textContent = T.skip;

  body.insertBefore(mmenu, body.firstChild);
  body.insertBefore(header, body.firstChild);
  body.insertBefore(skip, body.firstChild);

  /* ---------- band CTA + footer + tombol melayang ---------- */
  var tail = document.createDocumentFragment();

  if (body.getAttribute('data-cta') !== 'none') {
    var band = document.createElement('section');
    band.className = 'band';
    band.innerHTML =
      '<div class="wrap reveal">' +
        '<h2>' + T.bandH + '</h2>' +
        '<p>' + T.bandP + '</p>' +
        '<div class="cta-row">' +
          '<a class="btn btn-wa" href="' + wa(MSG_BOOK) + '" target="_blank" rel="noopener">' + ICON.wa(15) + 'Chat WhatsApp: ' + SITE.waLabel + '</a>' +
          '<a class="btn btn-ghost" href="harga.html">' + T.bandPrice + '</a>' +
        '</div>' +
      '</div>';
    tail.appendChild(band);
  }

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="foot">' +
        '<div>' +
          '<img class="foot-logo" src="' + BASE + 'assets/img/logo-full.png" alt="Green Forest Riverside — Pangalengan, Bandung" loading="lazy" width="200" height="172">' +
          '<p>' + T.footP + '</p>' +
          '<div class="social">' +
            '<a href="' + SITE.ig + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON.ig(18) + '</a>' +
            '<a href="' + SITE.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok">' + ICON.tiktok(18) + '</a>' +
            '<a href="' + wa() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICON.wa(17) + '</a>' +
            '<a href="mailto:' + SITE.email + '" aria-label="Email">' + ICON.mail(18) + '</a>' +
            '<a href="' + SITE.maps + '" target="_blank" rel="noopener" aria-label="Google Maps">' + ICON.pin(18) + '</a>' +
          '</div>' +
        '</div>' +
        '<div><h4>' + T.explore + '</h4><ul>' +
          '<li><a href="cerita.html">' + T.fStory + '</a></li>' +
          '<li><a href="camping.html">' + T.fCamp + '</a></li>' +
          '<li><a href="outbound.html">' + T.outbound + '</a></li>' +
          '<li><a href="galeri.html">' + T.gallery + '</a></li>' +
        '</ul></div>' +
        '<div><h4>' + T.information + '</h4><ul>' +
          '<li><a href="harga.html">' + esc(T.fPrice) + '</a></li>' +
          '<li><a href="ketentuan.html">' + T.rules + '</a></li>' +
          '<li><a href="faq.html">' + T.faq + '</a></li>' +
          '<li><a href="index.html#lokasi">' + esc(T.loc) + '</a></li>' +
        '</ul></div>' +
        '<div><h4>' + T.contact + '</h4><ul class="contact">' +
          '<li><span>' + esc(T.waPhone) + '</span><a href="' + wa() + '" target="_blank" rel="noopener">' + SITE.waLabel + '</a></li>' +
          '<li><span>Email</span><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
          '<li><span>Instagram</span><a href="' + SITE.ig + '" target="_blank" rel="noopener">' + SITE.handle + '</a></li>' +
          '<li><span>TikTok</span><a href="' + SITE.tiktok + '" target="_blank" rel="noopener">' + SITE.handle + '</a></li>' +
          '<li><span>' + T.location + '</span><a href="' + SITE.maps + '" target="_blank" rel="noopener">' + T.openMaps + '</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="copy">' +
        '<span>© ' + new Date().getFullYear() + ' Green Forest Riverside.</span>' +
        '<span>Pulosari, Kec. Pangalengan, Kabupaten Bandung, Jawa Barat 40378</span>' +
      '</div>' +
    '</div>';
  tail.appendChild(footer);

  var fab = document.createElement('a');
  fab.className = 'fab';
  fab.href = wa(MSG_ASK);
  fab.target = '_blank';
  fab.rel = 'noopener';
  fab.setAttribute('aria-label', T.fabLabel);
  fab.innerHTML = ICON.wa(21) + '<span>' + T.fab + '</span>';
  tail.appendChild(fab);

  body.appendChild(tail);
})();
