const router = require("express").Router()
const { 
  fetchByUser, 
  fetch, 
  createServer, 
  leaveServer, 
  joinServer, 
  count, 
  deleteServer, 
  createTextChannel,
  createCategory,
  createVoiceChannel,
  fetchTextChannelMessages,
  sendMessage,
  fetchUsersByRoles,
  resetServerLink,
  changeServerImage,
  changeServerName,
  fetchServerRoles,
  removeRole,
  createRole,
  fetchMembers,
  fetchOnlyRoles,
  giveRole,
  removeRoleFromUser,
  kickUser,
  fetchBannedUsers,
  banUser,
  unbanUser,
  joinVoiceRoom,
  leaveVoiceRoom,
  fetchUsersInRoom,
  deleteMessage,
  fetchUserRole,
} = require("../controllers/servers")
const { createLimit, joinLimit, deleteLimit, leaveLimit } = require("../middleware/serverLimiter")
const authentication = require("../middleware/authentication")

router.get("/fetchByUser/:id", authentication, fetchByUser)
router.get("/count/:id", authentication, count)
router.get("/fetchUsersByRoles/:serverId", authentication, fetchUsersByRoles)
router.get("/fetchServerRoles/:serverId", authentication, fetchServerRoles)
router.get("/fetchMembers/:serverId", authentication, fetchMembers)
router.get("/fetchOnlyRoles/:serverId", authentication, fetchOnlyRoles)
router.get("/fetchBannedUsers/:serverId", authentication, fetchBannedUsers)
router.get("/fetchUsersInRoom/:channelId", authentication, fetchUsersInRoom)

router.post("/fetch", authentication, fetch)
router.post("/create/:id", authentication, createServer)
router.post("/join", authentication, joinServer)
router.post("/createCategory", authentication, createCategory)
router.post("/createTextChannel", authentication, createTextChannel)
router.post("/createVoiceChannel", authentication, createVoiceChannel)
router.post("/fetchTextChannelMessages", authentication, fetchTextChannelMessages)
router.post("/sendMessage", authentication, sendMessage)
router.post("/deleteMessage", authentication, deleteMessage)
router.post("/createRole", authentication, createRole)
router.post("/giveRole", authentication, giveRole)
router.post("/kickUser", authentication, kickUser)
router.post("/banUser", authentication, banUser)
router.post("/unbanUser", authentication, unbanUser)
router.post("/joinVoiceRoom", authentication, joinVoiceRoom)
router.post("/leaveVoiceRoom", authentication, leaveVoiceRoom)
router.post("/leaveServer", authentication, leaveServer)
router.post("/deleteServer", authentication, deleteServer)

router.put("/resetServerLink", authentication, resetServerLink)
router.put("/changeServerImage", authentication, changeServerImage)
router.put("/changeServerName", authentication, changeServerName)
router.put("/removeRoleFromUser", authentication, removeRoleFromUser)

router.delete("/removeRole/:roleId", authentication, removeRole)

module.exports = router