const router = require("express").Router()
const { createSession, webhook } = require("../controllers/payments")
const authentication = require("../middleware/authentication")

router.post("/createSession", authentication, createSession)
router.post("/webhook", webhook)

module.exports = router