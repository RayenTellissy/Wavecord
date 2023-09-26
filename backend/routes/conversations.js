const router = require("express").Router()
const { 
  fetchConversations,
  fetchMessages,
  sendMessage,
  createDM,
  deleteMessage,
  joinConversation,
  leaveConversation
} = require("../controllers/conversations")
const { sendMessageLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.post("/fetch", fetchConversations)
router.post("/messages", fetchMessages)
router.post("/sendMessage", sendMessage)
router.post("/deleteMessage", deleteMessage)
router.post("/createDM", createDM)

router.put("/joinConversation", joinConversation)
router.put("/leaveConversation", leaveConversation)

module.exports = router