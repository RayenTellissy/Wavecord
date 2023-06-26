const {
   createUserWithEmailAndPassword, 
   signInWithEmailAndPassword, 
   getAuth,
   sendPasswordResetEmail
   
  } = require("firebase/auth")
const { app } = require("../Firebase/FirebaseApp")

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const auth = getAuth()

module.exports = {

  signup: async (req,res) => {

    try{
      const { username, email, password } = req.body

      const response = await createUserWithEmailAndPassword(auth, email, password)
      const id = response.user.uid

      console.log(id)
  
      await prisma.users.create({ data: {
        id: id,
        username: username,
        email: email,
      }})

      // setting a cookie
      req.session.user = {
        id: id
      }
      res.send({
        success: true,
        message: "Signed Up."
      })
    }
    catch(error){
      console.log(error)
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
    }
  },

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

      // setting a cookie
      req.session.user = {
        id: response.user.uid
      }

      console.log(req.session)

      res.send({
        success: true,
        message: "Logged in.",
        id: response.user.uid,
        token: response.user.stsTokenManager.accessToken
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
  }
}