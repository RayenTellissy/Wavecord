require("dotenv").config()
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth")

const { prisma } = require("../prisma/connection")
const { auth } = require("../Firebase/FirebaseApp")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens")
const admin = require("../Firebase/admin")

module.exports = {

  // function to create an account
  signup: async (req, res) => {

    try {
      const { username, email, password } = req.body

      const usernameExists = await prisma.users.findFirst({
        where: {
          username
        }
      })
      if (usernameExists) return res.send({
        success: false,
        message: "Username already in use."
      })

      const response = await createUserWithEmailAndPassword(auth, email, password)
      const id = response.user.uid

      await prisma.users.create({
        data: {
          id: id,
          username: username,
          email: email,
        }
      })

      const accessToken = generateAccessToken({ id })
      const refreshToken = generateRefreshToken({ id })
      
      // creating a secure httpOnly Cookie for accessToken
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })

      // creating a secure httpOnly cookie to store the refresh token and persist it
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 5
      })

      // creating a httpOnly cookie for user's id
      res.cookie("id", id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 5 })
      
      res.send({
        loggedIn: true,
        id,
        username,
        email,
        image: null,
        status: "ONLINE",
        success: true,
        message: "Signed up."
      })
    }
    catch (error) {
      const errorCode = error.code

      if (errorCode === "auth/email-already-in-use") {
        res.send({
          success: false,
          message: "Email already in use."
        })
      }
      else if (errorCode === "auth/invalid-email") {
        res.send({
          success: false,
          message: "Invalid Email."
        })
      }
      else if (errorCode === "auth/weak-password") {
        res.send({
          success: false,
          message: "Weak Password."
        })
      }
    }
  },

  // function to authenticate the user
  login: async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await prisma.users.findFirst({
        where: {
          username: username
        }
      })

      // if there is not user with the username written it will return an 
      if (user === null) {
        return res.send({
          success: false,
          message: "User not found."
        })
      }
      const email = user.email

      const response = await signInWithEmailAndPassword(auth, email, password)

      const accessToken = generateAccessToken({ id: response.user.uid })
      const refreshToken = generateRefreshToken({ id: response.user.uid })

      // creating a secure httpOnly Cookie for accessToken
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })

      // creating a secure httpOnly cookie to store the refresh token and persist it
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 5
      })

      // creating a httpOnly cookie for user's id
      res.cookie("id", user.id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 5 })

      res.send({
        loggedIn: true,
        id: response.user.uid,
        username: user.username,
        image: user.image,
        email: user.email,        
        success: true,
        message: "Logged in."
      })
    }
    catch (error) {
      const errorCode = error.code

      if (errorCode === "auth/wrong-password") {
        res.send({
          success: false,
          message: "Wrong Password."
        })
      }
      else if (errorCode === "auth/user-disabled") {
        res.send({
          success: false,
          message: "Account is banned."
        })
      }
      else if (errorCode === "auth/user-not-found") {
        res.send({
          success: false,
          message: "User not found."
        })
      }
      else if (errorCode === "auth/invalid-email") {
        res.send({
          success: false,
          message: "Invalid email."
        })
      }
    }
  },

  providerLogin: async (req, res) => {
    try {
      const { id } = req.params

      const user = await prisma.users.findFirst({
        where: {
          id
        }
      })

      if (!user) {
        return res.send({
          success: false,
        })
      }

      const accessToken = generateAccessToken({ id })
      const refreshToken = generateRefreshToken({ id })

      // creating a secure httpOnly Cookie for accessToken
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })

      // creating a secure httpOnly cookie to store the refresh token and persist it
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 5
      })

      // creating a httpOnly cookie for user's id
      res.cookie("id", id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 5 })

      res.send({
        loggedIn: true,
        id: user.id,
        username: user.username,
        image: user.image,
        email: user.email,
        success: true,
        message: "Logged in."
      })
    }
    catch (error) {
      res.send(error)
    }
  },

  providerSignup: async (req, res) => {
    try {
      const { id, username, email } = req.body

      const user = await prisma.users.create({
        data: {
          id,
          username,
          email
        }
      })

      const accessToken = generateAccessToken({ id })
      const refreshToken = generateRefreshToken({ id })

      // creating a secure httpOnly Cookie for accessToken
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })

      // creating a secure httpOnly cookie to store the refresh token and persist it
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 5
      })

      // creating a httpOnly cookie for user's id
      res.cookie("id", id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 5 })

      res.send({
        loggedIn: true,
        id: user.id,
        username: user.username,
        image: user.image,
        email: user.email,
        success: true,
        message: "Logged in."
      })
    }
    catch (error) {
      res.send(error)
    }
  },


  // logout function
  logout: (req, res) => {
    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" })
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" })
    res.clearCookie("id", { httpOnly: true, secure: true, sameSite: "none" })
  
    res.send({
      success: true,
      message: "Logged out successfully."
    })
  },

  // function to reset password
  reset: async (req, res) => {
    try {
      const { email } = req.body

      await sendPasswordResetEmail(auth, email)

      res.send({
        success: true,
        message: "Reset link sent."
      })
    }
    catch (error) {
      const errorCode = error.code

      if (errorCode === "auth/invalid-email") {
        res.send({
          success: false,
          message: "Invalid email."
        })
      }
      else if (errorCode === "auth/user-not-found") {
        res.send({
          success: false,
          message: "User not found."
        })
      }
    }
  },

  authenticateSession: async (req, res) => {
    try {
      const { id } = req.cookies

      const user = await prisma.users.findFirst({
        where: {
          id
        },
        select: {
          username: true,
          image: true,
          email: true
        }
      })

      res.send({
        loggedIn: true,
        id,
        username: user.username,
        image: user.image,
        email: user.email
      })
    }
    catch (error) {
      return res.send({ error: 'An error occurred while fetching user data' })
    }
  },

  // function to change the user's status on the app
  setStatus: async (req, res) => {
    try {
      const { id } = req.cookies
      const { status } = req.body

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
    catch (error) {
      res.send(error)
    }
  },

  // function to change the user's username from settings on the client
  changeUsername: async (req,res) => {
    try {
      const { newUsername, id, password, email } = req.body

      await signInWithEmailAndPassword(auth, email, password)

      const usernameCheck = await prisma.users.findFirst({
        where: {
          username: newUsername
        }
      })

      if(usernameCheck) return res.send({ error: "Username already exists.", code: "EXISTS" })

      await prisma.users.update({
        where: {
          id
        },
        data: {
          username: newUsername
        }
      })

      res.send({ success: true })
    }
    catch(error){
      if(error.code === "auth/wrong-password"){
        return res.send({ error: "Wrong Password", code: "INCPWD" })
      }
      res.send(error)
    }
  },

  // function to change the user's password from settings on the client
  changePassword: async (req,res) => {
    try {
      const { id, email, password, newPassword } = req.body

      await signInWithEmailAndPassword(auth, email, password)

      const result = await admin.auth().updateUser(id, {
        password: newPassword
      })

      res.send(result)
    }
    catch(error){
      if(error.code === "auth/wrong-password"){
        return res.send({ error: "Wrong Password", code: "INCPWD" })
      }
      res.send(error)
    }
  },

  changeAvatar: async (req,res) => {
    try {
      const { id, imageUrl } = req.body

      await prisma.users.update({
        where: {
          id
        },
        data: {
          image: imageUrl
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  removeAccount: async (req,res) => {
    try {
      const { id, email, password } = req.body

      await signInWithEmailAndPassword(auth, email, password)

      const user = await prisma.users.findFirst({
        where: {
          id
        },
        include: {
          servers_created: true
        }
      })

      // if user currently owns servers return an error 
      if(user.servers_created.length !== 0) return res.send({ success: false, code: "OS" })

      await admin.auth().deleteUser(id) // deleting the user from firebase authentication
      await prisma.users.delete({
        where: {
          id
        }
      })

      res.send({ success: true })
    }
    catch(error){
      if(error.code === "auth/wrong-password"){
        return res.send({ success: false, code: "INCPWD" })
      }
      res.send(error)
    }
  }
}