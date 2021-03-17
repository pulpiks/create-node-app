import http from 'http'

const requestListener: http.RequestListener = (_req, res) => {
  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);