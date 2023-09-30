const router = require("express").Router()
const { 
  fetchOnlineFriends, 
  fetchAllFriends, 
  addFriend, 
  fetchPending, 
  acceptFriendRequest, 
  removeRequest,
  blockUser,
  fetchBlocks,
  unblockUser,
  removeFriend,
  fetchFriendsWithNoConversation
} = require("../controllers/friends")
const authentication = require("../middleware/authentication")

router.get("/fetchPending/:id", authentication, fetchPending)
router.get("/removeRequest/:id", authentication, removeRequest)
router.get("/fetchBlocks/:id", authentication, fetchBlocks)
router.get("/fetchFriendsWithNoConversations/:id", authentication, fetchFriendsWithNoConversation)

router.post("/fetchOnlineFriends", authentication, fetchOnlineFriends)
router.post("/fetchAllFriends", authentication, fetchAllFriends)
router.post("/addFriend", authentication, addFriend)
router.post("/removeFriend", authentication, removeFriend)
router.post("/acceptFriendRequest", authentication, acceptFriendRequest)
router.post("/blockUser", authentication, blockUser)
router.post("/unblockUser", authentication, unblockUser)

module.exports = router