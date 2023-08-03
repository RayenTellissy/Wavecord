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
      const { user, requested } = req.body

      
    }
    catch(error){
      res.send(error)
    }
  }
}