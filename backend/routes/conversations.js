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
router.post("/messages", authentication, fetchMessages)
router.post("/fetchOtherUsers", authentication, fetchOtherUsers)
router.post("/sendMessage", authentication, sendMessageLimit, sendMessage)
router.post("/createDM", createDM)

module.exports = router