const authentication = ( req, res, next ) => {
  if(!req.session.user){
    return res.send("Unauthorized")
  }
  next()
}

module.exports = authentication