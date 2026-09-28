/* Open Netrikkan - site behaviour: nav, reveal, hero simulation, video player, lightbox, whitepaper gate */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  window.ONstore = store;

  /* ---- nav ---- */
  var burger = $('[data-burger]'), menu = $('#menu');
  if (burger) burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  $$('.dropbtn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var p = b.parentNode, was = p.classList.contains('open');
      $$('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
      if (!was) p.classList.add('open'); b.setAttribute('aria-expanded', !was); e.stopPropagation();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-drop')) $$('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
  });
  var path = document.body.getAttribute('data-path') || '';
  $$('.menu a.m').forEach(function (a) { var h = a.getAttribute('href'); if (h !== '/' && path.indexOf(h) === 0) a.classList.add('on'); });

  /* ---- reveal on scroll ---- */
  var rv = $$('.tcard,.mcard,.vcard,.icard,.cmini,.ccard,.fitem,.link,.wp-tool,.wp-steps>div,.result,.statgrid>div');
  rv.forEach(function (el) { el.classList.add('rv'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---- count-up ---- */
  $$('[data-count]').forEach(function (el) {
    var target = +el.getAttribute('data-count'), done = false;
    var run = function () {
      if (done) return; done = true; var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1200), v = Math.round(target * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString('en-US'); if (p < 1) requestAnimationFrame(tick); })(t0);
    };
    if ('IntersectionObserver' in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { run(); o.disconnect(); } }); o.observe(el); } else run();
  });

  /* ---- hero: a small live discrete-event simulation ---- */
  var cv = $('#heroCanvas');
  if (cv && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), visible = true;
    var nodes = [
      { id: 'src', x: .10, y: .66, label: 'Orders', kind: 'src' },
      { id: 'm1', x: .38, y: .50, label: 'Machine A', srv: 2.6, kind: 'm' },
      { id: 'm2', x: .38, y: .66, label: 'Machine B', srv: 3.4, kind: 'm' },
      { id: 'm3', x: .38, y: .82, label: 'Machine C', srv: 4.6, kind: 'm' },
      { id: 'qc', x: .68, y: .66, label: 'QC', srv: 1.6, kind: 'm' },
      { id: 'out', x: .91, y: .66, label: 'Dispatch', kind: 'out' }
    ];
    var by = {}; nodes.forEach(function (n) { n.q = []; n.busy = null; n.done = 0; n.util = 0; by[n.id] = n; });
    var ents = [], done = 0, spawnT = 0, last = performance.now();
    function size() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener('resize', size);
    var pos = function (n) { return { x: n.x * W, y: n.y * H }; };
    function launch(e, from, to, speed) { e.from = from; e.to = to; e.t = 0; e.speed = speed || .7; e.state = 'move'; }
    function pickMachine() { var best = null, bl = 1e9; ['m1', 'm2', 'm3'].forEach(function (id) { var n = by[id], l = n.q.length + (n.busy ? 1 : 0) + Math.random() * .8; if (l < bl) { bl = l; best = n; } }); return best; }
    function arrive(e, n) {
      if (n.kind === 'out') { done++; ents.splice(ents.indexOf(e), 1); return; }
      e.state = 'wait'; e.at = n; n.q.push(e);
    }
    function step(dt) {
      spawnT -= dt; if (spawnT <= 0 && ents.length < 40) { spawnT = .55 + Math.random() * .7; var e = { hot: Math.random() < .12 }; ents.push(e); launch(e, by.src, pickMachine(), .9); }
      ents.slice().forEach(function (e) {
        if (e.state === 'move') { e.t += dt * e.speed; if (e.t >= 1) arrive(e, e.to); }
      });
      nodes.forEach(function (n) {
        if (n.kind !== 'm') return;
        if (!n.busy && n.q.length) { n.busy = n.q.shift(); n.busy.state = 'serve'; n.busy.rem = n.srv * (.7 + Math.random() * .6); }
        if (n.busy) {
          n.util += (1 - n.util) * dt * .5; n.busy.rem -= dt;
          if (n.busy.rem <= 0) { var e = n.busy; n.busy = null; n.done++; launch(e, n, n.id === 'qc' ? by.out : by.qc, .8); }
        } else n.util -= n.util * dt * .5;
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var conns = [['src', 'm1'], ['src', 'm2'], ['src', 'm3'], ['m1', 'qc'], ['m2', 'qc'], ['m3', 'qc'], ['qc', 'out']];
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(188,218,251,.35)'; ctx.setLineDash([4, 6]);
      conns.forEach(function (c) { var a = pos(by[c[0]]), b = pos(by[c[1]]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      ctx.setLineDash([]);
      var bw = Math.max(64, Math.min(96, W * .065)), bh = 44;
      nodes.forEach(function (n) {
        var p = pos(n); ctx.save(); ctx.translate(p.x, p.y);
        if (n.kind === 'm') {
          ctx.fillStyle = 'rgba(3,108,231,.85)'; ctx.strokeStyle = 'rgba(188,218,251,.8)'; ctx.lineWidth = 1.5;
          rr(-bw / 2, -bh / 2, bw, bh, 10); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.12)'; rr(-bw / 2 + 8, bh / 2 - 12, bw - 16, 5, 3); ctx.fill();
          ctx.fillStyle = n.util > .75 ? '#2EA947' : '#7DB4F6'; rr(-bw / 2 + 8, bh / 2 - 12, (bw - 16) * n.util, 5, 3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '600 11px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(n.label, 0, -3);
          if (n.q.length) { ctx.fillStyle = '#2EA947'; ctx.font = '700 11px DM Sans, sans-serif'; ctx.fillText(n.q.length + ' queued', 0, -bh / 2 - 7); }
        } else {
          ctx.fillStyle = n.kind === 'out' ? '#7DB4F6' : 'rgba(255,255,255,.14)'; ctx.strokeStyle = 'rgba(255,255,255,.5)';
          ctx.beginPath(); ctx.arc(0, 0, 22, 0, 6.3); ctx.fill(); ctx.stroke();
          ctx.fillStyle = n.kind === 'out' ? '#062F6B' : '#fff'; ctx.font = '600 10px DM Sans, sans-serif'; ctx.textAlign = 'center'; if (n.kind === 'out') ctx.fillText(n.label, 0, 3.5); else ctx.fillText(n.label, 0, -30);
        }
        ctx.restore();
      });
      ents.forEach(function (e) {
        var x, y;
        if (e.state === 'move') { var a = pos(e.from), b = pos(e.to), t = e.t * e.t * (3 - 2 * e.t); x = a.x + (b.x - a.x) * t; y = a.y + (b.y - a.y) * t; }
        else if (e.state === 'wait') { var p = pos(e.at), i = e.at.q.indexOf(e); x = p.x - bw / 2 - 12 - i * 10; y = p.y; }
        else { var p2 = pos(e.at); x = p2.x; y = p2.y + 14; }
        ctx.beginPath(); ctx.fillStyle = e.hot ? '#2EA947' : '#DCEBFD'; ctx.arc(x, y, e.state === 'serve' ? 3 : 4, 0, 6.3); ctx.fill();
      });
    }
    function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    var kT = $('#kpiThru'), kU = $('#kpiUtil'), kQ = $('#kpiQ'), kt = 0;
    function loop(now) {
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      if (visible) {
        step(dt); draw(); kt += dt;
        if (kt > .3) { kt = 0; if (kT) kT.textContent = done; var u = 0, q = 0; ['m1', 'm2', 'm3'].forEach(function (id) { u += by[id].util; q += by[id].q.length; }); if (kU) kU.textContent = Math.round(u / 3 * 100) + '%'; if (kQ) kQ.textContent = q; }
      }
      requestAnimationFrame(loop);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    requestAnimationFrame(loop);
  }

  /* ---- modals ---- */
  function openModal(m) { m.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal(m) {
    m.hidden = true; document.body.style.overflow = '';
    var v = $('video', m); if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
  }
  $$('.modal,.lightbox').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.modal,.lightbox').forEach(function (m) { if (!m.hidden) closeModal(m); }); });

  /* ---- protected video playback ---- */
  var vm = $('#videoModal'), vp = $('#vplayer');
  if (vp) {
    ['contextmenu', 'dragstart'].forEach(function (ev) { vp.addEventListener(ev, function (e) { e.preventDefault(); }); vm.addEventListener(ev, function (e) { if (e.target.closest('.vwrap')) e.preventDefault(); }); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-video]'); if (!b) return;
      e.preventDefault();
      var id = b.getAttribute('data-video');
      $('#vtitle').textContent = b.getAttribute('data-title') || ''; $('#vblurb').textContent = b.getAttribute('data-blurb') || '';
      openModal(vm);
      fetch('/api/video-token?id=' + encodeURIComponent(id), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.src) throw new Error('no src'); vp.src = j.src; vp.load(); var pr = vp.play(); if (pr && pr.catch) pr.catch(function () {});
      }).catch(function () { $('#vblurb').textContent = 'The video could not be loaded right now. Please try again shortly.'; });
    });
  }

  /* ---- lightbox ---- */
  var lb = $('#lightbox');
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lightbox]'); if (!b || !lb) return;
    $('img', lb).src = b.getAttribute('data-lightbox'); $('img', lb).alt = b.getAttribute('data-cap') || ''; $('p', lb).textContent = b.getAttribute('data-cap') || ''; openModal(lb);
  });

  /* ---- whitepaper gate ---- */
  var wpm = $('#wpModal');
  function wpToken() { try { var t = JSON.parse(store.get('on_wp') || 'null'); if (t && t.exp > Date.now()) return t.token; } catch (e) {} store.del('on_wp'); return null; }
  function showWpLinks() {
    var tok = wpToken(); if (!tok) return;
    $$('[data-wp-download]').forEach(function (b) {
      if (b.tagName === 'A') return;
      var a = document.createElement('a'); a.className = b.className; a.href = '/download/whitepaper?t=' + encodeURIComponent(tok); a.innerHTML = b.innerHTML; a.setAttribute('data-wp-download', ''); b.parentNode.replaceChild(a, b);
    });
  }
  window.ONwpReady = function (token) { store.set('on_wp', JSON.stringify({ token: token, exp: Date.now() + 23 * 3600e3 })); showWpLinks(); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-wp-download]'); if (!b) return;
    e.preventDefault();
    openModal(wpm);
  });
  showWpLinks();

  /* ---- whitepaper reading UX ---- */
  if (document.body.classList.contains('page-wp')) {
    var bar = $('#progress'), secs = $$('.wp-sec'), links = $$('[data-toc]');
    var onScroll = function () {
      var h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
      var cur = null; secs.forEach(function (s) { if (s.getBoundingClientRect().top < 160) cur = s.id; });
      links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('data-toc') === cur); });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
})();
