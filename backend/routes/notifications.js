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
const authentication = require("../middleware/authentication")

router.get("/fetchAllNotifications/:id", authentication, fetchAllNotifications)
router.get("/fetchDirectMessageNotifications/:id", authentication, fetchDirectMessageNotifications)
router.get("/fetchFriendRequestNotifications/:id", authentication, fetchFriendRequestNotifications)

router.post("/createDirectMessageNotification", authentication, createDirectMessageNotification)
router.post("/removeDirectMessageNotification", authentication, removeDirectMessageNotification)
router.post("/createFriendRequestNotification", authentication, createFriendRequestNotification)
router.post("/removeFriendRequestNotification", authentication, removeFriendRequestNotification)

module.exports = router