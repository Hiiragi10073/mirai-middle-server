const { Message } = require('mirai-js');
const logger = require('../utils/logger');

module.exports = function sendMessage2(bot, data) {
  logger('开始执行handler: sendMessage2');
  const { from, messages, imgUrls, subs, originUrl, at } = data;
  const subscriptions = subs || defaultSubs;
  const { groups, users } = subscriptions;
  const msgContent = new Message();
  // 添加@信息
  if (at) {
    if (at === 'all') {
      msgContent.addAtAll();
    } else if (Array.isArray(at)) {
      at.forEach((qq) => msgContent.addAt(qq));
    }
  }
  // 添加消息来源
  if (from) {
    msgContent.addText(`${from}\n`);
  }
  // 依次添加文本消息
  if (messages) {
    Array.isArray(messages)
      ? messages.forEach((message) => msgContent.addText(`${message}\n`))
      : msgContent.addText(messages);
  }
  // 添加图片消息
  if (imgUrls) {
    Array.isArray(imgUrls)
      ? imgUrls
          .slice(0, process.env.IMG_NUMBER_IN_ONE_MESSAGE || 1)
          .forEach((url) => msgContent.addImageUrl(url))
      : msgContent.addImageUrl(imgUrls);
  }
  // 添加来源地址
  if (originUrl) {
    msgContent.addText(`点击查看详情：${originUrl}`);
  }

  Array.isArray(groups) &&
    groups.forEach((groupId) => {
      bot.sendMessageToGroup(groupId, msgContent);
    });
  Array.isArray(users) &&
    users.forEach((qq) => {
      bot.sendMessageToFriend(qq, msgContent);
    });
};
