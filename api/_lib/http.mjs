// Shared request helpers for the API routes: JSON in/out, visitor details and the admin session.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const MAX_BODY = 20_000;

export const send = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(data === undefined ? '' : JSON.stringify(data));
};

/** JSON body as an object ({} when missing or malformed). Works on Vercel (pre-parsed) and on the local server (stream). */
export const readBody = async (req) => {
  let raw;
  try { raw = req.body; } catch { return {}; }
  if (raw === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) return {};
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks);
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString('utf8');
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); } catch { return {}; }
  }
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
};

export const query = (req) => new URL(req.url, 'http://localhost').searchParams;

/** Trimmed string limited to `max` characters; anything that isn't a string becomes ''. */
export const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const clientIp = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

export const isBot = (ua) => !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|scrapy|facebookexternalhit|whatsapp/i.test(ua);

const decode = (value) => { try { return decodeURIComponent(value); } catch { return value; } };

/** Coarse visitor details. The IP address itself is never stored — only the country/city the host derives from it. */
export const visitorInfo = (req) => {
  const ua = String(req.headers['user-agent'] || '');
  const device = /ipad|tablet|android(?!.*mobile)/i.test(ua) ? 'Tablet' : /mobi|iphone|ipod|android/i.test(ua) ? 'Mobile' : 'Desktop';
  const browser = /edg\//i.test(ua) ? 'Edge'
    : /opr\/|opera/i.test(ua) ? 'Opera'
    : /samsungbrowser/i.test(ua) ? 'Samsung Internet'
    : /firefox|fxios/i.test(ua) ? 'Firefox'
    : /chrome|crios/i.test(ua) ? 'Chrome'
    : /safari/i.test(ua) ? 'Safari'
    : 'Other';
  const os = /windows/i.test(ua) ? 'Windows'
    : /android/i.test(ua) ? 'Android'
    : /iphone|ipad|ipod/i.test(ua) ? 'iOS'
    : /mac os x/i.test(ua) ? 'macOS'
    : /cros/i.test(ua) ? 'ChromeOS'
    : /linux/i.test(ua) ? 'Linux'
    : 'Other';
  return {
    country: text(req.headers['x-vercel-ip-country'], 2).toUpperCase(),
    city: text(decode(String(req.headers['x-vercel-ip-city'] || '')), 80),
    device,
    browser,
    os,
  };
};

/* ---- Admin session: a signed, expiring cookie. Sign-in is the email below (or ADMIN_USER) + ADMIN_PASSWORD. ---- */

const ADMIN_EMAIL = 'smartamplefs@gmail.com';
const COOKIE = 'smfs_admin';
const SESSION_DAYS = 7;
const hosted = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');
// Local preview only. A deployed site has no default: without ADMIN_PASSWORD nobody can sign in.
const PREVIEW_PASSWORD = 'admin123';

export const credentials = () => ({
  user: process.env.ADMIN_USER || ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD || (hosted ? '' : PREVIEW_PASSWORD),
});

const sha = (value) => createHash('sha256').update(String(value)).digest();
const same = (a, b) => timingSafeEqual(sha(a), sha(b));
const sign = (expires) => {
  const { user, password } = credentials();
  return createHmac('sha256', sha(`smfs-admin:${user}:${password}`)).update(String(expires)).digest('hex');
};

export const checkLogin = (user, password) => {
  const real = credentials();
  if (!real.password) return false;
  const userOk = same(String(user).toLowerCase(), real.user.toLowerCase());
  return same(password, real.password) && userOk;
};

const cookie = (req, value, maxAge) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''}`;

export const startSession = (req, res) => {
  const expires = Date.now() + SESSION_DAYS * 86400e3;
  res.setHeader('Set-Cookie', cookie(req, `${expires}.${sign(expires)}`, SESSION_DAYS * 86400));
};

export const endSession = (req, res) => res.setHeader('Set-Cookie', cookie(req, '', 0));

export const isAdmin = (req) => {
  if (!credentials().password) return false;
  const match = String(req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=(\\d+)\\.([a-f0-9]{64})`));
  if (!match) return false;
  return Number(match[1]) > Date.now() && same(match[2], sign(match[1]));
};

/** True when a state-changing request comes from another site (the cookie is SameSite=Strict; this is a second check). */
export const crossSite = (req) => {
  const origin = req.headers.origin;
  if (!origin) return false;
  try { return new URL(origin).host !== req.headers.host; } catch { return true; }
};
