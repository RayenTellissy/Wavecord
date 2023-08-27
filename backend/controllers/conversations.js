const { prisma } = require("../prisma/connection")

module.exports = {
  
  fetchConversations: async (req,res) => {
    try {
      const { id, query } = req.body

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
              AND: [
                {
                  id: {
                    not: id
                  }    
                },
                {
                  username: {
                    contains: query
                  }
                }
              ]
            }
          },
        }
      })

      const final = result.filter(e => e.users.length !== 0)

      res.send(final)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchMessages: async (req,res) => {
    try {
      const { userId, conversationId } = req.body // conversation's id

      const checkUser = await prisma.conversations.findFirst({
        where: {
          id: conversationId,
          users: {
            some: {
              id: userId
            }
          }
        }
      })
      if(!checkUser){
        return res.send({
          authorized: false
        })
      }

      const result = await prisma.conversations.findFirst({
        where: {
          id: conversationId
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
  },

  createDM: async (req,res) => {
    try {
      const { currentUser, otherUser } = req.body

      const conversationCheck = await prisma.conversations.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: currentUser
                }
              } 
            },
            {
              users: {
                some: {
                  id: otherUser
                }
              } 
            }
          ]
        }
      })
      if(conversationCheck) return res.send({ error: "Users already have a conversation." })

      const result = await prisma.conversations.create({
        data: {
          users: {
            connect: [
              { id: currentUser },
              { id: otherUser }
            ]
          },
          type: "DIRECT"
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}