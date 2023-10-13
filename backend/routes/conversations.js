const router = require("express").Router()
const { 
  fetchConversations,
  fetchMessages,
  sendMessage,
  editMessage,
  createDM,
  deleteMessage,
  joinConversation,
  leaveConversation
} = require("../controllers/conversations")
const { sendMessageLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.post("/fetch", authentication, fetchConversations)
router.post("/messages", authentication, fetchMessages)
router.post("/sendMessage", authentication, sendMessage)
router.post("/editMessage", authentication, editMessage)
router.post("/deleteMessage", authentication, deleteMessage)
router.post("/createDM", authentication, createDM)

router.put("/joinConversation", authentication, joinConversation)
router.put("/leaveConversation", authentication, leaveConversation)

module.exports = router