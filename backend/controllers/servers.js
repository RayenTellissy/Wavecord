const { prisma } = require("../prisma/connection")
const cuid = require("cuid")

module.exports = {

  // function that fetches servers that a certain user has joined
  fetchByUser: async (req,res) => {
    try{
      const { id } = req.params // user id
  
      const result = await prisma.usersInServers.findMany({
        where: {
          userId: id
        },
        select: {
          server: {
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
          name: name,
          image: image,
          ownerId: id,
          UsersInServers: {
            create: {
              userId: id
            }
          }
        }
      })

      const category = await prisma.server_categories.create({
        data: {
          name: "general",
          serverId: result.id
        }
      })

      await prisma.text_channels.create({
        data: {
          name: "general",
          categoryId: category.id,
          serverId: result.id
        }
      })

      await prisma.voice_channels.create({
        data: {
          name: "general",
          categoryId: category.id,
          serverId: result.id
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  deleteServer: async (req,res) => {
    try {
      const { serverId, ownerId } = req.body

      const ownerCheck = await prisma.servers.findFirst({
        where: {
          ownerId: ownerId,
          id: serverId
        }
      })
      if(!ownerCheck) return res.send("You don't own this server.")

      // removing all text messages
      await prisma.serverMessages.deleteMany({
        where: {
          channel: {
            serverId: serverId
          }
        }
      })

      // removing all text channels
      await prisma.text_channels.deleteMany({
        where: {
          serverId: serverId
        }
      })

      // removing all voice channels
      await prisma.voice_channels.deleteMany({
        where: {
          serverId: serverId
        }
      })

      // remove all categories
      await prisma.server_categories.deleteMany({
        where: {
          serverId: serverId
        }
      })

      // remvoing all server memebers
      await prisma.usersInServers.deleteMany({
        where: {
          serverId: serverId
        }
      })

      // removing all roles
      await prisma.roles.deleteMany({
        where: {
          serverId: serverId
        }
      })

      const result = await prisma.servers.delete({
        where: {
          id: serverId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
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
          userId: userId,
          serverId: serverId
        }
      })

      // if user is already a member return an error
      if(memberCheck){
        return res.send({
          status: "warning",
          success: false,
          message: "You are already a member of this server.",
        })
      }
    
      await prisma.usersInServers.create({
        data: {
          userId: userId,
          serverId: serverId
        }
      })

      res.send({
        success: true,
        message: "Joined server.",
        serverId: serverId
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
            userId: userId,
            serverId: serverId
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
      const { name, categoryId, serverId } = req.body

      const result = await prisma.text_channels.create({
        data: {
          name: name,
          categoryId: categoryId,
          serverId: serverId
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
      const { name , categoryId, serverId } = req.body

      const result = await prisma.voice_channels.create({
        data: {
          name: name,
          categoryId: categoryId,
          serverId: serverId
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
  },

  fetchUsersByRoles: async (req,res) => {
    try {
      const { serverId } = req.params

      const result = await prisma.roles.findMany({
        where: {
          serverId: serverId,
          UsersInServers: {
            some: {}
          }
        },
        include: {
          UsersInServers: {
            select: {
              user: true
            }
          }
        },
        orderBy: {
          created_at: "asc"
        }
      })

      const noRole = await prisma.usersInServers.findMany({
        where: {
          serverId: serverId,
          rolesId: null
        },
        select: {
          user: true
        }
      })

      res.send({
        withRole: result,
        noRole: noRole
      })
    }
    catch(error){
      res.send(error)
    }
  },

  resetServerLink: async (req,res) => {
    try {
      const { id, ownerId, server_link } = req.body

      if(id !== ownerId) return res.send("You don't have server privileges to do that.")

      const result = await prisma.servers.update({
        where: {
          server_link: server_link
        },
        data: {
          server_link: cuid()
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  changeServerImage: async (req,res) => {
    try {
      const { serverId, image } = req.body

      const result = await prisma.servers.update({
        where: {
          id: serverId
        },
        data: {
          image: image
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  changeServerName: async (req,res) => {
    try {
      const { serverId, name } = req.body

      const result = await prisma.servers.update({
        where: {
          id: serverId
        },
        data: {
          name: name
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchServerRoles: async (req,res) => {
    try {
      const { serverId } = req.params

      const result = await prisma.servers.findFirst({
        where: {
          id: serverId
        },
        select: {
          roles: {
            include: {
              UsersInServers: true
            }
          }
        }
      })

      res.send(result.roles)
    }
    catch(error){
      res.send(error)
    }
  },

  removeRole: async (req,res) => {
    try {
      const { roleId } = req.params

      const result = await prisma.roles.delete({
        where: {
          id: roleId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  createRole: async (req,res) => {
    try {
      const { roleName, roleColor, serverId, isAdmin } = req.body

      if(!roleName || !roleColor || !serverId) return res.send({
        error: "Information Missing!"
      })

      const result = await prisma.roles.create({
        data: {
          name: roleName,
          isAdmin: isAdmin,
          serverId: serverId,
          color: roleColor
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchMembers: async (req,res) => {
    try {
      const { serverId } = req.params

      if(!serverId) return res.send({
        error: "Missing Information!"
      })

      const result = await prisma.usersInServers.findMany({
        where: {
          serverId: serverId
        },
        select: {
          user: true,
          role: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },
  
  fetchOnlyRoles: async (req,res) => {
    try {
      const { serverId } = req.params

      const result = await prisma.roles.findMany({
        where: {
          serverId
        },
        select: {
          id: true,
          name: true,
          color: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  giveRole: async (req,res) => {
    try {
      const { userId, roleId, serverId } = req.body

      const result = await prisma.usersInServers.updateMany({
        where: {
          userId: userId,
          serverId: serverId
        },
        data: {
          rolesId: roleId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}