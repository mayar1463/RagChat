// src/models/session.model.js
const Session = require('../sequelize-models/session.model.sequelize');
const { Op } = require('sequelize');

async function createSession(userId, title = 'New Chat') {
  const session = await Session.create({ user_id: userId, title });
  return session;
}

async function getSessionsByUser(userId, limit = 20, offset = 0) {
  const sessions = await Session.findAll({
    where: { user_id: userId },
    order: [['updated_at', 'DESC']],
    limit: Number(limit),
    offset: Number(offset),
  });
  return sessions;
}

async function getSessionById(id) {
  const session = await Session.findByPk(id);
  return session;
}

async function renameSession(id, title) {
  const session = await Session.findByPk(id);
  if (!session) return null;
  
  session.title = title;
  await session.save();
  return session;
}

async function toggleFavorite(id, isFavorite) {
  const session = await Session.findByPk(id);
  if (!session) return null;
  
  session.is_favorite = isFavorite;
  await session.save();
  return session;
}

async function deleteSession(id) {
  const session = await Session.findByPk(id);
  if (session) {
    await session.destroy();
  }
}

module.exports = {
  createSession,
  getSessionsByUser,
  getSessionById,
  renameSession,
  toggleFavorite,
  deleteSession,
};