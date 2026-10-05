// POST /api/track — records one page view (sent by public/assets/js/main.js). Always answers 204.
import { readBody, text, isBot, visitorInfo } from './_lib/http.mjs';
import { store } from './_lib/store.mjs';
import { dayKey } from './_lib/stats.mjs';

const ID = /^[a-z0-9-]{8,40}$/i;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST' && !isBot(req.headers['user-agent'])) {
      const body = await readBody(req);
      const path = text(body.path, 200);
      if (path.startsWith('/') && !path.startsWith('/admin') && ID.test(body.vid) && ID.test(body.sid)) {
        const t = Date.now();
        // Referrers are kept as a hostname only; visits from the site's own pages count as none.
        let ref = '';
        try { ref = new URL(text(body.ref, 500)).hostname.replace(/^www\./, ''); } catch { /* no referrer */ }
        if (ref === String(req.headers.host || '').replace(/^www\./, '').replace(/:\d+$/, '')) ref = '';
        await store.addEvent(dayKey(t), {
          t,
          path,
          ref,
          utm: text(body.utm, 60),
          vid: body.vid,
          sid: body.sid,
          lang: text(body.lang, 12),
          ...visitorInfo(req),
        });
      }
    }
  } catch {
    // Analytics must never break a page view.
  }
  res.writeHead(204, { 'Cache-Control': 'no-store' });
  res.end();
}
