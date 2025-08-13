// middlewares/validator.middleware.js
const Joi = require('joi'); // Don't forget to import Joi

const validator = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req[property]);
  if (error) {
    const message = error.details.map(i => i.message).join(',');
    return res.status(400).json({ error: message });
  }
  next();
};

module.exports = validator;