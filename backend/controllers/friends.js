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
          }
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
      const { id, query } = req.body // user's id
  
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
          }
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
      const { sender, recipient } = req.body

      const result = await prisma.friendRequest.create({
        data: {
          senderId: sender,
          recipientId: recipient
        }
      })
      res.send(result)
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
      
      const result = await prisma.friends.create({
        data: {
          users: {
            connect: [
              { id: sender },
              { id: requested }
            ]
          }
        }
      })
      
      res.send(result)
    }
    catch(error){
      console.log(error)
    }
  }
}