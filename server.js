// Local development server (zero dependencies). Serves /public and runs the SAME API core that is deployed
// to Supabase Edge Functions, with a file-based store instead of Supabase.
//   npm start   ->  http://localhost:3000     (leads: data/leads.jsonl, media: private/)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public'), PRIV = path.join(__dirname, 'private'), LEADS = path.join(__dirname, 'data', 'leads.jsonl');
fs.mkdirSync(path.dirname(LEADS), { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(24).toString('hex');

const store = {
  secret: SECRET,
  async insertLead(r) { fs.appendFileSync(LEADS, JSON.stringify({ created_at: new Date().toISOString(), ...r }) + '\n'); },
  async countRecentLeads(ih, since) {
    if (!fs.existsSync(LEADS)) return 0;
    return fs.readFileSync(LEADS, 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter((r) => r.ip_hash === ih && r.created_at >= since).length;
  },
  async getObject(bucket, name, range) {
    const file = bucket === 'site-videos' ? path.join(PRIV, 'video', name) : path.join(PRIV, name);
    if (!fs.existsSync(file)) return null;
    const size = fs.statSync(file).size; let s = 0, e = size - 1, status = 200;
    const m = range && /bytes=(\d*)-(\d*)/.exec(range);
    if (m) { status = 206; if (m[1] === '' && m[2] !== '') { s = Math.max(0, size - +m[2]); } else { s = +m[1] || 0; if (m[2] !== '') e = Math.min(+m[2], size - 1); } }
    const h = { 'content-length': String(e - s + 1) }; if (status === 206) h['content-range'] = `bytes ${s}-${e}/${size}`;
    const stream = fs.createReadStream(file, { start: s, end: e });
    return new Response(require('stream').Readable.toWeb(stream), { status, headers: h });
  },
};

let handler;
async function init() { const { createHandler } = await import('./supabase/functions/site-api/core.mjs'); handler = createHandler(store); }

function serveStatic(req, res, pathname) {
  let rel; try { rel = decodeURIComponent(pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  let file = path.normalize(path.join(PUB, rel));
  if (!file.startsWith(PUB)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) { if (!rel.endsWith('/')) { res.writeHead(301, { Location: rel + '/' }); return res.end(); } file = path.join(file, 'index.html'); }
    fs.readFile(file, (e2, buf) => {
      if (e2) return fs.readFile(path.join(PUB, '404.html'), (e3, nf) => { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(e3 ? 'Not found' : nf); });
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(buf);
    });
  });
}

const API = /^\/(api\/|stream\/|download\/whitepaper)/;
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (!API.test(u.pathname)) return serveStatic(req, res, u.pathname);
  const chunks = []; for await (const c of req) chunks.push(c);
  const headers = new Headers(); for (const [k, v] of Object.entries(req.headers)) if (v) headers.set(k, Array.isArray(v) ? v.join(',') : v);
  const pathname = u.pathname === '/download/whitepaper' ? '/download' : u.pathname.replace(/^\/api/, '');
  const request = new Request(`http://localhost${pathname}${u.search}`, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
  const r = await handler(request);
  res.writeHead(r.status, Object.fromEntries(r.headers));
  if (!r.body) return res.end();
  require('stream').Readable.fromWeb(r.body).pipe(res);
}).listen(PORT, async () => { await init(); console.log(`Open Netrikkan site running on http://localhost:${PORT}`); });
