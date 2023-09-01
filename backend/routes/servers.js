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
  removeRole
} = require("../controllers/servers")
const { createLimit, joinLimit, deleteLimit, leaveLimit } = require("../middleware/serverLimiter")
const authentication = require("../middleware/authentication")

router.get("/fetchByUser/:id", authentication, fetchByUser)
router.get("/fetch/:id", fetch)
router.get("/count/:id", authentication, count)
router.get("/fetchUsersByRoles/:serverId", fetchUsersByRoles)
router.get("/fetchServerRoles/:serverId", fetchServerRoles)

router.post("/create/:id", createServer)
router.post("/join", authentication, joinLimit, joinServer)
router.post("/createCategory", createCategory)
router.post("/createTextChannel", createTextChannel)
router.post("/createVoiceChannel", createVoiceChannel)
router.post("/fetchTextChannelMessages", fetchTextChannelMessages)
router.post("/sendMessage", sendMessage)

router.put("/resetServerLink", resetServerLink)
router.put("/changeServerImage", changeServerImage)
router.put("/changeServerName", changeServerName)

router.delete("/leave", authentication, leaveLimit, leaveServer)
router.delete("/delete", deleteServer)
router.delete("/removeRole/:roleId", removeRole)

module.exports = router