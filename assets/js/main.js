/* ==========================================================================
   Interaksi: header saat scroll, menu mobile, dropdown, animasi, lightbox.
   ========================================================================== */
(function () {
  var root = document.documentElement;
  var G = window.GFR || {};
  var T = G.t || {};
  var BASE = G.base || '';
  var header = document.querySelector('.site-header');

  /* ---- header jadi solid setelah scroll ---- */
  if (header) {
    var onScroll = function () { header.classList.toggle('is-solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- menu mobile ---- */
  var burger = document.querySelector('.burger');
  var mmenu = document.getElementById('mmenu');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? (T.closeMenu || 'Tutup menu') : (T.openMenu || 'Buka menu'));
    mmenu.setAttribute('aria-hidden', String(!open));
  }
  if (burger && mmenu) {
    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    mmenu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width:1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---- dropdown (klik untuk perangkat sentuh) ---- */
  document.querySelectorAll('.dd').forEach(function (dd) {
    var btn = dd.querySelector('.dd-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dd.open').forEach(function (dd) {
      dd.classList.remove('open');
      dd.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- animasi muncul saat scroll ---- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- pengalih bahasa denah ---- */
  var plan = document.querySelector('[data-plan-switch]');
  if (plan) {
    var planImg = plan.querySelector('.plan-sheet img');
    var planFull = plan.querySelector('[data-plan-full]');
    var LABEL = {
      id: 'Denah lokasi glamping Green Forest Riverside di tepi Sungai Palayangan, menunjukkan empat tenda, kamar mandi, pintu masuk, dan area kabin eksklusif',
      en: 'Site plan of Green Forest Riverside glamping on the banks of the Palayangan River, showing four tents, toilets, the entrance and the exclusive cabin area'
    };
    plan.querySelectorAll('.plan-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-plan');
        plan.querySelectorAll('.plan-tab').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        var d = BASE + 'assets/img/denah-' + lang;
        planImg.src = d + '-1400.webp';
        planImg.srcset = d + '-800.webp 800w, ' + d + '-1400.webp 1400w, ' + d + '-2400.webp 2400w';
        planImg.alt = LABEL[lang];
        if (planFull) planFull.href = d + '-2400.webp';
      });
    });
  }

  /* ---- lightbox galeri ---- */
  var gal = document.querySelector('[data-gallery]');
  if (gal && typeof HTMLDialogElement === 'function') {
    var figs = Array.prototype.slice.call(gal.querySelectorAll('figure'));
    var dlg = document.createElement('dialog');
    dlg.className = 'lb';
    dlg.setAttribute('aria-label', T.photoView || 'Tampilan foto');
    dlg.innerHTML =
      '<div class="lb-top"><span class="lb-count"></span>' +
        '<button class="lb-btn lb-close" type="button" aria-label="' + (T.close || 'Tutup') + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<figure><img alt=""></figure>' +
      '<figcaption class="lb-cap"></figcaption>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="' + (T.prevPhoto || 'Foto sebelumnya') + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="' + (T.nextPhoto || 'Foto berikutnya') + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>';
    document.body.appendChild(dlg);

    var img = dlg.querySelector('img');
    var cap = dlg.querySelector('.lb-cap');
    var count = dlg.querySelector('.lb-count');
    var idx = 0;

    var show = function (i) {
      idx = (i + figs.length) % figs.length;
      var src = figs[idx].querySelector('img');
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      cap.textContent = (figs[idx].querySelector('figcaption') || {}).textContent || '';
      count.textContent = (idx + 1) + ' / ' + figs.length;
    };

    figs.forEach(function (fig, i) {
      var b = fig.querySelector('button');
      if (b) b.addEventListener('click', function () { show(i); dlg.showModal(); });
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });

    var x0 = null;
    dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
})();
