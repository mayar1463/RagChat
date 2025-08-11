const Joi = require('joi');

const addMessageSchema = Joi.object({
  sessionId: Joi.number().integer().required(),
  sender: Joi.string().valid('user', 'assistant').required(),
  content: Joi.string().min(1).required(),
  context: Joi.alternatives().try(Joi.object(), Joi.string(), Joi.allow(null)).optional()
});

const getMessagesSchema = Joi.object({
  sessionId: Joi.number().integer().required(),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

module.exports = { addMessageSchema, getMessagesSchema };
