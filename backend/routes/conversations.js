const router = require("express").Router()
const { fetchConversations, fetchMessages } = require("../controllers/conversations")

router.get("/fetch/:id", fetchConversations)
router.get("/messages/:id", fetchMessages)

module.exports = router