// Local preview server that emulates the production Netlify config
// (_redirects + _headers) so the site behaves in dev exactly like on Netlify.
// Run: node dev-server.mjs [port]
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.argv[2] || 8080);

// Parse _redirects:  "/go/x  DEST  302"
const redirects = (await readFile(path.join(ROOT, '_redirects'), 'utf8'))
  .split('\n')
  .filter((l) => l.trim() && !l.trim().startsWith('#'))
  .map((l) => {
    const [from, to, code] = l.trim().split(/\s+/);
    return { from, to, code: Number(code || 302) };
  });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let p = decodeURIComponent(url.pathname);

    // Global security headers (mirror of _headers /*)
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // _redirects
    const r = redirects.find((x) => p === x.from || p.startsWith(x.from + '/'));
    if (r) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.setHeader('Cache-Control', 'no-store');
      res.writeHead(r.code, { Location: r.to });
      return res.end();
    }

    // Resolve folder URLs
    let file = path.join(ROOT, p);
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!p.endsWith('/')) {
        res.writeHead(301, { Location: p + '/' });
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    if (!existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 — Not Found</h1><p><a href="/">Back to BuildAI Reviews</a></p>');
    }

    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.writeHead(200);
    res.end(await readFile(file));
  })
  .listen(PORT, '0.0.0.0', () => console.log(`BuildAI preview → http://0.0.0.0:${PORT}`));
