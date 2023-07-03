const rateLimit = require("express-rate-limit")

module.exports = {

  loginLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 10
  }),

  signupLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 3
  }),

  logoutLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour,
    max: 5
  }),

  resetLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 2
  })
}