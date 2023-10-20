const rateLimit = require("express-rate-limit")

module.exports = {
  addFriendLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 15
  }),

  removeFriendLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 15
  }),

  acceptFriendRequestLimit: rateLimit({
    windowMs: 1000 * 60 * 1, // 1 minute
    max: 20
  }),

  blockUserLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 20
  }),

  unblockUserLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes,
    max: 20
  })
}