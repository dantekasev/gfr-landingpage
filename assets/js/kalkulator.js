/* ==========================================================================
   Kalkulator biaya (halaman harga).
   Harga dibaca dari atribut data-price pada tiap baris .crow di harga.html —
   ubah harga di sana (dan di daftar harga di atasnya).
   ========================================================================== */
(function () {
  var DP_TENDA = 150000;   /* DP penginapan per penyewaan tenda */
  var DP_PAINTBALL = 0.5;  /* paintball wajib DP minimal 50%; rafting & ATV dibayar di tempat */
  var PAINT_MIN = 10;      /* paintball minimal 10 orang */

  /* teks per bahasa; {n} {m} {x} diganti angka */
  var STR = {
    id: {
      cur: 'Rp ', sep: '.',
      wd: 'Camping week-day · {n} tenda × {m} malam', we: 'Camping week-end · {n} tenda × {m} malam',
      extra: 'Extra pax sarapan · {n} orang × {m} malam', kayu: 'Kayu bakar · {n} ikat',
      raft: 'Rafting · {n} perahu', raftx: 'Rafting tambahan orang · {n} orang', raftdoc: 'Dokumentasi rafting · {n} perahu',
      atv1: 'ATV single · {n} motor', atv2: 'ATV double · {n} motor',
      paint: 'Paintball · {n} orang', paintMin: ' (minimal {x})',
      hTenda: 'Isi jumlah tenda untuk menghitung biaya camping.',
      hMalam: 'Isi jumlah malam (week-day dan/atau week-end) untuk menghitung biaya camping.',
      hExtra: 'Isi jumlah malam agar biaya extra pax ikut terhitung.',
      hPaint: 'Paintball minimal {x} orang, jadi dihitung {x} orang.',
      msgHead: 'Halo Green Forest Riverside, saya mau booking.\n\nRincian pesanan (perkiraan dari kalkulator):\n',
      msgTotal: 'Perkiraan total: ', msgDp: 'Perkiraan DP: ', msgDpNote: ' (rafting & ATV dibayar di tempat)',
      msgTail: '\n\nTanggal: \nJumlah orang: '
    },
    en: {
      cur: 'IDR ', sep: ',',
      wd: 'Camping, weekday · {n} tent × {m} night', we: 'Camping, weekend · {n} tent × {m} night',
      extra: 'Extra guest breakfast · {n} guest × {m} night', kayu: 'Firewood · {n} bundle',
      raft: 'Rafting · {n} boat', raftx: 'Rafting extra person · {n} person', raftdoc: 'Rafting photo & video · {n} boat',
      atv1: 'ATV single · {n} vehicle', atv2: 'ATV double · {n} vehicle',
      paint: 'Paintball · {n} player', paintMin: ' (minimum {x})',
      hTenda: 'Enter the number of tents to calculate the camping cost.',
      hMalam: 'Enter the number of nights (weekday and/or weekend) to calculate the camping cost.',
      hExtra: 'Enter the number of nights so the extra guest breakfast is included.',
      hPaint: 'Paintball requires at least {x} players, so it is counted as {x}.',
      msgHead: 'Hello Green Forest Riverside, I would like to make a booking.\n\nOrder details (estimate from the calculator):\n',
      msgTotal: 'Estimated total: ', msgDp: 'Estimated deposit: ', msgDpNote: ' (rafting & ATV are paid on site)',
      msgTail: '\n\nDate: \nNumber of guests: '
    }
  };

  /* bentuk jamak Inggris sederhana: "1 tent", "2 tents"; "person" -> "people" */
  function plural(s, n) {
    if (n === 1) return s;
    if (s === 'person') return 'people';
    return s + 's';
  }
  function fmt(L, key, n, m, x) {
    var s = L[key];
    if (L === STR.en) {
      s = s.replace(/\{n\} (\w+)/, function (_, w) { return '{n} ' + plural(w, n); })
           .replace(/\{m\} (\w+)/, function (_, w) { return '{m} ' + plural(w, m); });
    }
    return s.replace(/\{n\}/g, n).replace(/\{m\}/g, m).replace(/\{x\}/g, x);
  }

  function rp(n, lang) {
    var L = STR[lang] || STR.id;
    return L.cur + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, L.sep);
  }

  /* q: jumlah per item, P: harga per item, lang: 'id' | 'en'. Mengembalikan baris rincian dan total. */
  function compute(q, P, lang) {
    var L = STR[lang] || STR.id;
    var lines = [], paint = 0, hint = '';
    function add(text, value) { lines.push({ text: text, value: value }); return value; }

    var tenda = q.tenda, malam = q.wd + q.we;

    if (tenda > 0 && q.wd > 0) add(fmt(L, 'wd', tenda, q.wd), tenda * q.wd * P.wd);
    if (tenda > 0 && q.we > 0) add(fmt(L, 'we', tenda, q.we), tenda * q.we * P.we);
    if (q.extra > 0 && malam > 0) add(fmt(L, 'extra', q.extra, malam), q.extra * malam * P.extra);
    if (q.kayu > 0) add(fmt(L, 'kayu', q.kayu), q.kayu * P.kayu);

    if (q.raft > 0) add(fmt(L, 'raft', q.raft), q.raft * P.raft);
    if (q.raftx > 0) add(fmt(L, 'raftx', q.raftx), q.raftx * P.raftx);
    if (q.raftdoc > 0) add(fmt(L, 'raftdoc', q.raftdoc), q.raftdoc * P.raftdoc);
    if (q.atv1 > 0) add(fmt(L, 'atv1', q.atv1), q.atv1 * P.atv1);
    if (q.atv2 > 0) add(fmt(L, 'atv2', q.atv2), q.atv2 * P.atv2);
    if (q.paint > 0) {
      var pn = Math.max(q.paint, PAINT_MIN);
      paint = add(fmt(L, 'paint', pn) + (q.paint < PAINT_MIN ? fmt(L, 'paintMin', 0, 0, PAINT_MIN) : ''), pn * P.paint);
    }

    /* parkir tidak dihitung: dibayar langsung ke pengelola parkir (pihak eksternal) */

    if (malam > 0 && tenda === 0) hint = L.hTenda;
    else if (tenda > 0 && malam === 0) hint = L.hMalam;
    else if (q.extra > 0 && malam === 0) hint = L.hExtra;
    else if (q.paint > 0 && q.paint < PAINT_MIN) hint = fmt(L, 'hPaint', 0, 0, PAINT_MIN);

    var total = 0;
    lines.forEach(function (l) { total += l.value; });

    var dp = 0;
    if (tenda > 0 && malam > 0) dp += DP_TENDA * tenda;
    dp += Math.round(paint * DP_PAINTBALL);

    return { lines: lines, total: total, dp: dp, rest: total - dp, hint: hint };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { compute: compute, rp: rp, PAINT_MIN: PAINT_MIN, STR: STR };
  if (typeof document === 'undefined') return;

  var root = document.querySelector('[data-calc]');
  if (!root) return;
  var LANG = /^en/i.test(document.documentElement.lang) ? 'en' : 'id';
  var L = STR[LANG];
  function money(n) { return rp(n, LANG); }

  var rows = Array.prototype.slice.call(root.querySelectorAll('.crow[data-k]'));
  var P = {}, inputs = {};
  rows.forEach(function (row) {
    var k = row.getAttribute('data-k');
    P[k] = Number(row.getAttribute('data-price')) || 0;
    inputs[k] = row.querySelector('input');
  });

  var elLines = root.querySelector('[data-lines]');
  var elEmpty = root.querySelector('[data-empty]');
  var elHint = root.querySelector('[data-hint]');
  var elTotal = root.querySelector('[data-total]');
  var elDp = root.querySelector('[data-dp]');
  var elRest = root.querySelector('[data-rest]');
  var elSend = root.querySelector('[data-send]');

  function readQty() {
    var q = {};
    Object.keys(inputs).forEach(function (k) {
      var inp = inputs[k];
      var max = Number(inp.max) || 99;
      var v = parseInt(inp.value, 10);
      if (isNaN(v) || v < 0) v = 0;
      if (v > max) v = max;
      q[k] = v;
    });
    /* penambahan orang rafting maksimal 1 per perahu; dokumentasi paling banyak 1 per perahu */
    if (q.raftx > q.raft) q.raftx = q.raft;
    if (q.raftdoc > q.raft) q.raftdoc = q.raft;
    return q;
  }

  function sync(q) {
    /* tulis balik nilai yang sudah dibersihkan, atur batas dan status tombol */
    inputs.raftx.max = q.raft;
    inputs.raftdoc.max = q.raft;
    rows.forEach(function (row) {
      var k = row.getAttribute('data-k');
      var inp = inputs[k];
      var max = Number(inp.max) || 99;
      if (document.activeElement !== inp || inp.value === '') inp.value = q[k];
      row.querySelector('.stp').classList.toggle('on', q[k] > 0);
      var btns = row.querySelectorAll('button');
      btns[0].disabled = q[k] <= 0;
      btns[1].disabled = q[k] >= max;
    });
  }

  /* input ber-data-min-order (paintball): nilai 1..minimal-1 dilompatkan ke minimal, atau ke 0 saat dikurangi */
  function snapMin(inp, v, dir) {
    var m = Number(inp.getAttribute('data-min-order')) || 0;
    if (v > 0 && v < m) return dir < 0 ? 0 : m;
    return v;
  }

  function message(r) {
    var s = L.msgHead;
    r.lines.forEach(function (l) { s += '• ' + l.text + ' — ' + money(l.value) + '\n'; });
    s += '\n' + L.msgTotal + money(r.total) + '\n' + L.msgDp + money(r.dp) + L.msgDpNote + L.msgTail;
    return s;
  }

  function render() {
    var q = readQty();
    var r = compute(q, P, LANG);
    sync(q);

    elLines.innerHTML = '';
    r.lines.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('span'); a.textContent = l.text;
      var b = document.createElement('span'); b.textContent = money(l.value);
      li.appendChild(a); li.appendChild(b);
      elLines.appendChild(li);
    });
    elLines.hidden = r.lines.length === 0;
    elEmpty.hidden = r.lines.length > 0;
    elHint.hidden = !r.hint;
    elHint.textContent = r.hint;
    elTotal.textContent = money(r.total);
    elDp.textContent = money(r.dp);
    elRest.textContent = money(r.rest);

    var ok = r.total > 0;
    elSend.setAttribute('aria-disabled', ok ? 'false' : 'true');
    elSend.tabIndex = ok ? 0 : -1;
    var msg = message(r);
    elSend.href = ok
      ? (window.GFR && window.GFR.wa ? window.GFR.wa(msg) : 'https://wa.me/6282233332919?text=' + encodeURIComponent(msg))
      : '#kalkulator';
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]');
    if (b) {
      var inp = b.closest('.stp').querySelector('input');
      var step = Number(b.getAttribute('data-step'));
      var v = snapMin(inp, (parseInt(inp.value, 10) || 0) + step, step);
      inp.value = Math.max(0, Math.min(Number(inp.max) || 99, v));
      render();
      return;
    }
    if (e.target.closest('[data-reset]')) {
      Object.keys(inputs).forEach(function (k) { inputs[k].value = 0; });
      render();
      return;
    }
    if (e.target.closest('[data-send]') && elSend.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
  root.addEventListener('input', render);
  /* saat selesai mengetik, tuliskan nilai yang sudah dibatasi (mis. 999 jadi batas maksimum) */
  root.addEventListener('change', function (e) {
    var inp = e.target;
    if (inp.tagName !== 'INPUT') return;
    var v = parseInt(inp.value, 10);
    inp.value = isNaN(v) ? 0 : Math.max(0, Math.min(Number(inp.max) || 99, snapMin(inp, v, 1)));
    render();
  });

  render();
})();
