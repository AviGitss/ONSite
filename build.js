// Generates the static pages in /public from data/content.js
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./data/content.js');
const { site, modules, videos, caseStudies, industries, options, whitepaper } = C;
const PUB = path.join(__dirname, 'public');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (rel, html) => { const f = path.join(PUB, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };

// ---------- icons ----------
const ICONS = {
  clock: '<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 2M9.5 3h5M12 3v3"/>',
  bars: '<path d="M4 20V13M10 20V8M16 20V11M22 20V4" transform="translate(-2 0)"/><path d="M3 21h18"/>',
  machine: '<path d="M6 4h12v4H6zM8 8v6M16 8v6M5 14h14l-1.5 6h-11z"/>',
  pill: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l6 7" />',
  warehouse: '<path d="M3 10l9-6 9 6v10H3zM9 20v-6h6v6"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
  fridge: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 10h14M8 6v2M8 13v3M12 15.5v-4M10 13.5h4"/>',
  play: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext: '<path d="M7 17L17 7M8 7h9v9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
};
const icon = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ''}</svg>`;
const img = (n, alt, extra = '') => `<img src="/assets/img/${n}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;

// ---------- forms ----------
const opt = (arr) => arr.map(o => `<option>${esc(o)}</option>`).join('');
function leadForm({ id, source, submit, note = false, wp = false }) {
  return `<form class="lead-form" id="${id}" data-lead data-source="${source}" novalidate>
  <div class="fgrid">
    <label class="f"><span>Full name <i>*</i></span><input name="name" autocomplete="name" required><em class="err"></em></label>
    <label class="f"><span>Job title <i>*</i></span><input name="title" autocomplete="organization-title" required><em class="err"></em></label>
    <label class="f"><span>Designation level <i>*</i></span><select name="designation" required><option value="" selected disabled>Select…</option>${opt(options.designation)}</select><em class="err"></em></label>
    <label class="f"><span>Work email <i>*</i></span><input name="email" type="email" autocomplete="email" placeholder="name@yourcompany.com" required><em class="err"></em></label>
    <label class="f"><span>Phone number <i>*</i></span><input name="phone" type="tel" autocomplete="tel" placeholder="+91 …" required><em class="err"></em></label>
    <label class="f"><span>Area of interest <i>*</i></span><select name="interest" required><option value="" selected disabled>Select…</option>${opt(options.interest)}</select><em class="err"></em></label>
    <label class="f"><span>Company size (employees) <i>*</i></span><select name="size" required><option value="" selected disabled>Select…</option>${opt(options.size)}</select><em class="err"></em></label>
    <label class="f"><span>Sector of the company <i>*</i></span><select name="sector" required><option value="" selected disabled>Select…</option>${opt(options.sector)}</select><em class="err"></em></label>
    ${note ? `<label class="f full"><span>Tell us about your planning challenge <small>(optional)</small></span><textarea name="note" rows="3"></textarea></label>` : ''}
  </div>
  <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label class="check"><input type="checkbox" name="consent" required><span>I agree to Open Netrikkan storing these details and contacting me about this request. Corporate email addresses only.</span></label><em class="err consent-err"></em>
  <button class="btn btn-primary btn-block" type="submit">${submit} ${icon('arrow')}</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  ${wp ? `<div class="wp-success" hidden><div class="ok">${icon('check')}</div><h4>Thank you — your download is ready</h4><p>Your personal link is valid for 24 hours.</p><a class="btn btn-gold" data-wp-link href="#">${icon('doc')} Download the whitepaper (PDF)</a></div>` : ''}
</form>`;
}

// ---------- layout ----------
const NAV_MODULES = modules.map(m => `<a href="/modules/${m.slug}/"><span class="mi">${icon(m.icon)}</span><span><b>${m.name}</b><small>${m.sector}</small></span></a>`).join('');

function layout({ title, desc, body, path: p = '/', cls = '', hero = false }) {
  const t = title === site.name ? `${site.name} — Simulation platform for manufacturing & logistics` : `${title} — ${site.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#2D1B69">
<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
</head>
<body class="${cls}" data-path="${p}">
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span>${site.tag.replace('A ', '')} · ${site.city}</span><nav aria-label="Utility"><a href="/whitepaper/">Whitepaper</a><a href="/videos/">Videos</a><a href="/contact/">Contact</a><a href="mailto:${site.email}">${site.email}</a></nav></div></div>
<header class="site-header ${hero ? 'on-hero' : ''}" id="hdr">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="Open Netrikkan — home"><img src="/assets/img/logo.png" alt="Open Netrikkan — A UTS Company" width="210" height="88"></a>
    <button class="burger" aria-label="Menu" aria-expanded="false" data-burger>${icon('menu')}</button>
    <nav class="menu" id="menu" aria-label="Primary">
      <a href="/platform/" class="m">Platform</a>
      <div class="m has-drop mega-wrap"><button class="dropbtn" aria-expanded="false">Modules ${icon('chevron')}</button>
        <div class="mega"><div class="mega-in">
          <div class="mega-side"><p class="kick">Nine decision engines</p><p>One method — simulate before you commit — applied to nine recurring planning questions.</p><a class="btn btn-ghost-dark" href="/modules/">All modules ${icon('arrow')}</a></div>
          <div class="mega-grid">${NAV_MODULES}</div>
        </div></div></div>
      <a href="/#industries" class="m">Industries</a>
      <a href="/integrations/" class="m">Integrations</a>
      <div class="m has-drop"><button class="dropbtn" aria-expanded="false">Resources ${icon('chevron')}</button>
        <div class="drop"><a href="/whitepaper/"><b>Whitepaper</b><small>Simulation as the OS for contract manufacturing</small></a><a href="/videos/"><b>Product videos</b><small>Walkthroughs of our modules</small></a><a href="/case-studies/"><b>Case studies</b><small>Outcomes from digital-twin programmes and our modules</small></a></div></div>
      <a href="/case-studies/" class="m">Case studies</a>
      <a href="/about/" class="m">Company</a>
      <a class="btn btn-primary nav-cta" href="/contact/">Book a demo</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap fgrid4">
    <div class="fcol brandcol"><a class="fbrand" href="/"><img src="/assets/img/logo.png" alt="Open Netrikkan — A UTS Company" width="190" height="80"></a>
      <p>An AI-native discrete event simulation platform for manufacturing and logistics. Simulate the decision before it costs you the quarter.</p>
      <p class="fcontact">${site.email}<br>${site.city}</p><p class="fcontact">Part of <a href="${site.uts.url}" target="_blank" rel="noopener">${site.uts.name}</a></p></div>
    <div class="fcol"><h5>Modules</h5>${modules.slice(0, 5).map(m => `<a href="/modules/${m.slug}/">${m.name}</a>`).join('')}</div>
    <div class="fcol"><h5>&nbsp;</h5>${modules.slice(5).map(m => `<a href="/modules/${m.slug}/">${m.name}</a>`).join('')}<a href="/modules/">All modules</a></div>
    <div class="fcol"><h5>Explore</h5><a href="/platform/">Platform</a><a href="/whitepaper/">Whitepaper</a><a href="/integrations/">Integrations</a><a href="/videos/">Videos</a><a href="/case-studies/">Case studies</a><a href="/about/">Company</a><a href="/contact/">Contact</a></div>
  </div>
  <div class="wrap fbase"><span>© ${new Date().getFullYear()} Open Netrikkan · A UTS Company. All rights reserved.</span><span>Demonstration figures are on synthetic data; real results depend on each customer’s operating data.</span></div>
</footer>

<div class="modal" id="videoModal" role="dialog" aria-modal="true" aria-label="Video player" hidden>
  <div class="modal-in vid"><button class="modal-x" data-close aria-label="Close">${icon('close')}</button>
    <div class="vwrap"><video id="vplayer" controls controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback playsinline preload="none"></video><div class="vmark" aria-hidden="true">opennetrikkan</div></div>
    <div class="vmeta"><h3 id="vtitle"></h3><p id="vblurb"></p></div></div>
</div>
<div class="modal" id="wpModal" role="dialog" aria-modal="true" aria-label="Download the whitepaper" hidden>
  <div class="modal-in wpm"><button class="modal-x" data-close aria-label="Close">${icon('close')}</button>
    <p class="kick">Whitepaper · ${whitepaper.date}</p><h3>${whitepaper.title}</h3><p class="muted">Tell us a little about you to get your personal PDF download link. A corporate email is required.</p>
    ${leadForm({ id: 'wpFormModal', source: 'whitepaper', submit: 'Get the PDF', wp: true })}
  </div>
</div>
<div class="lightbox" id="lightbox" hidden><button class="modal-x" data-close aria-label="Close">${icon('close')}</button><img alt=""><p></p></div>

<div class="chat" id="chat">
  <button class="chat-fab" id="chatFab" aria-label="Chat with us" aria-expanded="false">${icon('chat', 'ci')}<span class="fab-label">Ask us anything</span><i class="dot"></i></button>
  <section class="chat-panel" id="chatPanel" aria-label="Chat" hidden>
    <header><div class="av">ON</div><div><b>Open Netrikkan assistant</b><small>Ask about the platform, modules or pricing</small></div><button data-chat-close aria-label="Close chat">${icon('close')}</button></header>
    <div class="chat-log" id="chatLog" aria-live="polite"></div>
    <div class="chat-chips" id="chatChips"></div>
    <form class="chat-in" id="chatForm" autocomplete="off"><input id="chatInput" placeholder="Type your question…" maxlength="300" aria-label="Your message"><button aria-label="Send">${icon('arrow')}</button></form>
  </section>
</div>
<script src="/js/site.js" defer></script>
<script src="/js/forms.js" defer></script>
<script src="/js/chat.js" defer></script>
${cls.includes('page-modules') ? '' : ''}
</body>
</html>`;
}

// ---------- shared blocks ----------
const pageHero = (kick, h1, sub, extra = '') => `<section class="page-hero"><div class="wrap"><p class="kick">${kick}</p><h1>${h1}</h1><p class="lede">${sub}</p>${extra}</div><div class="ph-grid" aria-hidden="true"></div></section>`;
const ctaBand = (h = 'See it against your own numbers', p = 'A 30-minute working session: you nominate the planning decision that hurts most, and we run the closest tool against a representative case from your operation.') => `<section class="cta-band"><div class="wrap"><div><h2>${h}</h2><p>${p}</p></div><div class="cta-btns"><a class="btn btn-gold" href="/contact/">Book a demo ${icon('arrow')}</a><a class="btn btn-ghost" href="/whitepaper/">Read the whitepaper</a></div></div></section>`;

function illus(m) {
  // Abstract model illustration for modules without screenshots
  return `<div class="illus"><svg viewBox="0 0 640 360" aria-hidden="true">
  <defs><linearGradient id="g${m.n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A2FA0"/><stop offset="1" stop-color="#2D1B69"/></linearGradient></defs>
  <rect width="640" height="360" fill="url(#g${m.n})"/>
  <g stroke="#A98CE8" stroke-opacity=".5" fill="none" stroke-width="2"><path d="M70 180H200M200 180C260 180 250 90 320 90M200 180H320M200 180C260 180 250 270 320 270M320 90H460M320 180H460M320 270H460M460 90C520 90 500 180 560 180M460 180H560M460 270C520 270 500 180 560 180" stroke-dasharray="4 6"/></g>
  <g fill="#7B5FC4" stroke="#C8B5F5" stroke-width="1.5"><rect x="30" y="152" width="80" height="56" rx="12"/><rect x="280" y="62" width="80" height="56" rx="12"/><rect x="280" y="152" width="80" height="56" rx="12"/><rect x="280" y="242" width="80" height="56" rx="12"/><rect x="420" y="62" width="80" height="56" rx="12" fill="#4A2FA0"/><rect x="420" y="152" width="80" height="56" rx="12" fill="#4A2FA0"/><rect x="420" y="242" width="80" height="56" rx="12" fill="#F0C040" fill-opacity=".9" stroke="#F0C040"/><circle cx="580" cy="180" r="34" fill="#A98CE8" stroke="#fff" stroke-opacity=".6"/></g>
  <g fill="#fff" font-family="DM Sans, sans-serif" font-size="13" text-anchor="middle" font-weight="600"><text x="70" y="185">Inputs</text><text x="320" y="95">Scenario A</text><text x="320" y="185">Scenario B</text><text x="320" y="275">Scenario C</text><text x="460" y="95">KPI</text><text x="460" y="185">KPI</text><text x="460" y="275" fill="#2D1B69">Best</text><text x="580" y="185" fill="#2D1B69">Plan</text></g>
  <text x="320" y="338" fill="#C8B5F5" font-family="DM Sans, sans-serif" font-size="12" text-anchor="middle" letter-spacing="2">${esc(m.name.toUpperCase())} · ILLUSTRATIVE MODEL</text>
  </svg></div>`;
}

const moduleCard = (m) => `<a class="mcard" href="/modules/${m.slug}/">
  <div class="mthumb">${m.images[0] ? img(m.images[0], `${m.name} screenshot`) : illus(m)}<span class="mnum">${m.n}</span></div>
  <div class="mbody"><div class="mtop"><span class="mic">${icon(m.icon)}</span><span class="msector">${m.sector}</span></div><h3>${m.name}</h3><p>${m.short}</p><span class="mstat">${m.status}</span><span class="mlink">Explore ${icon('arrow')}</span></div></a>`;

const videoCard = (v) => `<article class="vcard"><button class="vthumb" data-video="${v.id}" data-title="${esc(v.title)}" data-blurb="${esc(v.blurb)}" aria-label="Play ${esc(v.title)}">${img(v.poster, v.title)}<span class="play">${icon('play')}</span><span class="dur">${v.dur}</span></button>
  <div class="vbody"><a class="vtag" href="/modules/${v.module}/">${modules.find(m => m.slug === v.module).name}</a><h3>${v.title}</h3><p>${v.blurb}</p></div></article>`;

const caseCard = (c) => `<article class="ccard" id="${c.id}"><div class="cimg">${img(c.img, c.title)}<span class="ctag">${c.tag}</span></div>
  <div class="cbody"><h3>${c.title}</h3><p class="cobj"><b>Objective.</b> ${c.objective}</p><p class="cout-h">Outcomes achieved</p><ul class="cout">${c.outcomes.map(o => `<li>${icon('check')}<span>${o}</span></li>`).join('')}</ul></div></article>`;

// ---------- pages ----------
function home() {
  const feat = videos[0];
  const body = `
<section class="hero"><canvas id="heroCanvas" aria-hidden="true"></canvas><div class="hero-fade"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="kick gold">AI-native discrete event simulation</p>
      <h1>Simulate the decision <em>before</em> it costs you the quarter.</h1>
      <p class="lede">Open Netrikkan turns changeovers, schedules and quotes into evidence. Model your plant, run thousands of scenarios against your real constraints, and get a ranked recommendation with the reasoning visible.</p>
      <div class="hero-btns"><a class="btn btn-gold" href="/contact/">Book a demo ${icon('arrow')}</a><button class="btn btn-ghost" data-video="${feat.id}" data-title="${esc(feat.title)}" data-blurb="${esc(feat.blurb)}">${icon('play')} Watch a walkthrough</button></div>
      <ul class="hero-points"><li>${icon('check')} Nine decision engines</li><li>${icon('check')} Sits beside ERP, MES &amp; WMS</li><li>${icon('check')} Integrates via APIs, OPC UA &amp; MQTT</li></ul>
    </div>
    <div class="hero-kpi" aria-hidden="true"><div class="kpi-card"><span>Illustrative model</span><b id="kpiThru">0</b><small>jobs completed</small><div class="kpi-row"><div><i id="kpiUtil">0%</i><small>utilisation</small></div><div><i id="kpiQ">0</i><small>in queue</small></div></div></div></div>
  </div>
  <div class="wrap"><div class="eco"><span>Built in Bengaluru</span>${C.ecosystem.map(e => `<b>${e}</b>`).join('')}</div></div>
</section>

<section class="sec"><div class="wrap">
  <div class="sec-h center"><p class="kick">The decision layer</p><h2>Contract manufacturers are paid for <em>decisions made correctly</em></h2><p>Which job runs next, which machine takes it, how much stock stands behind it — thousands of times a week. Most are still made on spreadsheets and experience. Simulation lets a plant test a decision before it commits to it.</p></div>
  <div class="trio">
    <div class="tcard"><span class="ti">${icon('layers')}</span><h3>Scenarios, not forecasts</h3><p>What if a customer adds 20% volume, a machine is down for two shifts, or a mould is delayed? Each becomes a scenario, compared side by side.</p></div>
    <div class="tcard"><span class="ti">${icon('target')}</span><h3>Recommendations with reasons</h3><p>An AI decision layer ranks the fix and explains why — every scenario is a reproducible run that can be defended to a customer or an auditor.</p></div>
    <div class="tcard"><span class="ti">${icon('shield')}</span><h3>Additive and private</h3><p>Reads from ERP, MES and WMS; never replaces them. Language models run locally, so operational data need not leave your environment.</p></div>
  </div></div></section>

<section class="sec dark" id="how"><div class="wrap">
  <div class="sec-h"><p class="kick gold">How it works</p><h2>From event model to recommendation</h2><p>A four-agent decision chain runs locally against your plant’s own data, in a closed loop that keeps refining the recommendation until improvement flattens.</p></div>
  <div class="chain">
    ${[['Interpreter', 'Reads plant data and constraints from the spreadsheets, PDFs and drawings you already hold.', 'db'], ['Diagnostician', 'Finds where time is being lost — queues, changeovers, idle hours, late material.', 'gear'], ['Simulator', 'Runs hundreds or thousands of scenarios and shows the range of outcomes, not one average.', 'layers'], ['Recommender', 'Ranks the fix, explains why, and hands the plan to the planner.', 'target']].map((a, i) => `<div class="link"><span class="n">0${i + 1}</span><span class="ai">${icon(a[2])}</span><h3>${a[0]}</h3><p>${a[1]}</p></div>${i < 3 ? '<i class="arr">→</i>' : ''}`).join('')}
  </div>
  <p class="loopnote">↻ Closed loop — repeats until improvement flattens</p>
</div></section>

<section class="sec" id="modules"><div class="wrap">
  <div class="sec-h split"><div><p class="kick">Modules</p><h2>Nine decision engines. One question each.</h2></div><p>Start with the decision that costs the most today. Each module runs on the same simulation core and can be adopted on its own.</p></div>
  <div class="mgrid">${modules.map(moduleCard).join('')}</div>
</div></section>

<section class="sec tint" id="videos"><div class="wrap">
  <div class="sec-h split"><div><p class="kick">See it running</p><h2>Product walkthroughs</h2></div><p>Watch the modules in action — from an order spreadsheet to a verified plan.</p></div>
  <div class="vgrid">${videos.map(videoCard).join('')}</div>
  <p class="center-btn"><a class="btn btn-outline" href="/videos/">Open the video library ${icon('arrow')}</a></p>
</div></section>

<section class="stats"><div class="wrap statgrid">
  <div><b data-count="9">9</b><span>decision engines</span></div>
  <div><b data-count="9">9</b><span>integration categories supported</span></div>
  <div><b data-count="2000" data-suffix="">2,000</b><span>Monte Carlo trials in OilSim</span></div>
  <div><b data-count="6">6</b><span>simulation modules in FabSim</span></div>
</div></section>

<section class="sec" id="industries"><div class="wrap">
  <div class="sec-h center"><p class="kick">Industries</p><h2>One method across sectors</h2><p>Changeover hours, quote accuracy, utilisation, batch lead time, dock cost, yield, stock-out risk, delivery cost — nine cost lines, one method.</p></div>
  <div class="igrid">${industries.map(i => `<a class="icard" href="/modules/${i[2]}/"><h3>${i[0]}</h3><p>${i[1]}</p><span>${icon('arrow')}</span></a>`).join('')}</div>
</div></section>

<section class="sec tint" id="cases"><div class="wrap">
  <div class="sec-h split"><div><p class="kick">Case studies</p><h2>Outcomes from our programmes</h2></div><p>Anonymised outcomes from digital-twin programmes and our own modules in action.</p></div>
  <div class="cgrid3">${caseStudies.filter(c => ['virtual-commissioning', 'scanning-robot', 'pharma-line'].includes(c.id)).map(c => `<a class="cmini" href="/case-studies/#${c.id}"><div class="cimg">${img(c.img, c.title)}<span class="ctag">${c.tag}</span></div><h3>${c.title}</h3><p>${c.objective}</p><span class="mlink">Read the outcomes ${icon('arrow')}</span></a>`).join('')}</div>
  <p class="center-btn"><a class="btn btn-outline" href="/case-studies/">All case studies ${icon('arrow')}</a></p>
</div></section>

<section class="sec" id="integrations"><div class="wrap">
  <div class="sec-h split"><div><p class="kick">Integrations</p><h2>Works with the systems you already run</h2></div><p>ERP, MES, WMS, digital twin, historians and shop-floor protocols — and open APIs for anything else.</p></div>
  <div class="intg-tags">${['SAP','Oracle','Dynamics 365','Siemens Opcenter','DELMIA Apriso','Plex','AVEVA PI','OPC UA','MQTT','NVIDIA Omniverse','REST APIs','Webhooks'].map(t => `<span>${t}</span>`).join('')}</div>
  <p class="center-btn"><a class="btn btn-outline" href="/integrations/">See supported integrations ${icon('arrow')}</a></p>
</div></section>

<section class="sec"><div class="wrap wpbanner">
  <div class="wp-cover-mini"><div class="cv"><small>Whitepaper · ${whitepaper.date}</small><b>${whitepaper.title}</b><i></i></div></div>
  <div><p class="kick">Whitepaper</p><h2>Simulation as the Operating System for Contract Manufacturing</h2><p>${whitepaper.dek}</p><div class="hero-btns"><a class="btn btn-primary" href="/whitepaper/">Read online ${icon('arrow')}</a><button class="btn btn-outline" data-wp-download>${icon('doc')} Download the PDF</button></div></div>
</div></section>

${ctaBand()}`;
  return layout({ title: site.name, desc: 'Open Netrikkan is an AI-native discrete event simulation platform for manufacturing and logistics: nine decision engines that turn changeovers, schedules and quotes into evidence.', body, hero: true, cls: 'page-home' });
}

function platform() {
  const body = `${pageHero('Platform', 'A simulation core with an AI decision layer', 'The Open Netrikkan platform adds a four-agent AI layer on top of a conventional discrete event simulation engine — so planners get a ranked recommendation, not a chart.')}
<section class="sec"><div class="wrap two">
  <div><h2>Discrete event simulation, made usable</h2><p>DES models a plant as things that happen at moments in time: an order arrives, a machine starts a job, a changeover finishes, a truck docks. The model advances event by event, tracking queues, utilisation and delay — and because it draws random variation from real data, it shows the <b>range of outcomes</b> a plan may produce, not a single average.</p><p>A machine that averages 85% utilisation on paper still queues jobs when arrivals bunch up. Spreadsheets and static capacity calculators cannot see that. Simulation can.</p></div>
  <div class="agent-stack">${['Interpreter · reads plant data & constraints', 'Diagnostician · finds where time is being lost', 'Simulator · runs scenarios at scale', 'Recommender · ranks the fix, explains why'].map((t, i) => `<div><i>0${i + 1}</i>${t}</div>`).join('')}<p>↻ closed loop until improvement flattens</p></div>
</div></section>
<section class="sec tint"><div class="wrap">
  <div class="sec-h center"><p class="kick">Capabilities</p><h2>Built for real planning decisions</h2></div>
  <div class="trio four">
    ${[['db', 'Fast to configure', 'Data arrives as the spreadsheets, PDFs and drawings a plant already holds; document extraction converts them into simulation inputs. A first model does not wait on an integration project.'], ['layers', 'Scenario comparison', 'Save, compare and re-run scenarios side by side. Every run is reproducible and explainable.'], ['shield', 'Data stays put', 'Language models run locally, so operational data need not leave the customer’s environment.'], ['gear', 'Additive to your stack', 'Designed to sit beside SAP, Siemens Opcenter and equivalent MES/WMS systems — never to replace them.'], ['chat', 'Ask about the schedule', 'Plain-language questions answered from the schedule’s own numbers, so figures always match the charts.'], ['doc', 'Reports and exports', 'Excel, JSON, PowerPoint and PDF exports for offline review or ERP hand-off.'], ['lock', 'Roles and access', 'Plant head, planner, viewer, sales and RFP-prep roles — each with exactly the access they need.'], ['target', 'Gain-share pricing', 'Pay for results: audited baseline, agreed utilisation definition, joint measurement committee and a monthly floor fee.']].map(c => `<div class="tcard"><span class="ti">${icon(c[0])}</span><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join('')}
  </div></div></section>
<section class="sec"><div class="wrap">
  <div class="sec-h center"><p class="kick">Deployment</p><h2>Start with the decision that costs the most today</h2><p>Durations are indicative and depend on data readiness.</p></div>
  <div class="wp-steps big"><div><i>01</i><b>Baseline</b><em>1–2 weeks</em><span>Collect existing schedules, order history and machine data; agree the audited baseline and the metric that defines success.</span></div><div><i>02</i><b>Model</b><em>2–4 weeks</em><span>Build and validate the simulation against last quarter’s actual performance.</span></div><div><i>03</i><b>Pilot</b><em>4–8 weeks</em><span>Planners run scenarios alongside their normal process and compare outcomes.</span></div><div><i>04</i><b>Scale</b><em>Ongoing</em><span>Move to daily use; extend to a second line, plant or tool.</span></div></div>
</div></section>
<section class="sec tint"><div class="wrap"><div class="sec-h split"><div><p class="kick">Modules</p><h2>Nine engines on one core</h2></div><a class="btn btn-outline" href="/modules/">All modules ${icon('arrow')}</a></div><div class="mgrid">${modules.slice(0, 3).map(moduleCard).join('')}</div></div></section>
${ctaBand()}`;
  return layout({ title: 'Platform', desc: 'How the Open Netrikkan platform works: a discrete event simulation core with a four-agent AI decision layer.', body, path: '/platform/' });
}

function modulesIndex() {
  const body = `${pageHero('Modules', 'Nine decision engines, one method', 'Each module answers one recurring question a planner faces every week. Together they span the full loop: designing a new line, scheduling machines, controlling changeovers, running the process and moving finished goods out the door.')}
<section class="sec"><div class="wrap"><div class="mgrid">${modules.map(moduleCard).join('')}</div></div></section>${ctaBand()}`;
  return layout({ title: 'Modules', desc: 'The nine Open Netrikkan simulation modules: Changeover Optimizer, Newline, Machine Bank Scheduler, Tablet, Warehouse, Outbound, FabSim, OilSim and Replenish.', body, path: '/modules/' });
}

function modulePage(m, i) {
  const prev = modules[(i + modules.length - 1) % modules.length], next = modules[(i + 1) % modules.length];
  const v = m.video ? videos.find(x => x.id === m.video) : null;
  const shots = m.images.map((n, k) => `<button class="shot" data-lightbox="/assets/img/${n}.jpg" data-cap="${esc(m.name)} — screenshot ${k + 1}">${img(n, `${m.name} screenshot ${k + 1}`)}<span>Enlarge</span></button>`).join('');
  const body = `
<section class="page-hero mod-hero"><div class="wrap two">
  <div><p class="crumb"><a href="/modules/">Modules</a> / ${m.n}</p><p class="kick">${m.sector}</p><h1>${m.name}</h1><p class="q">“${m.question}”</p>
    <div class="hero-btns"><a class="btn btn-gold" href="/contact/">Book a walkthrough ${icon('arrow')}</a>${v ? `<button class="btn btn-ghost" data-video="${v.id}" data-title="${esc(v.title)}" data-blurb="${esc(v.blurb)}">${icon('play')} Watch the video</button>` : `<a class="btn btn-ghost" href="/integrations/">Integrations</a>`}</div>
    <p class="mstatus">${icon('check')} ${m.status}</p></div>
  <div class="mod-visual">${m.images[0] ? `<button class="shot big" data-lightbox="/assets/img/${m.images[0]}.jpg" data-cap="${esc(m.name)}">${img(m.images[0], m.name + ' screenshot', 'loading="eager"')}</button>` : illus(m)}</div>
</div><div class="ph-grid" aria-hidden="true"></div></section>
<section class="sec"><div class="wrap two wide">
  <div><h2>What it does</h2><p class="big">${m.body}</p></div>
  <aside class="result"><p class="kick">Result</p><p>${m.result}</p></aside>
</div></section>
<section class="sec tint"><div class="wrap"><div class="sec-h"><p class="kick">Capabilities</p><h2>Inside ${m.name}</h2></div>
  <div class="feat">${m.features.map(f => `<div class="fitem"><span>${icon('check')}</span><div><h3>${f[0]}</h3><p>${f[1]}</p></div></div>`).join('')}</div></div></section>
${m.images.length ? `<section class="sec"><div class="wrap"><div class="sec-h"><p class="kick">Screenshots</p><h2>${m.name} in use</h2></div><div class="shots n${m.images.length}">${shots}</div></div></section>` : ''}
${v ? `<section class="sec ${m.images.length ? 'tint' : ''}"><div class="wrap"><div class="sec-h"><p class="kick">Video</p><h2>Watch the walkthrough</h2></div><div class="vgrid one">${videoCard(v)}</div></div></section>` : ''}
<section class="sec ${v || m.images.length ? '' : 'tint'}"><div class="wrap modnav"><a href="/modules/${prev.slug}/"><small>← Previous</small><b>${prev.name}</b></a><a href="/modules/" class="all">All modules</a><a href="/modules/${next.slug}/" class="r"><small>Next →</small><b>${next.name}</b></a></div></section>
${ctaBand(`Try ${m.name} on your own data`, 'Nominate the decision that hurts most and we will run this module against a representative case from your operation.')}`;
  return layout({ title: m.name, desc: `${m.name} — ${m.short} ${m.sector} module of the Open Netrikkan simulation platform.`, body, path: `/modules/${m.slug}/` });
}

function videosPage() {
  const body = `${pageHero('Videos', 'Product walkthroughs', 'Watch the Open Netrikkan modules running — from an order spreadsheet to a verified plan. Videos are streamed for viewing only.')}
<section class="sec"><div class="wrap"><div class="vgrid">${videos.map(videoCard).join('')}</div>
<div class="note-box">${icon('lock')}<p><b>Streaming only.</b> Our videos are provided for viewing on this site and are not available for download. Want to see a module on your own data? <a href="/contact/">Book a demo</a>.</p></div></div></section>${ctaBand()}`;
  return layout({ title: 'Videos', desc: 'Watch product walkthroughs of Open Netrikkan modules: Changeover Optimizer, Newline, Tablet and the Customer Commitment Analyser.', body, path: '/videos/' });
}

function casesPage() {
  const groups = [...new Set(caseStudies.map(c => c.group))];
  const body = `${pageHero('Case studies', 'Case studies and modules in action', 'Digital-twin and virtual-commissioning programmes from our team’s earlier work, and our modules in action. Client and employer names are withheld.')}
${groups.map((g, gi) => `<section class="sec ${gi % 2 ? 'tint' : ''}"><div class="wrap"><div class="sec-h"><p class="kick">${g}</p><h2>${gi === 0 ? 'Experience from large-scale digital-twin programmes' : 'Open Netrikkan modules, illustrated on demonstration data'}</h2></div><div class="cgrid">${caseStudies.filter(c => c.group === g).map(caseCard).join('')}</div></div></section>`).join('')}
<section class="sec"><div class="wrap"><div class="sec-h center"><p class="kick">Trusted and recognised</p><h2>Backed by a growing ecosystem</h2></div>
<div class="logos">${C.ecosystem.map(e => `<div class="logo">${e}</div>`).join('')}${C.customerLogos.map(l => `<div class="logo img"><img src="/assets/logos/${l.file}" alt="${esc(l.alt)}"></div>`).join('')}</div></div></section>${ctaBand('Have a similar challenge?')}`;
  return layout({ title: 'Case studies', desc: 'Anonymised case studies: aircraft-fuselage virtual commissioning, digital-twin quality, and Open Netrikkan modules in action.', body, path: '/case-studies/' });
}

function whitepaperPage() {
  const toc = whitepaper.sections.map(s => `<a href="#${s.id}" data-toc="${s.id}">${s.title}</a>`).join('');
  const secs = whitepaper.sections.map((s, i) => `<section class="wp-sec ${['big-idea', 'why-now'].includes(s.id) ? 'wp-dark' : ''}" id="${s.id}"><p class="wp-num">${String(i + 1).padStart(2, '0')} — ${s.title}</p>${s.html}</section>`).join('');
  const body = `<div class="progress" id="progress"></div>
<section class="wp-hero"><div class="wrap two">
  <div><p class="kick gold">Whitepaper · ${whitepaper.date} · ${whitepaper.pages} pages</p><h1>${whitepaper.title}</h1><p class="lede">${whitepaper.dek}</p>
    <div class="hero-btns"><button class="btn btn-gold" data-wp-download>${icon('doc')} Download the PDF</button><a class="btn btn-ghost" href="#big-idea">Read online ${icon('arrow')}</a></div>
    <p class="wp-hint">${icon('lock')} Free with your corporate email — read the full paper below without signing up.</p></div>
  <div class="wp-cover"><div class="cover"><small>Whitepaper · ${whitepaper.date}</small><h2>Simulation as the Operating System for Contract Manufacturing</h2><p>Nine decision engines from Open Netrikkan</p><span>opennetrikkan.com</span></div></div>
</div></section>
<div class="wrap wp-layout">
  <aside class="wp-toc"><p class="kick">In this paper</p>${toc}<button class="btn btn-primary btn-block" data-wp-download>${icon('doc')} Download PDF</button></aside>
  <article class="wp-body">${secs}
    <section class="wp-sec wp-gate" id="download"><p class="wp-num">Get the PDF</p><h3>Download the full whitepaper</h3><p>Complete the short form with your corporate email and we will give you a personal download link for the PDF edition. All fields are required.</p>
      ${leadForm({ id: 'wpFormInline', source: 'whitepaper', submit: 'Get the PDF', wp: true })}</section>
  </article>
</div>
${ctaBand('Nominate the one decision that hurts most')}`;
  return layout({ title: whitepaper.title, desc: whitepaper.dek, body, path: '/whitepaper/', cls: 'page-wp' });
}

function aboutPage() {
  const body = `${pageHero('Company', 'Decisions made correctly, thousands of times a week', 'Open Netrikkan is an AI-native discrete event simulation platform for manufacturing and logistics, built in Bengaluru and now part of UTS.')}
<section class="sec"><div class="wrap two wide">
  <div><h2>Why we exist</h2><p class="big">Contract manufacturers are not paid for equipment. They are paid for decisions made correctly — which job runs next, which machine takes it, how much stock stands behind it. Most of those decisions are still made on spreadsheets and experience.</p><p>We build simulation-based decision engines that let a plant test a decision before it commits to it: model the operation as a sequence of events, feed it the real constraints, run hundreds or thousands of scenarios, and hand the planner a ranked recommendation with the reasoning visible.</p></div>
  <aside class="result"><p class="kick">At a glance</p><ul class="glance"><li><b>Acquired by UTS</b> — Univision Technology Solutions</li><li><b>NASSCOM DeepTech</b> member</li><li><b>Patent-pending IP</b> across the platform</li><li><b>Bengaluru, India</b></li></ul></aside>
</div></section>
<section class="sec tint" id="uts"><div class="wrap two wide">
  <div><p class="kick">Part of UTS</p><h2>Open Netrikkan has been acquired by UTS</h2><p class="big">${site.uts.name} is a global engineering and product company — <em>${site.uts.tagline}</em>. Its work spans semiconductor design, embedded and RF products, radar systems and AI-driven digital twin and decarbonisation platforms, with accountability across the whole lifecycle of what it builds.</p><p>Open Netrikkan brings discrete event simulation and AI decision engines for manufacturing and logistics into that portfolio, alongside UTS’s engineering depth in silicon, systems and sustainability.</p><p><a class="btn btn-primary" href="${site.uts.url}" target="_blank" rel="noopener">Visit uts3s.com ${icon('ext')}</a></p></div>
  <aside class="result"><p class="kick">UTS at a glance</p><ul class="glance"><li><b>Silicon, Systems, Sustainability</b></li><li>Semiconductor design</li><li>Embedded and RF products</li><li>Radar systems</li><li>AI-driven digital twin and decarbonisation platforms</li></ul></aside>
</div></section>
${ctaBand()}`;
  return layout({ title: 'Company', desc: 'About Open Netrikkan, an AI-native discrete event simulation platform for manufacturing and logistics.', body, path: '/about/' });
}

function contactPage() {
  const body = `${pageHero('Contact', 'Book a demo', 'A practical next step is a 30-minute working session: you nominate the one planning decision that hurts most, and we run the closest tool against a representative case from your operation.')}
<section class="sec"><div class="wrap two contact">
  <div class="cform"><h2>Tell us about you</h2>${leadForm({ id: 'contactForm', source: 'demo', submit: 'Request a demo', note: true })}<div class="done" id="contactDone" hidden><div class="ok">${icon('check')}</div><h3>Thank you — we will be in touch shortly</h3><p>In the meantime, you can read the <a href="/whitepaper/">whitepaper</a> or watch a <a href="/videos/">product video</a>.</p></div></div>
  <aside class="result"><p class="kick">Talk to us directly</p><p><a href="mailto:${site.email}">${site.email}</a><br>${site.city}</p><hr><p class="kick">What happens next</p><ol class="next"><li>We review your request within one working day.</li><li>We agree the one decision that hurts most.</li><li>We run the closest module against a representative case.</li></ol></aside>
</div></section>`;
  return layout({ title: 'Contact', desc: 'Book an Open Netrikkan demo: a 30-minute working session on the planning decision that hurts most.', body, path: '/contact/' });
}

function integrationsPage() {
  const I = C.integrations;
  const body = `${pageHero('Integrations', 'Fits the stack you already have', I.intro)}
<section class="sec"><div class="wrap">
  <div class="sec-h center"><p class="kick">Supported integrations</p><h2>ERP, MES, digital twin, historians and protocols</h2></div>
  <div class="intg-grid">${I.groups.map(g => `<article class="intg"><span class="ti">${icon(g.icon)}</span><h3>${g.title}</h3><ul>${g.items.map(x => `<li>${x}</li>`).join('')}</ul></article>`).join('')}</div>
  <p class="wp-note center-note">${I.note}</p>
</div></section>
<section class="sec tint"><div class="wrap two wide">
  <div><p class="kick">Open APIs</p><h2>${I.api.title}</h2><p class="big">${I.api.body}</p><p><a class="btn btn-primary" href="/contact/">Talk to us about an integration ${icon('arrow')}</a></p></div>
  <aside class="result"><p class="kick">What we expose</p><ul class="glance">${I.api.points.map(x => `<li>${x}</li>`).join('')}</ul></aside>
</div></section>${ctaBand('Tell us what you need to connect')}`;
  return layout({ title: 'Integrations', desc: 'Open Netrikkan integrates with ERP, MES, WMS, digital-twin platforms, historians and shop-floor protocols, and exposes open APIs for your own integrations.', body, path: '/integrations/' });
}

function notFound() {
  return layout({ title: 'Page not found', desc: 'Page not found', body: `${pageHero('404', 'That page is not on the floor plan', 'Try the module list or head back home.', `<p><a class="btn btn-gold" href="/">Go home</a></p>`)}`, path: '/404' });
}

// ---------- favicon ----------
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2D1B69"/><circle cx="32" cy="32" r="18" fill="none" stroke="#A98CE8" stroke-width="4"/><path d="M18 40c8-14 20-18 30-10" fill="none" stroke="#F0C040" stroke-width="4" stroke-linecap="round"/></svg>`;

// ---------- run ----------
fs.mkdirSync(path.join(PUB, 'assets/img'), { recursive: true });
write('assets/img/favicon.svg', favicon);
write('index.html', home());
write('platform/index.html', platform());
write('modules/index.html', modulesIndex());
modules.forEach((m, i) => write(`modules/${m.slug}/index.html`, modulePage(m, i)));
write('videos/index.html', videosPage());
write('case-studies/index.html', casesPage());
write('whitepaper/index.html', whitepaperPage());
write('integrations/index.html', integrationsPage());
write('about/index.html', aboutPage());
write('contact/index.html', contactPage());
write('404.html', notFound());

// Edge-function content (chatbot knowledge base, form options, video ids) generated from the same source of truth
const edge = { site: { email: site.email }, faq: C.faq, bookIntent: C.bookIntent, options, videoIds: videos.map(v => v.id) };
const edgeDir = path.join(__dirname, 'supabase/functions/site-api');
fs.mkdirSync(edgeDir, { recursive: true });
fs.writeFileSync(path.join(edgeDir, 'content.mjs'), '// GENERATED by build.js from data/content.js - do not edit by hand\nexport default ' + JSON.stringify(edge) + ';\n');
console.log('Built', 9 + modules.length, 'pages + edge content');
