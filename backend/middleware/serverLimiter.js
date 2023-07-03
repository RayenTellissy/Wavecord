const rateLimit = require("express-rate-limit")

module.exports = {
  
  createLimit: rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    max: 1
  }),

  joinLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 5
  }),

  deleteLimit: rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    max: 2
  }),

  leaveLimit: rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    max: 5
  })
}