const { prisma } = require("../prisma/connection")

module.exports = {
  // function to fetch all contacts of a user
  fetchFriends: async (req,res) => {
    try {
      const { id } = req.params // user's id
  
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