const rateLimit = require("express-rate-limit")

module.exports = {
  createTicketLimit: rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    max: 3
  })
}