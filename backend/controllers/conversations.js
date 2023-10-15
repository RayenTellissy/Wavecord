const { prisma } = require("../prisma/connection")

module.exports = {
  
  fetchConversations: async (req,res) => {
    try {
      const { id } = req.body

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
          }
        },
        orderBy: {
          updated_at: "desc"
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
      const { conversationId, amount } = req.body
      
      const count = await prisma.directMessages.count({
        where: {
          conversationId
        }
      })
      
      const result = await prisma.conversations.findFirst({
        where: {
          id: conversationId
        },
        include: {
          users: true,
          DirectMessages: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  image: true
                }
              }
            },
            skip: amount >= count ? 0 : count - amount,
            take: amount,
            orderBy: {
              created_at: "asc"
            }
          }
        }
      })

      res.send({
        DirectMessages: result.DirectMessages,
        hasMore: count > amount,
        blockedConversation: result.blockedConversation
      })
    }
    catch(error){
      res.send(error)
    }
  },

  sendMessage: async (req,res) => {
    try {
      const { id, conversationId, senderId, message, type } = req.body

      // creating a message row with the details given
      const result = await prisma.directMessages.create({
        data: {
          id,
          senderId,
          conversationId,
          message,
          type
        }
      })
      
      // updating conversation updated_at field for accurate conversations sorting on the frontend
      await prisma.conversations.update({
        where: {
          id: conversationId
        },
        data: {
          updated_at: new Date()
        }
      })
      
      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  // function to edit an existing message
  editMessage: async (req,res) => {
    try {
      const { messageId, newMessage } = req.body

      await prisma.directMessages.update({
        where: {
          id: messageId
        },
        data: {
          message: newMessage,
          edited: true
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  // function to create a new conversation for 2 users
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

      const existingFriends = await prisma.friends.findFirst({
        where: {
          users: {
            every: {
              id: {
                in: [currentUser, otherUser]
              }
            }
          }
        }
      })

      const result = await prisma.conversations.create({
        data: {
          users: {
            connect: [
              { id: currentUser },
              { id: otherUser }
            ]
          },
          type: "DIRECT",
          Friends: {
            connect: { id: existingFriends.id }
          }
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  // function to delete a message from a conversation
  deleteMessage: async (req,res) => {
    try {
      const { senderId, messageId } = req.body

      const result = await prisma.directMessages.delete({
        where: {
          id: messageId,
          senderId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  // function to add the user to the active users in room
  joinConversation: async (req,res) => {
    try {
      const { userId, conversationId } = req.body

      const result = await prisma.users.update({
        where: {
          id: userId
        },
        data: {
          activeConversationId: conversationId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  leaveConversation: async (req,res) => {
    try {
      const { userId, conversationId } = req.body

      const result = await prisma.conversations.update({
        where: {
          id: conversationId
        },
        data: {
          usersInRoom: {
            disconnect: { id: userId }
          }
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}