// Open Netrikkan site API - runtime-agnostic core (Deno on Supabase Edge, Node for local dev).
// Uses only Web APIs: Request, Response, fetch, crypto.subtle.
import CONTENT from './content.mjs';

const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uStr = (s) => b64u(enc.encode(s));
const fromB64uStr = (s) => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))); };
const hmac = async (secret, data) => { const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return b64u(await crypto.subtle.sign('HMAC', k, enc.encode(data))); };
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const safeEq = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

const FREE = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'ymail.com', 'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com', 'pm.me', 'rediffmail.com', 'rediff.com', 'gmx.com', 'gmx.net', 'mail.com', 'zohomail.com', 'yandex.com', 'yandex.ru', 'qq.com', '163.com', '126.com', 'tutanota.com', 'fastmail.com', 'inbox.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (s, n = 200) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, ' ').trim().slice(0, n);
const isCorporate = (email) => !FREE.has(email.split('@')[1].toLowerCase());
const O = CONTENT.options;

export function validateFull(b) {
  const e = {};
  const v = { name: clean(b.name, 100), title: clean(b.title, 100), designation: clean(b.designation), email: clean(b.email, 150).toLowerCase(), phone: clean(b.phone, 30), interest: clean(b.interest), size: clean(b.size), sector: clean(b.sector) };
  if (v.name.length < 2) e.name = 'Enter your full name';
  if (v.title.length < 2) e.title = 'Enter your job title';
  if (!O.designation.includes(v.designation)) e.designation = 'Select your designation level';
  if (!EMAIL_RE.test(v.email)) e.email = 'Enter a valid work email';
  else if (!isCorporate(v.email)) e.email = 'Please use your corporate email address (personal email domains are not accepted)';
  const digits = v.phone.replace(/\D/g, '');
  if (!/^[+\d][\d\s\-()]*$/.test(v.phone) || digits.length < 8 || digits.length > 15) e.phone = 'Enter a valid phone number';
  if (!O.interest.includes(v.interest)) e.interest = 'Select an area of interest';
  if (!O.size.includes(v.size)) e.size = 'Select company size';
  if (!O.sector.includes(v.sector)) e.sector = 'Select your sector';
  if (b.consent !== true) e.consent = 'Please accept to continue';
  return { v, e };
}

// ---------- chatbot (stateless: the client sends and receives the dialogue state) ----------
const norm = (s) => ' ' + s.toLowerCase().replace(/[^a-z0-9À-ɏ\s\-@.+]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
function faqMatch(text) {
  const t = norm(text); let best = null, score = 0;
  for (const f of CONTENT.faq) for (const k of f.k) {
    const kk = k.trim();
    const hit = t.includes(' ' + kk + ' ') || (kk.length >= 5 && t.includes(' ' + kk));
    if (hit && kk.length > score) { score = kk.length; best = f; }
  }
  return best;
}
const chipMap = { 'see the modules': 'modules', 'assembly / auto': 'changeover', 'pharma': 'pharma', 'warehousing': 'warehouse', 'semiconductor': 'fabsim', 'oil & gas': 'oilsim', 'fmcg': 'fmcg', 'is my data safe?': 'data security', 'integrations': 'erp integration', 'download the whitepaper': 'whitepaper', 'watch the demo video': 'video', 'how do pilots work?': 'pilot', 'outbound module': 'outbound', 'how is it priced?': 'pricing', 'how does it work?': 'how does it work', 'what is open netrikkan?': 'what is open netrikkan' };
const FALLBACK = { a: 'I am not sure I have that yet. I can help with the platform, our nine modules, pricing, deployment, the whitepaper, or setting up a demo with our team. You can also email ' + CONTENT.site.email + '.', chips: ['See the modules', 'How is it priced?', 'Book a demo'] };

export function chatStep(message, stateIn) {
  const st = { step: null, lead: {} };
  if (stateIn && typeof stateIn === 'object') {
    if (['name', 'email', 'company', 'phone', 'interest'].includes(stateIn.step)) st.step = stateIn.step;
    const l = stateIn.lead || {};
    for (const k of ['name', 'email', 'company', 'phone']) if (l[k]) st.lead[k] = clean(l[k], 150);
  }
  const text = clean(message, 400), low = text.toLowerCase();
  const out = (reply, extra = {}, save = null) => ({ reply, state: st, save, ...extra });

  if (st.step) {
    if (/^(cancel|stop|no thanks|never ?mind)$/i.test(low)) { st.step = null; st.lead = {}; return out('No problem — I have cancelled that. Anything else I can help with?', { chips: ['See the modules', 'Download the whitepaper'] }); }
    if (st.step === 'name') { if (text.length < 2) return out('Could I get your name, please?'); st.lead.name = text; st.step = 'email'; return out(`Thanks, ${text.split(' ')[0]}. What is your work email?`); }
    if (st.step === 'email') {
      const em = text.toLowerCase().match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
      if (!em) return out('That does not look like an email address. Could you type it again (for example name@company.com)?');
      if (!isCorporate(em[0])) return out('Please share a corporate email address — personal email domains are not accepted for demo requests.');
      st.lead.email = em[0]; st.step = 'company'; return out('And which company are you with?');
    }
    if (st.step === 'company') { st.lead.company = text; st.step = 'phone'; return out('What is the best phone number to reach you on? (You can type "skip".)'); }
    if (st.step === 'phone') {
      if (!/^skip$/i.test(low)) { const d = text.replace(/\D/g, ''); if (d.length < 8 || d.length > 15) return out('That number does not look right — try again with the country code, or type "skip".'); st.lead.phone = text; }
      st.step = 'interest'; return out('Last question — which area are you most interested in?', { chips: ['Scheduling & changeovers', 'New line planning', 'Pharma', 'Warehouse & logistics', 'Semiconductor / Oil & gas', 'Not sure yet'] });
    }
    if (st.step === 'interest') {
      const rec = { ...st.lead, interest: text }; st.step = null; st.lead = {};
      return out(`Thank you, ${(rec.name || '').split(' ')[0]} — I have passed your details to our team and someone will contact you shortly to set up the session. In the meantime, you can read our whitepaper or watch a product video.`, { done: true, chips: ['Download the whitepaper', 'Watch the demo video'] }, rec);
    }
  }
  const mapped = chipMap[low] || text;
  if (CONTENT.bookIntent.some((k) => low.includes(k))) { st.step = 'name'; return out('Happy to set up a 30-minute working session where we run the closest tool against a representative case from your operation. May I take a few details? First — what is your name?'); }
  const f = faqMatch(mapped);
  if (f) return out(f.a, { chips: f.chips, link: f.link });
  return out(FALLBACK.a, { chips: FALLBACK.chips });
}

// ---------- handler ----------
const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { ...JSON_HEADERS, ...extra } });
const CHUNK = 4 * 1024 * 1024;
const VIDEO_IDS = new Set(CONTENT.videoIds);

/**
 * store: {
 *   secret: string,
 *   insertLead(record): Promise<void>,
 *   countRecentLeads(ipHash, sinceIso): Promise<number>,
 *   getObject(bucket, path, rangeHeader|null): Promise<Response|null>   // null => not found
 * }
 */
export function createHandler(store) {
  const tokenSign = async (payload) => { const b = b64uStr(JSON.stringify(payload)); return b + '.' + await hmac(store.secret, b); };
  const tokenVerify = async (tok) => {
    if (typeof tok !== 'string' || !tok.includes('.')) return null;
    const [b, s] = tok.split('.');
    if (!safeEq(s, await hmac(store.secret, b))) return null;
    try { const p = JSON.parse(fromB64uStr(b)); return p.exp > Date.now() ? p : null; } catch { return null; }
  };
  const uaHash = async (req) => (await sha(req.headers.get('user-agent') || '')).slice(0, 10);
  const ipOf = (req) => (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  const ipHash = async (req) => (await sha(ipOf(req) + store.secret)).slice(0, 12);

  return async function handle(req) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '');
    const m = (re) => path.match(re);
    try {
      if (req.method === 'OPTIONS') return new Response(null, { status: 204 });

      if (m(/\/health$/)) return json({ ok: true });

      // ---- lead form ----
      if (m(/\/lead$/) && req.method === 'POST') {
        const b = await req.json().catch(() => ({}));
        if (b.website) return json({ ok: true }); // honeypot
        const { v, e } = validateFull(b);
        if (Object.keys(e).length) return json({ ok: false, errors: e }, 400);
        const ih = await ipHash(req);
        if ((await store.countRecentLeads(ih, new Date(Date.now() - 3600e3).toISOString())) >= 8) return json({ ok: false, message: 'Too many requests. Please try again later.' }, 429);
        const source = ['whitepaper', 'contact', 'demo'].includes(b.source) ? b.source : 'contact';
        await store.insertLead({ source, name: v.name, job_title: v.title, designation: v.designation, email: v.email, phone: v.phone, interest: v.interest, company_size: v.size, sector: v.sector, note: clean(b.note, 1000) || null, page: clean(b.page, 200) || null, ip_hash: ih });
        const out = { ok: true };
        if (source === 'whitepaper') out.token = await tokenSign({ k: 'wp', email: v.email, exp: Date.now() + 24 * 3600e3 });
        return json(out);
      }

      // ---- chatbot ----
      if (m(/\/chat$/) && req.method === 'POST') {
        const b = await req.json().catch(() => ({}));
        const r = chatStep(b.message || '', b.state);
        if (r.save) {
          const ih = await ipHash(req);
          await store.insertLead({ source: 'chatbot', name: r.save.name || null, email: r.save.email || 'unknown', phone: r.save.phone || null, company: r.save.company || null, interest: r.save.interest || null, page: clean(b.page, 200) || null, ip_hash: ih });
        }
        const { save, ...pub } = r;
        return json(pub);
      }

      // ---- gated whitepaper ----
      if (m(/\/download$/)) {
        const t = await tokenVerify(url.searchParams.get('t'));
        if (!t || t.k !== 'wp') return new Response('A valid download link is required. Please complete the whitepaper form first.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        const o = await store.getObject('site-docs', 'whitepaper.pdf', null);
        if (!o) return json({ error: 'not found' }, 404);
        const h = new Headers({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="OpenNetrikkan-Simulation-as-the-OS-for-Contract-Manufacturing.pdf"', 'Cache-Control': 'private, no-store' });
        const cl = o.headers.get('content-length'); if (cl) h.set('Content-Length', cl);
        return new Response(o.body, { status: 200, headers: h });
      }

      // ---- protected video streaming ----
      if (m(/\/video-token$/) && req.method === 'GET') {
        const id = url.searchParams.get('id');
        if (!VIDEO_IDS.has(id)) return json({ error: 'unknown video' }, 404);
        return json({ src: `/stream/${id}?t=${encodeURIComponent(await tokenSign({ id, ua: await uaHash(req), exp: Date.now() + 2 * 3600e3 }))}` });
      }
      const sm = m(/\/stream\/([a-z0-9-]+)$/);
      if (sm) {
        const id = sm[1];
        const p = await tokenVerify(url.searchParams.get('t'));
        const dest = req.headers.get('sec-fetch-dest');
        if (!p || p.id !== id || !VIDEO_IDS.has(id) || p.ua !== await uaHash(req) || (dest && dest !== 'video' && dest !== 'empty')) return new Response('Forbidden', { status: 403 });
        // cap each response at CHUNK bytes so playback stays chunked and hotlinking a whole file is impractical
        let range = req.headers.get('range'); let start = 0;
        const rm = range && /bytes=(\d*)-(\d*)/.exec(range);
        if (rm && rm[1] !== '') { start = parseInt(rm[1], 10); const end = rm[2] !== '' ? Math.min(parseInt(rm[2], 10), start + CHUNK - 1) : start + CHUNK - 1; range = `bytes=${start}-${end}`; }
        else if (rm) range = range; // suffix range: pass through
        else range = `bytes=0-${CHUNK - 1}`;
        const o = await store.getObject('site-videos', id + '.mp4', range);
        if (!o) return json({ error: 'not found' }, 404);
        const h = new Headers({ 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store, private', 'Content-Disposition': 'inline', 'X-Robots-Tag': 'noindex' });
        for (const k of ['content-length', 'content-range']) { const val = o.headers.get(k); if (val) h.set(k, val); }
        return new Response(o.body, { status: o.status === 200 && rm ? 206 : o.status, headers: h });
      }

      return json({ error: 'not found' }, 404);
    } catch (err) {
      console.error('site-api error', err && err.message);
      return json({ ok: false, message: 'Server error' }, 500);
    }
  };
}
