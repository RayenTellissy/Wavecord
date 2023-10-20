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
const { addFriendLimit, removeFriendLimit, blockUserLimit, unblockUserLimit, acceptFriendRequestLimit } = require("../middleware/friendsLimiter")

router.get("/fetchPending/:id", authentication, fetchPending)
router.get("/removeRequest/:id", authentication, removeRequest)
router.get("/fetchBlocks/:id", authentication, fetchBlocks)
router.get("/fetchFriendsWithNoConversations/:id", authentication, fetchFriendsWithNoConversation)

router.post("/fetchOnlineFriends", authentication, fetchOnlineFriends)
router.post("/fetchAllFriends", authentication, fetchAllFriends)
router.post("/addFriend", addFriendLimit, authentication, addFriend)
router.post("/removeFriend", removeFriendLimit, authentication, removeFriend)
router.post("/acceptFriendRequest", acceptFriendRequestLimit, authentication, acceptFriendRequest)
router.post("/blockUser", blockUserLimit, authentication, blockUser)
router.post("/unblockUser", unblockUserLimit, authentication, unblockUser)

module.exports = router