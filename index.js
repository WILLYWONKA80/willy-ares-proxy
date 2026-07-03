const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': '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
    };
    const proxy = https.request(options, r => {
      let data = '';
      r.on('data', c => { data += c; });
      r.on('end', () => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
      });
    });
    proxy.on('error', e => {
      res.writeHead(500);
      res.end(JSON.stringify({error: e.message}));
    });
    proxy.write(body);
    proxy.end();
  });
});

server.listen(process.env.PORT || 3000);
