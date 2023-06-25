const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const connect = async () => {
  await prisma.$connect()
  console.log("Connected to database.")
}

module.exports = connect