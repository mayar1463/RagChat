// src/controllers/message.controller.js
const messageModel = require('../models/message.model');
const sessionModel = require('../models/session.model');
const { addMessageSchema, getMessagesSchema } = require('../validations/message.validation');
const { ValidationError, NotFoundError } = require('../utils/errors');

exports.add = async (req, res, next) => {
  try {
    const { error, value } = addMessageSchema.validate({ ...req.body, sessionId: req.params.id });
    if (error) throw new ValidationError(error.details[0].message);

    const session = await sessionModel.getSessionById(req.params.id);
    if (!session) throw new NotFoundError('Session not found');

    const msg = await messageModel.addMessage(req.params.id, value.sender, value.content, value.context || null);
    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { error, value } = getMessagesSchema.validate({ ...req.query, sessionId: req.params.id });
    if (error) throw new ValidationError(error.details[0].message);

    const session = await sessionModel.getSessionById(req.params.id);
    if (!session) throw new NotFoundError('Session not found');

    const rows = await messageModel.getMessages(req.params.id, value.limit, value.offset);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};