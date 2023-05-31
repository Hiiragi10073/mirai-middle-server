const { Message } = require('mirai-js');
const { defaultSubs } = require('../config');
const logger = require('../utils/logger');

module.exports = function sendForwardMessage(bot, data) {
  logger('开始执行handler: sendForwardMessage');
  const { from, messages, subs } = data;
  const subscriptions = subs || defaultSubs;
  const { groups, users } = subscriptions;

  // 创建转发信息
  const forwardMsgContent = Message.createForwardMessage();
  for (let i = 0; i < messages.length; i++) {
    const { message, imgUrls, originUrl } = messages[i];
    const msgContent = new Message();
    // 依次添加文本消息
    if (message) {
      Array.isArray(message)
        ? message.forEach((message) => msgContent.addText(`${message}\n`))
        : msgContent.addText(`${message}\n`);
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
      msgContent.addText(`\n点击查看详情：${originUrl}`);
    }
    forwardMsgContent.addForwardNode({
      senderId: process.env.QQ,
      time: 0,
      senderName: process.env.FORWARD_SENDER_NAME || '莉娜·模儿',
      messageChain: msgContent,
    });
  }

  Array.isArray(groups) &&
    groups.forEach((groupId) => {
      // 添加消息来源
      if (from) {
        bot.sendMessageToGroup(
          groupId,
          new Message().addText(`${from}更新啦！快来看吧。`),
        );
      }
      bot.sendMessageToGroup(groupId, forwardMsgContent);
    });
  Array.isArray(users) &&
    users.forEach((qq) => {
      // 添加消息来源
      if (from) {
        bot.sendMessageToFriend(
          qq,
          new Message().addText(`${from}更新啦！快来看吧。`),
        );
      }
      bot.sendMessageToFriend(qq, forwardMsgContent);
    });
};
