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
  },

  createServer: async (req,res) => {
    try {
      const { id } = req.params // new server owner's id
      const { name, image, role } = req.body

      // counting how many servers the user has created
      const count = await prisma.servers.count({
        where: {
          ownerId: id
        }
      })

      if(role === "BASIC" && count > 2){
        return res.send("Non-Turbo users can only create a maximum of 3 servers.")
      }

      if(role === "TURBO" && count > 9){
        return res.send("You have reached your maximum quota for creating servers.")
      }

      const result = await prisma.servers.create({
        data: {
          name,
          image,
          ownerId: id,
          UsersInServers: {
            create: {
              usersId: id
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

  deleteServer: async (req,res) => {

  },

  joinServer: async (req,res) => {
    try {
      const { userId, serverId } = req.body
    
      const result = await prisma.usersInServers.create({
        data: {
          usersId: userId,
          serversId: serverId
        }
      })

      res.send(result)
    }
    catch(error){

    }
  },

  leaveServer: async (req,res) => {
    try {
      const { userId, serverId } = req.body
      
      const result = await prisma.usersInServers.delete({
        where: {
          usersId_serversId: {
            usersId: userId,
            serversId: serverId
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