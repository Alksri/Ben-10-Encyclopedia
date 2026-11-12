/* Tiny zero-dependency static server for local preview.
   Run: node serve.js  ->  http://localhost:4173
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    urlPath = '/';
  }

  let filePath = path.join(ROOT, urlPath);

  // Prevent path traversal outside the project.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        const notFound = path.join(ROOT, '404.html');
        fs.readFile(notFound, (nfErr, nfData) => {
          res.writeHead(404, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
          res.end(nfErr ? 'Not found' : nfData);
        });
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`BEN 10 // OMNIVERSE PROTOCOL running at http://localhost:${PORT}`);
});
