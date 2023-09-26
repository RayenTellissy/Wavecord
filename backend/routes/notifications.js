const router = require("express").Router()
const {
  createDirectMessageNotification,
  fetchAllNotifications,
  removeDirectMessageNotification,
  createFriendRequestNotification,
  removeFriendRequestNotification,
  fetchDirectMessageNotifications,
  fetchFriendRequestNotifications
} = require("../controllers/notifications")

router.get("/fetchAllNotifications/:id", fetchAllNotifications)
router.get("/fetchDirectMessageNotifications/:id", fetchDirectMessageNotifications)
router.get("/fetchFriendRequestNotifications/:id", fetchFriendRequestNotifications)

router.post("/createDirectMessageNotification", createDirectMessageNotification)
router.post("/removeDirectMessageNotification", removeDirectMessageNotification)
router.post("/createFriendRequestNotification", createFriendRequestNotification)
router.post("/removeFriendRequestNotification", removeFriendRequestNotification)

module.exports = router