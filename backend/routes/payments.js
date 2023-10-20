const router = require("express").Router()
const { createSession, webhook } = require("../controllers/payments")

const authentication = require("../middleware/authentication")
const { createSessionLimit } = require("../middleware/paymentsLimiter")

router.post("/createSession", createSessionLimit, authentication, createSession)
router.post("/webhook", webhook)

module.exports = router