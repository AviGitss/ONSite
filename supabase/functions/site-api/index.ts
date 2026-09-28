// Supabase Edge Function: site-api
// Handles lead capture, chatbot, gated whitepaper download and protected video streaming for the Open Netrikkan website.
// Deployed with verify_jwt = false (public endpoint); every privileged action is validated inside (signed tokens, corporate-email checks, rate limit).
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by Supabase.
import { createHandler } from './core.mjs';

const URL_ = Deno.env.get('SUPABASE_URL')!;
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Token secret is derived from the service-role key, so it is stable across instances and never leaves the server.
const secretBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('on-site-token-v1:' + KEY));
const secret = [...new Uint8Array(secretBytes)].map((b) => b.toString(16).padStart(2, '0')).join('');

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });

const handler = createHandler({
  secret,
  async insertLead(rec: Record<string, unknown>) {
    const r = await rest('website_leads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(rec) });
    if (!r.ok) throw new Error('insert failed: ' + r.status + ' ' + (await r.text()));
  },
  async countRecentLeads(ipHash: string, sinceIso: string) {
    const r = await rest(`website_leads?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(sinceIso)}`, { headers: { Prefer: 'count=exact', Range: '0-0' } });
    const cr = r.headers.get('content-range') || '';
    const n = parseInt(cr.split('/')[1] || '0', 10);
    return Number.isFinite(n) ? n : 0;
  },
  async getObject(bucket: string, path: string, range: string | null) {
    const headers: Record<string, string> = { apikey: KEY, Authorization: `Bearer ${KEY}` };
    if (range) headers.Range = range;
    const r = await fetch(`${URL_}/storage/v1/object/authenticated/${bucket}/${path}`, { headers });
    return r.ok || r.status === 206 ? r : null;
  },
});

Deno.serve((req: Request) => handler(req));
