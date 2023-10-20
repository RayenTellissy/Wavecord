const rateLimit = require("express-rate-limit")

module.exports = {
  changeUsernameLimit: rateLimit({
    windowMs: 1000 * 60 * 60 * 6, // 6 hours
    max: 2
  }),

  changePasswordLimit: rateLimit({
    windowMs: 1000 * 60 * 60 * 6, // 6 hours
    max: 3
  }),

  changeAvatarLimit: rateLimit({
    windowMs: 1000 * 60 * 60 * 6, // 6 hours
    max: 2
  }),
  
  removeAccountLimit: rateLimit({
    windowMs: 1000 * 60 * 60 * 6, // 6 hours
    max: 1
  })
}