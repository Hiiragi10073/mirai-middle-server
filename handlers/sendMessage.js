const { Message } = require('mirai-js');
const { defaultSubs } = require('../config');
const logger = require('../utils/logger');

// 方法已废弃
module.exports = function sendMessage(bot, data) {
  logger('开始执行handler: sendMessage');
  const { message, imgUrl } = data;
  const subscriptions = defaultSubs;
  const { groups, users } = subscriptions;
  const msg = new Message().addText(message);
  if (imgUrl) {
    msg.addImageUrl(imgUrl);
  }

  groups.forEach((groupId) => {
    bot.sendMessageToGroup(groupId, msg);
  });
  users.forEach((qq) => {
    bot.sendMessageToFriend(qq, msg);
  });
};
