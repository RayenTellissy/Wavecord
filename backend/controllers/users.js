const {
   createUserWithEmailAndPassword, 
   signInWithEmailAndPassword, 
   sendPasswordResetEmail,
  } = require("firebase/auth")

const { prisma } = require("../prisma/connection")
const { auth } = require("../Firebase/FirebaseApp")
const jwt = require("jsonwebtoken") 
require("dotenv").config()

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

      jwt.sign({
        id: id,
        username: username
      }, process.env.JWT_SECRET, { expiresIn: "7d" },
      (error,token) => {
        if(error) return res.send({ loggedIn: false, status: "Something went wrong." })
        res.send({ loggedIn: true, token, success: true, message: "Signed up."})
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

      jwt.sign({
        id: response.user.uid
      }, process.env.JWT_SECRET, { expiresIn: "15s" },
      (error,token) => {
        if(error) return res.send({ loggedIn: false, status: "Something went wrong." })
        res.send({ loggedIn: true, id: response.user.uid, token, success: true, message: "Logged in."})
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

  // function to check for cookie on each render
  authenticateSession: async (req,res) => {
    const token = req.headers["authorization"]?.split(" ")[1]

    if(!token) {
      return res.send({ loggedIn: false })
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET)

    jwt.verify(token, process.env.JWT_SECRET, async (error, token) => {
      if(error) return res.send({ loggedIn: false })
      res.send({
        loggedIn: true,
        token,
        id: decoded.id
      })
    })
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

  fetchUserbar: async (req,res) => {
    try {
      const { id } = req.params

      const result = await prisma.users.findFirst({
        where: {
          id
        },
        select: {
          username: true,
          image: true,
          status: true
        }
      })

      res.send(result)
    }
    catch(error){
      console.log(error)
    }
  }

}