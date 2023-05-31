const { Bot } = require('mirai-js');
const Queue = require('../utils/queue');
const logger = require('../utils/logger');

class CreateBot {
  constructor() {
    this.bot = new Bot();
    this.queue = new Queue();
    this.running = false;
  }

  async open(config) {
    logger(`开始连接 mirai: host: ${config.baseUrl}, qq: ${config.qq}`);
    await this.bot.open({
      baseUrl: config.baseUrl,
      verifyKey: config.verifyKey,
      qq: config.qq,
    });
  }

  async sendMessageToFriend(qq, message) {
    logger(`发送好友[${qq}]消息进入消息队列`);
    return this.queue
      .addMethod(this.bot.sendMessage.bind(this.bot, { friend: qq, message }))
      .then(
        (res) => {
          logger(`发送好友[${qq}]消息成功 ${res}`);
          return res;
        },
        (e) => {
          logger.warning(`发送好友[${qq}]消息失败,错误信息${e}`);
          return Promise.reject(e);
        },
      );
  }

  async sendMessageToGroup(groupId, message) {
    logger(`发送群[${groupId}]消息进入消息队列`);
    return this.queue
      .addMethod(
        this.bot.sendMessage.bind(this.bot, { group: groupId, message }),
      )
      .then(
        (res) => {
          logger(`发送群[${groupId}]消息成功 ${res}`);
          return res;
        },
        (e) => {
          logger.warning(`发送群[${groupId}]消息失败,错误信息${e}`);
          return Promise.reject(e);
        },
      );
  }
}

module.exports = CreateBot;
