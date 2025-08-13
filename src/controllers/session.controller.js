const sequelize = require('../models');
const { createSessionSchema, getSessionsSchema, renameSessionSchema, favoriteSchema } = require('../validations/session.validation');
const { Session, Message } = sequelize.models;

// POST /v1/sessions
exports.createSession = async (req, res, next) => {
  try {
    const { error, value } = createSessionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const session = await Session.create({ user_id: value.userId, title: value.title });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// GET /v1/sessions?userId=...
exports.getSessionsByUser = async (req, res, next) => {
  try {
    const { error, value } = getSessionsSchema.validate({ ...req.query });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const sessions = await Session.findAll({
      where: { user_id: value.userId }, // ➡️ The key change is here
      limit: parseInt(value.limit),
      offset: parseInt(value.offset),
      order: [['updated_at', 'DESC']]
    });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};


// GET /v1/sessions/:id
exports.getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

// PATCH /v1/sessions/:id
exports.renameSession = async (req, res, next) => {
  try {
    const { error, value } = renameSessionSchema.validate({ ...req.body, id: req.params.id });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const session = await Session.findByPk(value.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.title = value.title;
    await session.save();
    return res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};


// PATCH /v1/sessions/:id/favorite
exports.favoriteSession = async (req, res, next) => {
  try {
    const { error, value } = favoriteSchema.validate({ ...req.body, id: req.params.id });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const session = await Session.findByPk(value.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.is_favorite = value.isFavorite;
    await session.save();
    return res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

// DELETE /v1/sessions/:id
exports.deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const deleted = await Session.destroy({
      where: { id }
    });
    if (deleted) return res.status(204).send();
    return res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    next(error);
  }
};