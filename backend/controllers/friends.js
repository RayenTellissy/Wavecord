const { prisma } = require("../prisma/connection")

module.exports = {

  // fetching all friends of a user that are online
  fetchOnlineFriends: async (req,res) => {
    try {
      const { id, query } = req.body

      const result = await prisma.friends.findMany({
        where: {
          users: {
            some: {
              id: id
            }
          }
        },
        select: {
          users: {
            where: {
              AND: [
                {
                  username: {
                    contains: query
                  }
                },
                {
                  id: {
                    not: id,
                  }
                },
                {
                  status: {
                    not: "OFFLINE"
                  }
                }
              ]
            }
          },
          conversation: true
        }
      })

      const onlineFriends = result.filter(e => e.users.length !== 0)
      
      res.send(onlineFriends)
    }
    catch(error){
      res.send(error)
    }
  },

  // function to fetch all contacts of a user
  fetchAllFriends: async (req,res) => {
    try {
      const { id } = req.body // user's id
  
      const result = await prisma.friends.findMany({
        where: {
          users: {
            some: {
              id
            }
          }
        },
        select: {
          users: {
            where: {
              AND: [
                {
                  id: {
                    not: id
                  }  
                }
              ]
            }
          },
          conversation: true
        }
      })
      const allFriends = result.filter(e => e.users.length !== 0)
      res.send(allFriends)
    }
    catch(error){
      res.send(error)
    }
  },

  addFriend: async (req,res) => {
    try {
      const { senderUsername, sender, recipient } = req.body

      // checking if it is not the user himself
      if(senderUsername === recipient) return res.send({ invitingSelf: true })

      // user exists check
      const userExists = await prisma.users.findFirst({
        where: {
          username: recipient
        },
        select: {
          id: true
        }
      })
      if(!userExists){
        return res.send({ userExists: false })
      }

      // checking if users are already friends
      const friendsCheck = await prisma.friends.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: sender
                }
              }
            },
            {
              users: {
                some: {
                  id: userExists.id
                }
              }
            }
          ]
        }
      })
      if(friendsCheck){
        return res.send({
          friend: recipient,
          alreadyFriends: true
        })
      }

      // checking if the sender has already sent a friend request
      const alreadyRequested = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            {
              senderId: sender
            },
            {
              recipientId: userExists.id
            }
          ]
        }
      })
      if(alreadyRequested){
        return res.send({
          recipient: recipient,
          alreadyRequested: true
        })
      }

      // checking if the requested user has already sent the sender a friend request
      const recipientAlreadyRequested = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            {
              senderId: userExists.id
            },
            {
              recipientId: sender
            }
          ]
        }
      })
      if(recipientAlreadyRequested){
        return res.send({
          recipient: recipient,
          recipientAlreadyRequested: true
        })
      }

      // checking if user is blocked
      const blockCheck = await prisma.blockedUsers.findFirst({
        where: {
          OR: [
            {
              blockerId: sender,
              blockedId: userExists.id
            },
            {
              blockerId: userExists.id,
              blockedId: sender
            }
          ]
        }
      })
      if(blockCheck){
        return res.send({ userBlocked: true })
      }

      // getting the recipient's id
      const query = await prisma.users.findFirst({
        where: {
          username: recipient
        },
        select: {
          id: true
        }
      })

      // creating friend request row
      await prisma.friendRequest.create({
        data: {
          senderId: sender,
          recipientId: query.id
        }
      })
      res.send({ success: true, id: query.id  })
    }
    catch(error){
      res.send(error)
    }
  },

  removeFriend: async (req,res) => {
    try {
      const { remover, removed } = req.body

      const rowId = await prisma.friends.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: remover
                }
              }
            },
            {
              users: {
                some: {
                  id: removed
                }
              }
            }
          ]
        },
        select: {
          id: true
        }
      })

      if(!rowId) return res.send({ notFriends: true })

      await prisma.friends.delete({
        where: {
          id: rowId.id
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  fetchPending: async (req,res) => {
    try {
      const { id } = req.params

      const result = await prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              senderId: id
            },
            {
              recipientId: id
            }
          ]
        },
        select: {
          id: true,
          recipient: true,
          sender: true
        },
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  acceptFriendRequest: async (req,res) => {
    try {
      const { sender, requested } = req.body
  
      // removing the friend request row after accepting
      const requestId = await prisma.friendRequest.findFirst({
        where: {
          senderId: sender,
          recipientId: requested
        },
        select: {
          id: true
        }
      })
      
      await prisma.friendRequest.delete({
        where: {
          id: requestId.id
        }
      })

      const existingConversation = await prisma.conversations.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: sender
                }
              }
            },
            {
              users: {
                some: {
                  id: requested
                }
              }
            }
          ]
        }
      })
      
      const result = await prisma.friends.create({
        data: {
          users: {
            connect: [
              { id: sender },
              { id: requested }
            ]
          },
          conversationId: existingConversation ? existingConversation.id : null
        }
      })
      
      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  removeRequest: async (req,res) => {
    try {
      const { id } = req.params // request's id
  
      const result = await prisma.friendRequest.delete({
        where: {
          id: id
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  blockUser: async (req,res) => {
    try {
      const { blocker, blocked } = req.body

      const rowId = await prisma.friends.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: blocker
                }
              }
            },
            {
              users: {
                some: {
                  id: blocked
                }
              }
            }
          ]
        },
        select: {
          id: true
        }
      })
      
      if(rowId){
        // removing the 2 users from friends
        await prisma.friends.delete({
          where: {
            id: rowId.id
          }
        })
      }
  
      const result = await prisma.blockedUsers.create({
        data: {
          blockerId: blocker,
          blockedId: blocked
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  unblockUser: async (req,res) => {
    try {
      const { blocker, blocked } = req.body

      const rowId = await prisma.blockedUsers.findFirst({
        where: {
          blockedId: blocker,
          blockedId: blocked
        },
        select: {
          id: true
        }
      })

      const result = await prisma.blockedUsers.delete({
        where: {
          id: rowId.id
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchBlocks: async (req,res) => {
    try {
      const { id } = req.params
  
      const result = await prisma.blockedUsers.findMany({
        where: {
          blockerId: id
        },
        select: {
          blocked: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchFriendsWithNoConversation: async (req,res) => {
    try {
      const { id } = req.params

      const result = await prisma.friends.findMany({
        where: {
          AND: [
            {
              users: {
                some: {
                  id
                }
              }
            },
            {
              conversationId: null
            }
          ]
        },
        select: {
          users: {
            where: {
              id: {
                not: id
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
  }
}