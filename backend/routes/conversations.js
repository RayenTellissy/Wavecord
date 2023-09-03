const router = require("express").Router()
const { 
  fetchConversations,
  fetchMessages,
  fetchOtherUsers,
  sendMessage,
  createDM
} = require("../controllers/conversations")
const { sendMessageLimit } = require("../middleware/conversationLimiter")
const authentication = require("../middleware/authentication")

router.post("/fetch", fetchConversations)
router.post("/messages", fetchMessages)
router.post("/fetchOtherUsers", fetchOtherUsers)
router.post("/sendMessage", sendMessage)
router.post("/createDM", createDM)

module.exports = router