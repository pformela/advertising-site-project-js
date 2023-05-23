const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after 1 minute",
  },
  standardHeaders: true,
  leagcyHeaders: true,
});

module.exports = loginLimiter;
