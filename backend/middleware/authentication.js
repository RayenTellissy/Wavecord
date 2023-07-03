const authentication = ( req, res, next ) => {
  if(!req.session.user){
    console.log(req.session)
    return res.send("Unauthorized.")
  }
  next()
}

module.exports = authentication