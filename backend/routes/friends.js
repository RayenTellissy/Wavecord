const router = require("express").Router()
const { 
  fetchOnlineFriends, 
  fetchAllFriends, 
  addFriend, 
  fetchPending, 
  acceptFriendRequest 
} = require("../controllers/friends")

router.get("/fetchPending/:id", fetchPending)

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.post("/fetchAllFriends", fetchAllFriends)
router.post("/addFriend", addFriend)
router.post("/acceptFriendRequest", acceptFriendRequest)

module.exports = router