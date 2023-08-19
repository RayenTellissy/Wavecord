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
          UsersInServers: true,
          categories: {
            include: {
              Text_channels: true,
              Voice_channels: true
            }
          }
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
      const { name, image } = req.body

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
      const { userId, invite } = req.body
      
      const server = await prisma.servers.findFirst({
        where: {
          server_link: invite
        },
        select: {
          id: true
        }
      })

      if(!server){
        return res.send({
          status: "error",
          success: false,
          message: "Invite code doesn't exist."
        })
      }

      const serverId = server.id

      const memberCheck = await prisma.usersInServers.findFirst({
        where: {
          usersId: userId,
          serversId: serverId
        }
      })

      // if user is already a member return an error
      if(memberCheck){
        return res.send({
          status: "warning",
          success: false,
          message: "User is already a member of this server.",
        })
      }
    
      await prisma.usersInServers.create({
        data: {
          usersId: userId,
          serversId: serverId
        }
      })

      res.send({
        success: true,
        message: "Joined server."
      })
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
  },

  // function to count how many servers a user has created
  count: async (req,res) => {
    try {
      const { id } = req.params

      // getting the user's role
      const roleQuery = await prisma.users.findFirst({
        where: {
          id
        },
        select: {
          role: true
        }
      })

      const role = roleQuery.role

      // counting how many servers the user has created
      const count = await prisma.servers.count({
        where: {
          ownerId: id
        }
      })
      
      if(role === "BASIC" && count > 2){
        return res.send({
          success: false,
          message: "Non-Turbo users can only create a maximum of 3 servers."
        })
      }
      
      if(role === "TURBO" && count > 9){
        return res.send({
          success: false,
          message: "You have reached your maximum quota for creating servers."
        })
      }
      
      res.send({
        success: true,
        role: role.role
      })
    }
    catch(error){
      res.send(error)
    }
  },

  createCategory: async (req,res) => {
    try {
      const { name, serverId } = req.body

      const result = await prisma.server_categories.create({
        data: {
          name: name,
          serverId: serverId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  createTextChannel: async (req,res) => {
    try {
      const { name, categoryId } = req.body

      const result = await prisma.text_channels.create({
        data: {
          name: name,
          categoryId: categoryId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  createVoiceChannel: async (req,res) => {
    try {
      const { name , categoryId } = req.body

      const result = await prisma.voice_channels.create({
        data: {
          name: name,
          categoryId: categoryId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchTextChannelMessages: async (req,res) => {
    try {
      const { channelId } = req.body

      const result = await prisma.serverMessages.findMany({
        where: {
          channelId : channelId
        },
        include: {
          sender: true
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
      const { senderId, channelId, message } = req.body

      const result = await prisma.serverMessages.create({
        data: {
          senderId: senderId,
          channelId: channelId,
          message: message
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}