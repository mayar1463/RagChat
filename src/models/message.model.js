// src/models/message.model.js
const Message = require('../sequelize-models/message.model.sequelize');
async function addMessage(sessionId, sender, content, context = null) {
  const message = await Message.create({
    session_id: sessionId,
    sender,
    content,
    context,
  });
  return message;
}
async function getMessages(sessionId, limit = 50, offset = 0) {
  const messages = await Message.findAll({
    where: { session_id: sessionId },
    order: [['created_at', 'ASC']],
    limit: Number(limit),
    offset: Number(offset),
  });
  return messages;
}
module.exports = { addMessage, getMessages };