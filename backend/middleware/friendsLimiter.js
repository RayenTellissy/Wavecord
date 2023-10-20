const rateLimit = require("express-rate-limit")

module.exports = {
  addFriendLimiter: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 15
  })
}