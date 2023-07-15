const rateLimit = require("express-rate-limit")

module.exports = {
  sendMessageLimit: rateLimit({
    windowMs: 1000 * 15, // 15 seconds
    max: 10
  })
  
}