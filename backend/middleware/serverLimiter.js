const rateLimit = require("express-rate-limit")

module.exports = {
  
  createLimit: rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    max: 2
  }),

  joinLimit: rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 10
  }),

  deleteLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 3
  }),

  leaveLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 5
  }),

  createCategoryLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 10
  }),

  updateChannelLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 15
  }),

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

  createRoleLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 15
  }),

  giveRoleLimit: rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 20
  }),

  kickUserLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 15
  }),

  banUserLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 15
  }),

  unbanUserLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 15
  }),

  resetServerLinkLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 5
  }),

  changeServerImageLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 4
  }),

  changeServerNameLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 4
  }),

  removeRoleFromUserLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20
  }),

  removeRoleLimit: rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 15
  })
}