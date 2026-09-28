/* Chat widget - talks to /api/chat, captures leads through a short guided dialogue */
(function () {
  'use strict';
  var root = document.getElementById('chat'); if (!root) return;
  var fab = document.getElementById('chatFab'), panel = document.getElementById('chatPanel'), log = document.getElementById('chatLog'),
    chips = document.getElementById('chatChips'), form = document.getElementById('chatForm'), input = document.getElementById('chatInput');
  var sid; try { sid = sessionStorage.getItem('on_sid'); } catch (e) {}
  if (!sid) { sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); try { sessionStorage.setItem('on_sid', sid); } catch (e) {} }
  var started = false, busy = false, state = { step: null, lead: {} };

  function add(text, who, link) {
    var d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = text;
    if (link) { var a = document.createElement('a'); a.className = 'lnk'; a.href = link[0]; a.textContent = link[1] + ' →'; d.appendChild(document.createElement('br')); d.appendChild(a); }
    log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function setChips(list) {
    chips.innerHTML = '';
    (list || []).slice(0, 6).forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.addEventListener('click', function () { send(c); }); chips.appendChild(b); });
  }
  function typing() { var d = document.createElement('div'); d.className = 'msg bot typing'; d.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function send(text) {
    text = (text || '').trim(); if (!text || busy) return;
    add(text, 'me'); setChips([]); input.value = ''; busy = true;
    var t = typing();
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, state: state, page: location.pathname }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.state) state = j.state; setTimeout(function () { t.remove(); add(j.reply || 'Sorry, something went wrong.', 'bot', j.link); setChips(j.chips); busy = false; }, 350); })
      .catch(function () { t.remove(); add('I could not reach the server. Please email info@opennetrikkan.com and we will respond.', 'bot'); busy = false; });
  }
  function open() {
    root.classList.add('open'); panel.hidden = false; fab.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; add('Hi, I’m the Open Netrikkan assistant. I can explain the platform, our nine modules, pricing and deployment — or set up a demo with our team.', 'bot'); setChips(['What is Open Netrikkan?', 'See the modules', 'How is it priced?', 'Book a demo']); }
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() { root.classList.remove('open'); panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); }
  fab.addEventListener('click', open);
  panel.querySelector('[data-chat-close]').addEventListener('click', close);
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  // open from any link with data-open-chat
  document.addEventListener('click', function (e) { if (e.target.closest('[data-open-chat]')) { e.preventDefault(); open(); } });
})();
