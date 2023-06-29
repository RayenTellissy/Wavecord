const { prisma } = require("../prisma/connection")

module.exports = {

  fetchByUser: async (req,res) => {

    const query = await prisma.users.findFirst()

    res.send(query)
  }
}