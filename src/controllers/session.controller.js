// src/controllers/session.controller.js
const sessionModel = require('../models/session.model');
const { createSessionSchema, renameSessionSchema, favoriteSchema } = require('../validations/session.validation');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');
exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSessionSchema.validate(req.body);
    if (error) throw new ValidationError(error.details[0].message);
    const existingSessions = await sessionModel.getSessionsByUser(value.userId);
    const hasDuplicate = existingSessions.some(s => s.title === value.title);
    if (hasDuplicate) {
      throw new ConflictError('Session with this title already exists for this user');
    }
    const session = await sessionModel.createSession(value.userId, value.title);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};
exports.list = async (req, res, next) => {
  try {
    const { userId, limit = 20, offset = 0 } = req.query;
    if (!userId) throw new ValidationError('userId query param required');
    const sessions = await sessionModel.getSessionsByUser(userId, limit, offset);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};
exports.get = async (req, res, next) => {
  try {
    const session = await sessionModel.getSessionById(req.params.id);
    if (!session) throw new NotFoundError('Session not found');
    res.json(session);
  } catch (err) {
    next(err);
  }
};
exports.rename = async (req, res, next) => {
  try {
    const { error, value } = renameSessionSchema.validate(req.body);
    if (error) throw new ValidationError(error.details[0].message);
    const sessionToRename = await sessionModel.getSessionById(req.params.id);
    if (!sessionToRename) throw new NotFoundError('Session not found');
    const existingSessions = await sessionModel.getSessionsByUser(sessionToRename.user_id);
    const hasDuplicate = existingSessions.some(s => s.title === value.title && s.id !== sessionToRename.id);
    if (hasDuplicate) {
      throw new ConflictError('Session with this title already exists for this user');
    }
    const updatedSession = await sessionModel.renameSession(req.params.id, value.title);
    res.json(updatedSession);
  } catch (err) {
    next(err);
  }
};
exports.favorite = async (req, res, next) => {
  try {
    const { error, value } = favoriteSchema.validate(req.body);
    if (error) throw new ValidationError(error.details[0].message);
    const session = await sessionModel.toggleFavorite(req.params.id, value.isFavorite);
    if (!session) throw new NotFoundError('Session not found');
    res.json(session);
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    await sessionModel.deleteSession(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};