const rateLimit = require("express-rate-limit")

module.exports = {

  loginLimit: rateLimit({
    windowMs: 1000 * 60 * 30, // 30 minutes
    max: 10
  }),

  signupLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 3
  }),

  resetLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 2
  })
}