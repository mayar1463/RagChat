const sessionModel = require('../models/session.model');
const { createSessionSchema, renameSessionSchema, favoriteSchema } = require('../validations/session.validation');

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSessionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const session = await sessionModel.createSession(value.userId, value.title);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId query param required' });
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    const sessions = await sessionModel.getSessionsByUser(userId, limit, offset);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const session = await sessionModel.getSessionById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

exports.rename = async (req, res, next) => {
  try {
    const { error, value } = renameSessionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const session = await sessionModel.renameSession(req.params.id, value.title);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

exports.favorite = async (req, res, next) => {
  try {
    const { error, value } = favoriteSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const session = await sessionModel.toggleFavorite(req.params.id, value.isFavorite);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await sessionModel.deleteSession(req.params.id);
    res.status(204).send(); // no content
  } catch (err) {
    next(err);
  }
};
