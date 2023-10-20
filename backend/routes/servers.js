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
  editMessage,
  removeTextChannel,
  removeVoiceChannel,
  renameTextChannel,
  renameVoiceChannel,
} = require("../controllers/servers")
const {
  createLimit,
  joinLimit,
  deleteLimit,
  leaveLimit,
  createCategoryLimit,
  updateChannelLimit,
  sendMessageLimit,
  editMessageLimit,
  deleteMessageLimit,
  createRoleLimit,
  giveRoleLimit,
  kickUserLimit,
  banUserLimit,
  unbanUserLimit,
  resetServerLinkLimit,
  changeServerImageLimit,
  changeServerNameLimit,
  removeRoleFromUserLimit
} = require("../middleware/serverLimiter")
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
router.post("/create/:id", createLimit, authentication, createServer)
router.post("/join", joinLimit, authentication, joinServer)
router.post("/createCategory", createCategoryLimit, authentication, createCategory)
router.post("/createTextChannel", updateChannelLimit, authentication, createTextChannel)
router.post("/createVoiceChannel", updateChannelLimit, authentication, createVoiceChannel)
router.post("/removeTextChannel", updateChannelLimit,authentication, removeTextChannel)
router.post("/removeVoiceChannel", updateChannelLimit,authentication, removeVoiceChannel)
router.post("/renameTextChannel", updateChannelLimit,authentication, renameTextChannel)
router.post("/renameVoiceChannel", updateChannelLimit,authentication, renameVoiceChannel)
router.post("/fetchTextChannelMessages", authentication, fetchTextChannelMessages)
router.post("/sendMessage", sendMessageLimit, authentication, sendMessage)
router.post("/editMessage", editMessageLimit, authentication, editMessage)
router.post("/deleteMessage", deleteMessageLimit, authentication, deleteMessage)
router.post("/createRole", createRoleLimit, authentication, createRole)
router.post("/giveRole", giveRoleLimit, authentication, giveRole)
router.post("/kickUser", kickUserLimit, authentication, kickUser)
router.post("/banUser", banUserLimit,  authentication, banUser)
router.post("/unbanUser", unbanUserLimit, authentication, unbanUser)
router.post("/joinVoiceRoom", authentication, joinVoiceRoom)
router.post("/leaveVoiceRoom", authentication, leaveVoiceRoom)
router.post("/leaveServer", leaveLimit, authentication, leaveServer)
router.post("/deleteServer", deleteLimit, authentication, deleteServer)

router.put("/resetServerLink", resetServerLinkLimit, authentication, resetServerLink)
router.put("/changeServerImage", changeServerImageLimit, authentication, changeServerImage)
router.put("/changeServerName", changeServerNameLimit, authentication, changeServerName)
router.put("/removeRoleFromUser", removeRoleFromUserLimit, authentication, removeRoleFromUser)

router.delete("/removeRole/:roleId", removeRoleFromUserLimit, authentication, removeRole)

module.exports = router