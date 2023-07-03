const router = require("express").Router()
const { fetchByUser, fetch, createServer, leaveServer, joinServer, count, deleteServer } = require("../controllers/servers")
const { createLimit, joinLimit, deleteLimit, leaveLimit } = require("../middleware/serverLimiter")
const authentication = require("../middleware/authentication")

router.get("/fetchByUser/:id", authentication, fetchByUser)
router.get("/fetch/:id", authentication, fetch)
router.get("/count/:id", authentication, count)

router.post("/create/:id", authentication, createLimit, createServer)
router.post("/join", authentication, joinLimit, joinServer)

router.delete("/leave", authentication, leaveLimit, leaveServer)
router.delete("/delete", authentication, deleteLimit, deleteServer)

module.exports = router