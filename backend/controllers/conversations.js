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

      const result = await prisma.conversations.findFirst({
        where: {
          id: id
        },
        include: {
          users: true,
          DirectMessages: {
            include: {
              usersId: {
                select: {
                  username: true,
                  image: true
                }
              }
            }
          }
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchOtherUsers: async (req,res) => {
    try {
      const { userId, conversationId } = req.body // conversation's id

      const result = await prisma.conversations.findFirst({
        where: {
          id: conversationId
        },
        select: {
          users: {
            where: {
              id: {
                not: userId
              }
            }
          }
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  sendMessage: async (req,res) => {
    try {
      const { conversationId, senderId, message, type } = req.body

      const result = await prisma.directMessages.create({
        data: {
          sender: senderId,
          conversationsId: conversationId,
          message: message,
          type: type
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}