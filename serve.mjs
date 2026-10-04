// Zero-dependency local preview server for dist/, with the same clean URLs as production (/about -> about.html).
// Usage: node serve.mjs [port]   (or `npm start`, which builds first)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.argv[2] || process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

const isFile = (file) => stat(file).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  const send = async (status, file) => {
    const type = types[extname(file)] || 'application/octet-stream';
    const body = await readFile(file);
    // Compress text responses, as the production host does.
    const gzip = ['text', 'xml', 'json'].some((t) => type.includes(t)) && String(req.headers['accept-encoding']).includes('gzip');
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache', ...(gzip && { 'Content-Encoding': 'gzip' }) });
    res.end(gzip ? gzipSync(body) : body);
  };
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/\/$/, '');
    const base = normalize(join(root, path));
    if (base !== root && !base.startsWith(root + sep)) throw new Error('outside root');
    for (const file of [`${base}.html`, base, join(base, 'index.html')]) {
      if (await isFile(file)) return await send(200, file);
    }
    await send(404, join(root, '404.html'));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Smart Ample Financial Services -> http://localhost:${port}`));
