const rateLimit = require("express-rate-limit")

module.exports = {
  sendMessageLimit: rateLimit({
    windowMs: 1000 * 15, // 15 seconds
    max: 10
  }),

  editMessageLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20
  }),

  deleteMessageLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 30
  }),

  createDMLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 5
  })
}