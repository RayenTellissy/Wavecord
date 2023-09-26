const router = require("express").Router()
const {
  createDirectMessageNotification,
  fetchAllNotifications,
  removeDirectMessageNotification
} = require("../controllers/notifications")

router.get("/fetchAllNotifications/:id", fetchAllNotifications)

router.post("/createDirectMessageNotification", createDirectMessageNotification)
router.post("/removeDirectMessageNotification", removeDirectMessageNotification)

module.exports = router