const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30s" })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "5d" })
}

module.exports = { generateAccessToken, generateRefreshToken }