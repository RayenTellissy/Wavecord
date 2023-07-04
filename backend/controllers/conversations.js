const { prisma } = require("../prisma/connection")

module.exports = {
  
  fetchConversations: async (req,res) => {
    try {
      const { id } = req.params

      const result = await prisma.conversations.findMany({
        where: {
          users: {
            some: {
              id: id
            }
          }
        },
        select: {
          id: true,
          users: {
            where: {
              id: {
                not: id
              }
            }
          },
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchMessages: async (req,res) => {
    try {
      const { id } = req.params // conversation's id

      const result = await prisma.directMessages.findMany({
        where: {
          conversationsId: id
        },
        include: {
          usersId: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}