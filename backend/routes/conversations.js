const router = require("express").Router()
const { fetchConversations, fetchMessages, fetchOtherUsers } = require("../controllers/conversations")

router.get("/fetch/:id", fetchConversations)
router.get("/messages/:id", fetchMessages)

router.post("/fetchOtherUsers", fetchOtherUsers)

module.exports = router