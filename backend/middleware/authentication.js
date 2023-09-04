const jwt = require("jsonwebtoken")

const authentication = ( req, res, next ) => {
  const token = req.headers.authorization

  if(!token) return res.send({ error: "Unauthorized" })
  
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  }
  catch(error){
    res.send({ error: "Invalid Token" })
  }

}

module.exports = authentication