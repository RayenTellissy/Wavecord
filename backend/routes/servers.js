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
} = require("../controllers/servers")
const { createLimit, joinLimit, deleteLimit, leaveLimit } = require("../middleware/serverLimiter")
const authentication = require("../middleware/authentication")

router.get("/fetchByUser/:id", fetchByUser)
router.get("/fetch/:id", fetch)
router.get("/count/:id", count)
router.get("/fetchUsersByRoles/:serverId", fetchUsersByRoles)
router.get("/fetchServerRoles/:serverId", fetchServerRoles)
router.get("/fetchMembers/:serverId", fetchMembers)
router.get("/fetchOnlyRoles/:serverId", fetchOnlyRoles)
router.get("/fetchBannedUsers/:serverId", fetchBannedUsers)
router.get("/fetchUsersInRoom/:channelId", fetchUsersInRoom)

router.post("/create/:id", createServer)
router.post("/join", joinServer)
router.post("/createCategory", createCategory)
router.post("/createTextChannel", createTextChannel)
router.post("/createVoiceChannel", createVoiceChannel)
router.post("/fetchTextChannelMessages", fetchTextChannelMessages)
router.post("/sendMessage", sendMessage)
router.post("/deleteMessage", deleteMessage)
router.post("/createRole", createRole)
router.post("/giveRole", giveRole)
router.post("/kickUser", kickUser)
router.post("/banUser", banUser)
router.post("/unbanUser", unbanUser)
router.post("/joinVoiceRoom", joinVoiceRoom)
router.post("/leaveVoiceRoom", leaveVoiceRoom)
router.post("/leaveServer", leaveServer)
router.post("/deleteServer", deleteServer)

router.put("/resetServerLink", resetServerLink)
router.put("/changeServerImage", changeServerImage)
router.put("/changeServerName", changeServerName)
router.put("/removeRoleFromUser", removeRoleFromUser)

router.delete("/removeRole/:roleId", removeRole)

module.exports = router