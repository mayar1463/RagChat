// src/validations/session.validation.js
const Joi = require('joi');

const createSessionSchema = Joi.object({
  userId: Joi.alternatives().try(
    Joi.string().trim().min(1).max(50),
    Joi.number().integer().min(1)
  ).required(),
  title: Joi.string().trim().max(255).optional()
});

const renameSessionSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required()
});

const favoriteSchema = Joi.object({
  isFavorite: Joi.boolean().required()
});

module.exports = { createSessionSchema, renameSessionSchema, favoriteSchema };
