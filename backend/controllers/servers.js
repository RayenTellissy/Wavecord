const { prisma } = require("../prisma/connection")

module.exports = {

  // function that fetches servers that a certain user has joined
  fetchByUser: async (req,res) => {
    try{
      const { id } = req.params // user id
  
      const result = await prisma.usersInServers.findMany({
        where: {
          usersId: id
        },
        select: {
          serverId: {
            select: {
              id: true,
              name: true,
              image: true
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

  // function to fetch server details
  fetch: async (req,res) => {
    try{
      const { id } = req.params // server's id

      const result = await prisma.servers.findFirst({
        where: {
          id: id
        },
        include: {
          UsersInServers: true
        }
      })
      
      res.send(result)
    }
    catch(error){
      console.log(error)
    }
  }
}