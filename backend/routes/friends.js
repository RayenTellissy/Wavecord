const router = require("express").Router()
const { fetchOnlineFriends, fetchAllFriends, addFriend, fetchPending } = require("../controllers/friends")

router.get("/fetchPending/:id", fetchPending)

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.post("/fetchAllFriends", fetchAllFriends)
router.post("/addFriend", addFriend)

module.exports = router