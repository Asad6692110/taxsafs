// POST /api/lead — stores a consultation request from the contact form; it then appears in /admin.
import { randomUUID } from 'node:crypto';
import { readBody, send, text, visitorInfo } from './_lib/http.mjs';
import { store, StoreUnavailable } from './_lib/store.mjs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID = /^[a-z0-9-]{8,40}$/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  try {
    const body = await readBody(req);
    // Honeypot: real visitors never see or fill the "website" field.
    if (text(body.website, 10)) return send(res, 200, { ok: true });

    const lead = {
      id: randomUUID(),
      t: Date.now(),
      status: 'new',
      note: '',
      name: text(body.name, 120),
      email: text(body.email, 200),
      phone: text(body.phone, 40),
      company: text(body.company, 160),
      service: text(body.service, 120),
      message: text(body.message, 4000),
      vid: ID.test(body.vid) ? body.vid : '',
      ...visitorInfo(req),
    };
    if (!lead.name || !lead.phone || !EMAIL.test(lead.email)) return send(res, 400, { error: 'Please complete the required fields.' });

    await store.addLead(lead);
    send(res, 200, { ok: true });
  } catch (err) {
    send(res, err instanceof StoreUnavailable ? 503 : 500, { error: 'The request could not be saved.' });
  }
}
