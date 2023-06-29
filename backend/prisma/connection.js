const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// function to invoke in the server to connect database
const connect = async () => {
  try {
    await prisma.$connect()
    console.log("Connected to database.")
  }
  catch(error){
    console.log(error)
  }
}

module.exports = { connect, prisma }