const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// function to invoke in the server to connect database
const connect = async () => {
  await prisma.$connect()
  console.log("Connected to database.")
}

module.exports = { connect, prisma }