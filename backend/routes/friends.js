const router = require("express").Router()
const { fetchFriends } = require("../controllers/friends")

router.get("/fetchFriends/:id", fetchFriends)

module.exports = router