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
      const { username, email, image, password } = req.body

      const response = await createUserWithEmailAndPassword(auth,email,password)
      const id = response.user.uid
  
      const user = await prisma.users.create({ data: {
        id: id,
        username: username,
        email: email,
        image: image
      }})
  
      res.send(user)
    }
    catch(error){
      res.send(error)
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