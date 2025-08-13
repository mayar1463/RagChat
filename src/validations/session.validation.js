const Joi = require('joi');

const createSessionSchema = Joi.object({
  userId: Joi.alternatives().try(
    Joi.string().trim().min(1).max(50),
    Joi.number().integer().min(1)
  ).required(),
  title: Joi.string().trim().max(255).optional()
});

const getSessionsSchema = Joi.object({
  userId: Joi.string().required(),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

const renameSessionSchema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().trim().min(1).max(255).required()
});

const favoriteSchema = Joi.object({
  id: Joi.number().integer().required(),
  isFavorite: Joi.boolean().required()
});

const deleteSessionsSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = { createSessionSchema, getSessionsSchema, renameSessionSchema, favoriteSchema, deleteSessionsSchema };
