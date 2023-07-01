const router = require('express').Router()
const { fetchContacts } = require('../controllers/contacts')

router.get("/fetch/:id", fetchContacts)

module.exports = router