/* Lead forms: validation (corporate email only), submit, whitepaper unlock */
(function () {
  'use strict';
  var FREE = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'ymail.com', 'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com', 'pm.me', 'rediffmail.com', 'rediff.com', 'gmx.com', 'gmx.net', 'mail.com', 'zohomail.com', 'yandex.com', 'yandex.ru', 'qq.com', '163.com', '126.com', 'tutanota.com', 'fastmail.com', 'inbox.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com'];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function check(f) {
    var e = {}, v = {};
    ['name', 'title', 'designation', 'email', 'phone', 'interest', 'size', 'sector', 'note'].forEach(function (k) { var el = f.elements[k]; v[k] = el ? el.value.trim() : ''; });
    if (v.name.length < 2) e.name = 'Enter your full name';
    if (v.title.length < 2) e.title = 'Enter your job title';
    if (!v.designation) e.designation = 'Select your designation level';
    if (!EMAIL.test(v.email)) e.email = 'Enter a valid work email';
    else if (FREE.indexOf(v.email.split('@')[1].toLowerCase()) > -1) e.email = 'Please use your corporate email address (personal email domains are not accepted)';
    var d = v.phone.replace(/\D/g, '');
    if (!/^[+\d][\d\s\-()]*$/.test(v.phone) || d.length < 8 || d.length > 15) e.phone = 'Enter a valid phone number';
    if (!v.interest) e.interest = 'Select an area of interest';
    if (!v.size) e.size = 'Select company size';
    if (!v.sector) e.sector = 'Select your sector';
    if (!f.elements.consent.checked) e.consent = 'Please accept to continue';
    return { e: e, v: v };
  }
  function show(f, errs) {
    Array.prototype.forEach.call(f.querySelectorAll('.f'), function (l) {
      var inp = l.querySelector('input,select,textarea'); var m = errs[inp.name]; l.classList.toggle('bad', !!m); var em = l.querySelector('.err'); if (em) em.textContent = m || '';
    });
    var ce = f.querySelector('.consent-err'); if (ce) ce.textContent = errs.consent || '';
  }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-lead]'), function (f) {
    var status = f.querySelector('.form-status'), btn = f.querySelector('button[type=submit]');
    f.addEventListener('input', function (e) { var l = e.target.closest('.f'); if (l && l.classList.contains('bad')) { l.classList.remove('bad'); l.querySelector('.err').textContent = ''; } });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault(); status.textContent = ''; status.className = 'form-status';
      var r = check(f); show(f, r.e);
      if (Object.keys(r.e).length) { var first = f.querySelector('.f.bad input,.f.bad select'); if (first) first.focus(); status.textContent = 'Please complete all required fields.'; status.className = 'form-status bad'; return; }
      var payload = Object.assign({}, r.v, { consent: true, website: f.elements.website.value, source: f.getAttribute('data-source'), page: location.pathname });
      btn.disabled = true; var label = btn.innerHTML; btn.textContent = 'Sending…';
      fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (o) {
          if (!o.ok || !o.j.ok) { if (o.j.errors) show(f, o.j.errors); status.textContent = o.j.message || 'Please check the highlighted fields.'; status.className = 'form-status bad'; return; }
          if (f.getAttribute('data-source') === 'whitepaper' && o.j.token) {
            if (window.ONwpReady) window.ONwpReady(o.j.token);
            var ok = f.querySelector('.wp-success'), link = f.querySelector('[data-wp-link]');
            link.href = '/download/whitepaper?t=' + encodeURIComponent(o.j.token);
            Array.prototype.forEach.call(f.children, function (c) { if (c !== ok) c.hidden = true; }); ok.hidden = false;
          } else if (f.id === 'contactForm') {
            f.hidden = true; document.getElementById('contactDone').hidden = false;
          } else { status.textContent = 'Thank you — we will be in touch shortly.'; }
        })
        .catch(function () { status.textContent = 'Something went wrong. Please try again, or email us directly.'; status.className = 'form-status bad'; })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });
})();
