const router = require("express").Router()
const { fetchConversations, fetchMessages, fetchOtherUsers, sendMessage } = require("../controllers/conversations")

router.get("/fetch/:id", fetchConversations)
router.get("/messages/:id", fetchMessages)

router.post("/fetchOtherUsers", fetchOtherUsers)
router.post("/sendMessage", sendMessage)

module.exports = router