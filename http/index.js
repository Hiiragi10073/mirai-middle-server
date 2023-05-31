const http = require('http');
const logger = require('../utils/logger');

class CreateWebhookServer {
  constructor() {
    this.http = null;
    this.handlers = [];
  }

  startListen(port) {
    this.http = http
      .createServer((request, response) => {
        const { url, method } = request;
        logger(`监听到请求：${url}, 方法: ${method}`);
        if (method.toLowerCase() !== 'post') return;
        let body = '';
        request
          .on('error', (err) => {
            console.error(err);
          })
          .on('data', (chunk) => {
            body += chunk;
          })
          .on('end', () => {
            try {
              const jsonData = JSON.parse(body);
              Promise.all(
                this.handlers.map((val) =>
                  jsonData.event === val.event
                    ? val.handler(jsonData)
                    : Promise.resolve(),
                ),
              )
                .then(() => {
                  response.writeHead(200, { 'Content-Type': 'text/plain' });
                  response.write('Hello World');
                  response.end();
                })
                .catch((e) => {
                  response.writeHead(405, { 'Content-Type': 'text/plain' });
                  response.write(e);
                  response.end();
                });
            } catch (e) {
              response.writeHead(405, { 'Content-Type': 'text/plain' });
              response.write(e);
              response.end();
            }
          });
      })
      .listen(port || 8080);
  }

  registerHanlder(handlers) {
    logger(`${handlers.map((item) => item.event).join('、')}函数已引入`);
    this.handlers.push(...handlers);
  }
}

module.exports = CreateWebhookServer;
