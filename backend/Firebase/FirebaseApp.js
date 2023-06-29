require("dotenv").config()
const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")


const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()

module.exports = { auth }