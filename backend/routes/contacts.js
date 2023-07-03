const router = require('express').Router()
const { fetchContacts } = require('../controllers/contacts')
const authentication = require("../middleware/authentication")

router.get("/fetch/:id", authentication, fetchContacts)

module.exports = router