const router = require("express").Router()
const { fetchConversations, fetchMessages, fetchOtherUsers, sendMessage } = require("../controllers/conversations")
const { sendMessageLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.get("/fetch/:id", authentication, fetchConversations)

router.post("/messages", authentication, fetchMessages)
router.post("/fetchOtherUsers", authentication, fetchOtherUsers)
router.post("/sendMessage", authentication, sendMessageLimit, sendMessage)

module.exports = router