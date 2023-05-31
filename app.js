const fs = require('fs');
const { join } = require('path');
const CreateBot = require('./bot');
const CreateWebhookServer = require('./http');
const logger = require('./utils/logger');

let retryCount = 0;

(async function start(port) {
  if (retryCount >= 5) {
    logger.warning('重试次数已达上限，请联系管理员重新启动本服务');
    return;
  }

  logger('start server!!');
  const bot = new CreateBot();

  logger('bot 连接中...');
  await bot
    .open({
      baseUrl: process.env.MIRAI_HTTP_API_HOST,
      verifyKey: process.env.MIRAI_HTTP_API_VERIFY_KEY,
      qq: process.env.QQ,
    })
    .catch((e) => {
      retryCount++;
      logger.error(`bot 连接失败，${e}。正在重试, 重试次数 ${retryCount}`);

      setTimeout(() => {
        start();
      }, 5000);
      return Promise.reject();
    });
  logger('bot 连接成功！！');

  logger('开启 webhook 服务器');
  const webhook = new CreateWebhookServer();

  logger('开始引入handler函数');
  const files = fs.readdirSync('./handlers');
  const handlers = files
    .filter((it) => /\.js$/.test(it))
    .map((it) => {
      let fPath = join(__dirname, './handlers', it);
      return {
        event: it.split('.').slice(0, -1).join('.'),
        handler: require(fPath).bind(this, bot),
      };
    });
  webhook.registerHanlder(handlers);

  webhook.startListen(port);
  logger(`开始监听端口: ${port}`);
})(process.env.WEB_HOOK_PORT);
