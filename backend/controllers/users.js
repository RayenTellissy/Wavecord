require("dotenv").config()
const {
   createUserWithEmailAndPassword, 
   signInWithEmailAndPassword, 
   sendPasswordResetEmail,
  } = require("firebase/auth")

const { prisma } = require("../prisma/connection")
const { auth } = require("../Firebase/FirebaseApp")
const jwt = require("jsonwebtoken") 
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens")

module.exports = {

  // function to create an account
  signup: async (req,res) => {

    try{
      const { username, email, password } = req.body

      const response = await createUserWithEmailAndPassword(auth, email, password)
      const id = response.user.uid

      await prisma.users.create({ 
        data: {
          id: id,
          username: username,
          email: email,
      }})

      const token = generateAccessToken({ id })
      const refreshToken = generateRefreshToken({ id })

      res.send({
        loggedIn: true,
        id: id,
        username: username,
        image: null,
        status: "ONLINE",
        token,
        refreshToken,
        success: true,
        message: "Signed up."
      })
    }
    catch(error){
      const errorCode = error.code

      if(errorCode === "auth/email-already-in-use"){
        res.send({
          success: false,
          message: "Email already in use."
        })
      }
      else if(errorCode === "auth/invalid-email"){
        res.send({
          success: false,
          message: "Invalid Email."
        })
      }
      else if(errorCode === "auth/weak-password"){
        res.send({
          success: false,
          message: "Weak Password."
        })
      }
      else if(errorCode === "P2002"){
        res.send({
          success: false,
          message: "Username already in use."
        })
      }
    }
  },

  // function to authenticate the user
  login: async (req,res) => {
    try{
      const { username, password } = req.body
  
      const user = await prisma.users.findFirst({
        where: {
          username: username
        }
      })

      // if there is not user with the username written it will return an 
      if(user === null){
        return res.send({
          success: false,
          message: "User not found."
        })
      }
      const email = user.email
  
      const response = await signInWithEmailAndPassword(auth, email, password)

      const token = generateAccessToken({ id: response.user.uid })
      const refreshToken = generateRefreshToken({ id: response.user.uid })

      res.send({
        loggedIn: true,
        id: response.user.uid,
        username: user.username,
        image: user.image,
        status: user.status,
        token,
        refreshToken,
        success: true,
        message: "Logged in."
      })
    }
    catch(error){
      const errorCode = error.code

      if(errorCode === "auth/wrong-password"){
        res.send({
          success: false,
          message: "Wrong Password."
        })
      }
      else if(errorCode === "auth/user-disabled"){
        res.send({
          success: false,
          message: "Account is banned."
        })
      }
      else if(errorCode === "auth/user-not-found"){
        res.send({
          success: false,
          message: "User not found."
        })
      }
      else if(errorCode === "auth/invalid-email"){
        res.send({
          success: false,
          message: "Invalid email."
        })
      }
    }
  },

  googleLogin: async (req,res) => {
    try {
      const { id } = req.params
      
      const result = await prisma.users.findFirst({
        where: {
          id: id
        },
        select: {
          id: true,
          username: true,
        }
      })

      if(!result){
        return res.send({
          success: false,
        })
      }

      req.session.user = {
        id: result.id,
        username: result.username
      }

      res.send({
        cookie: req.session,
        success: true,
        message: "Logged in."
      })
    }
    catch(error){
      res.send(error)
    }
  },

  googleSignup: async (req,res) => {
    try {
      const { id, username, email } = req.body
      
      await prisma.users.create({
        data: {
          id,
          username,
          email
        }
      })

      req.session.user = {
        id: id,
        username: username
      }

      res.send({
        cookie: req.session,        
        success: true,
        message: "Logged in."
      })
    }
    catch(error){
      res.send(error)
    }
  },

  // logout function
  logout: (req, res) => {
    try {
      req.session.destroy(err => {
        if(err){
          return res.send(err)
        }
      })
      res.send("logged out.")
    }
    catch(error){
      res.send(error)
    }
  },  
  
  // function to reset password
  reset: async (req,res) => {

    try{
      const { email } = req.body

      await sendPasswordResetEmail(auth, email)

      res.send({
        success: true,
        message: "Reset link sent."
      })
    }
    catch(error){
      const errorCode = error.code

      if(errorCode === "auth/invalid-email"){
        res.send({
          success: false,
          message: "Invalid email."
        })
      }
      else if(errorCode === "auth/user-not-found"){
        res.send({
          success: false,
          message: "User not found."
        })
      }
    }
  },

  authenticateSession: async (req, res) => {
    const accessToken = req.headers.authorization
    const refreshToken = req.headers["x-refresh-token"]

    if (!accessToken || !refreshToken){
      return res.send({ loggedIn: false })
    }

    const decoded = jwt.decode(accessToken, process.env.JWT_SECRET)
    const now = Date.now() / 1000

    // Checking if access token has expired
    if (decoded?.exp < now) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (error) => {
        if (error) {
          return res.send({ loggedIn: false })
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken({ id: decoded.id })

        try {
          const user = await prisma.users.findFirst({
            where: {
              id: decoded?.id
            },
            select: {
              username: true,
              image: true,
              status: true
            }
          })

          return res.send({
            loggedIn: true,
            token: newAccessToken,
            id: decoded.id,
            username: user.username,
            image: user.image,
            status: user.status
          })
        }
        catch(error){
          return res.send({ error: 'An error occurred while fetching user data' })
        }
      })
    }
    else {
      // access token hasn't expired, no need to refresh
      try {
        const user = await prisma.users.findFirst({
          where: {
            id: decoded?.id
          },
          select: {
            username: true,
            image: true,
            status: true
          }
        })

        return res.send({
          loggedIn: true,
          token: accessToken,
          id: decoded.id,
          username: user.username,
          image: user.image,
          status: user.status
        })
      }
      catch(error){
        return res.send({ error: 'An error occurred while fetching user data' })
      }
    }
  },

  // function to fetch user details
  fetch: async (req,res) => {
    try{
      const { id } = req.params

      const result = await prisma.users.findFirst({
        where: {
          id: id
        },
        include: {
          Friends: true,
          Conversations: true,
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  setStatus: async (req,res) => {
    try {
      const { id, status } = req.body

      const result = await prisma.users.update({
        where: {
          id
        },
        data: {
          status
        }
      })
      
      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}