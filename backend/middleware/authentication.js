require("dotenv").config()
const jwt = require("jsonwebtoken")
const { generateAccessToken } = require("../utils/generateTokens")

// middleware to check for a valid access token before sending the request
const authentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies

  try {
    // verifiying the access token
    jwt.verify(accessToken, process.env.JWT_SECRET)
    next()
  }
  catch(error){
    // if the access token is expired verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, decoded) => {
      if(error){
        return res.send({ error: "Invalid Refresh Token" })
      }

      // generating a new access token
      const newAccessToken = generateAccessToken({ id: decoded.id })

      // creating an httpOnly cookie to store the new access token
      res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict" })
        
      next()
    })
  }
}

module.exports = authentication
