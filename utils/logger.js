const dayjs = require('dayjs');

function info(message) {
  console.log(`${dayjs().format('YYYY-MM-DD hh:mm:ss')}【消息】${message}`);
}

function warning(message) {
  console.log(`${dayjs().format('YYYY-MM-DD hh:mm:ss')}【警告】${message}`);
}

function error(message) {
  console.log(`${dayjs().format('YYYY-MM-DD hh:mm:ss')}【错误】${message}`);
}

function logger(message) {
  info(message);
}

logger.prototype.warning = warning;

logger.prototype.info = info;

logger.prototype.error = error;

module.exports = logger;
