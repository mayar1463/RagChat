const sequelize = require('../models');
const { addMessageSchema, getMessagesSchema } = require('../validations/message.validation');
const { Session, Message } = sequelize.models;

// POST /v1/sessions/:id/messages
exports.addMessage = async (req, res, next) => {
  try {
    const { error, value } = addMessageSchema.validate({ ...req.body, sessionId: req.params.id });
    const contextValue = value.context ? JSON.stringify(value.context) : null;
    if (error) return res.status(400).json({ error: error.details[0].message });

    const session = await Session.findByPk(value.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const message = await Message.create({
      session_id: value.sessionId,
      sender: value.sender,
      content: value.content,
      context: contextValue
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// GET /v1/sessions/:id/messages?limit=...
exports.getMessages = async (req, res, next) => {
  try {
    const { error, value } = getMessagesSchema.validate({ ...req.query, sessionId: req.params.id });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const messages = await Message.findAll({
      where: { session_id: value.sessionId },
      limit: parseInt(value.limit),
      offset: parseInt(value.offset),
      order: [['created_at', 'ASC']]
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};