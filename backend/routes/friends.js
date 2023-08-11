const router = require("express").Router()
const { 
  fetchOnlineFriends, 
  fetchAllFriends, 
  addFriend, 
  fetchPending, 
  acceptFriendRequest, 
  removeRequest
} = require("../controllers/friends")

router.get("/fetchPending/:id", fetchPending)
router.get("/removeRequest/:id", removeRequest)

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.post("/fetchAllFriends", fetchAllFriends)
router.post("/addFriend", addFriend)
router.post("/acceptFriendRequest", acceptFriendRequest)

module.exports = router