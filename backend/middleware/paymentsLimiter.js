const rateLimit = require("express-rate-limit")

module.exports = {
  createSessionLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 1 minute
    max: 20
  })
}