const router = require("express").Router()
const { 
  fetchConversations,
  fetchMessages,
  fetchOtherUsers,
  sendMessage,
  createDM,
  deleteMessage
} = require("../controllers/conversations")
const { sendMessageLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.post("/fetch", fetchConversations)
router.post("/messages", fetchMessages)
router.post("/sendMessage", sendMessage)
router.post("/deleteMessage", deleteMessage)
router.post("/createDM", createDM)

module.exports = router