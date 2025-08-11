const rateLimit = require('express-rate-limit');

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15;
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 100;

const limiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
