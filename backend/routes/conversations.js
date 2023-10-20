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
const { sendMessageLimit, editMessageLimit, deleteMessageLimit, createDMLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.post("/fetch", authentication, fetchConversations)
router.post("/messages", authentication, fetchMessages)
router.post("/sendMessage", sendMessageLimit, authentication, sendMessage)
router.post("/editMessage", editMessageLimit, authentication, editMessage)
router.post("/deleteMessage", deleteMessageLimit, authentication, deleteMessage)
router.post("/createDM", createDMLimit, authentication, createDM)

router.put("/joinConversation", authentication, joinConversation)
router.put("/leaveConversation", authentication, leaveConversation)

module.exports = router