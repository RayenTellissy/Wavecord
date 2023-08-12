const router = require("express").Router()
const { 
  fetchOnlineFriends, 
  fetchAllFriends, 
  addFriend, 
  fetchPending, 
  acceptFriendRequest, 
  removeRequest,
  blockUser,
  fetchBlocks
} = require("../controllers/friends")

router.get("/fetchPending/:id", fetchPending)
router.get("/removeRequest/:id", removeRequest)
router.get("/fetchBlocks/:id", fetchBlocks)

router.post("/fetchOnlineFriends", fetchOnlineFriends)
router.post("/fetchAllFriends", fetchAllFriends)
router.post("/addFriend", addFriend)
router.post("/acceptFriendRequest", acceptFriendRequest)
router.post("/blockUser", blockUser)

module.exports = router