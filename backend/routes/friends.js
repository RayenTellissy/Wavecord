const router = require("express").Router()
const { fetchOnlineFriends, fetchAllFriends, addFriend } = require("../controllers/friends")

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.post("/fetchAllFriends", fetchAllFriends)
router.post("/addFriend", addFriend)

module.exports = router