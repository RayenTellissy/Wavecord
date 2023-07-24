const router = require("express").Router()
const { fetchOnlineFriends, fetchAllFriends } = require("../controllers/friends")

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.get("/fetchAllFriends/:id", fetchAllFriends)

module.exports = router