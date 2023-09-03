const router = require("express").Router()
const { createTicket } = require("../controllers/bugReports")

router.post("/createTicket", createTicket)

module.exports = router