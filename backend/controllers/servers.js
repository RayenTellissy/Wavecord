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
      const { serverId, userId } = req.body

      const server = await prisma.servers.findFirst({
        where: {
          id: serverId
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

      const adminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId,
          role: {
            isAdmin: true
          }
        }
      })
      var isAdmin
      if(adminCheck){
        isAdmin = true
      }
      else {
        isAdmin = false
      }
      
      res.send({ server, isAdmin })
    }
    catch(error){
      res.send(error)
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
          ownerId,
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
      
      const banCheck = await prisma.bans.findFirst({
        where: {
          serverId,
          userId
        }
      })
      if(banCheck) return res.send({ status: "BANNED", error: "You are banned from this server." })
    
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
    res.send(error)
    }
  },

  leaveServer: async (req,res) => {
    try {
      const { userId, serverId } = req.body
      
      await prisma.usersInServers.deleteMany({
        where: {
          userId,
          serverId
        }
      })
      
      res.send({ success: true, message: `user ${userId} has left server ${serverId}`})
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
      const { id, senderId, channelId, message, type } = req.body

      const result = await prisma.serverMessages.create({
        data: {
          id,
          senderId,
          channelId,
          message,
          type
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
  },

  removeRoleFromUser: async (req,res) => {
    try {
      const { removerId, userId, serverId } = req.body
      
      const userIsAdmin = await prisma.usersInServers.findFirst({
        where: {
          userId,
          serverId
        },
        select: {
          role: true
        }
      })

      if(!userIsAdmin){
        const removerRole = await prisma.usersInServers.findFirst({
          where: {
            userId: removerId,
            serverId,
          },
          select: {
            role: true
          }
        })
        if(removerRole.role.isAdmin){
          const result = await prisma.usersInServers.updateMany({
            where: {
              userId,
              serverId
            },
            data: {
              rolesId: null
            }
          })
          return res.send(result)
        }
        return res.send({ error: "You do not have admin privileges in this server." })
      }

      const removerOwnerCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: removerId,
          serverId,
          server: {
            ownerId: removerId
          }
        }
      })
      if(!removerOwnerCheck) return res.send({ error: "Admins cannot kick other Admins."})

      await prisma.usersInServers.updateMany({
        where: {
          userId,
          serverId
        },
        data: {
          rolesId: null
        }
      })
      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  kickUser: async (req,res) => {
    try {
      const { kicker, kicked, serverId } = req.body

      // checking if the kicker is an admin
      const adminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: kicker,
          serverId,
          OR: [
            {
              role: {
                isAdmin: true
              }
            },
            {
              server: {
                ownerId: kicker
              }
            }
          ]
        }
      })
      if(!adminCheck) return res.send({ error: "You do not have admin privileges in this server."})

      // checking if the user to be kicked is an admin
      const kickedAdminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: kicked,
          serverId,
          role: {
            isAdmin: true
          }
        }
      })
      if(kickedAdminCheck) return res.send({ error: "Admins cannot be kicked."})

      await prisma.usersInServers.deleteMany({
        where: {
          userId: kicked,
          serverId
        }
      })
      
      res.send({ success: true, message: `user ${kicked} has been kicked.` })
    }
    catch(error){
      res.send(error)
    }
  },

  fetchBannedUsers: async (req,res) => {
    try {
      const { serverId } = req.params

      const result = await prisma.bans.findMany({
        where: {
          serverId
        },
        select: {
          user: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  banUser: async (req,res) => {
    try {
      const { banner, banned, serverId } = req.body

      // checking if the banner is an admin
      const adminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: banner,
          serverId,
          OR: [
            {
              role: {
                isAdmin: true
              }
            },
            {
              server: {
                ownerId: banner
              }
            }
          ]
        }
      })
      if(!adminCheck) return res.send({ error: "You do not have admin privileges in this server." })

      const bannedAdminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: banned,
          serverId,
          role: {
            isAdmin: true
          }
        }
      })
      if(bannedAdminCheck) return res.send({ error: "Admins cannot be banned." })
      
      await prisma.usersInServers.deleteMany({
        where: {
          userId: banned,
          serverId
        }
      })

      await prisma.bans.create({
        data: {
          userId: banned,
          serverId
        }
      })

      res.send({ success: true, message: `user ${banned} has been banned. ` })
    }
    catch(error){
      res.send(error)
    }
  },

  unbanUser: async (req,res) => {
    try {
      const { remover, removed, serverId } = req.body

      const removerAdminCheck = await prisma.usersInServers.findFirst({
        where: {
          userId: remover,
          serverId,
          OR: [
            {
              role: {
                isAdmin: true
              }
            },
            {
              server: {
                ownerId: remover
              }
            }
          ]
        }
      })
      if(!removerAdminCheck) return res.send({ error: "You do not have admin privileges." })

      await prisma.bans.deleteMany({
        where: {
          userId: removed,
          serverId
        }
      })

      res.send({ success: true, message: `User ${removed} has been unbanned.` })
    }
    catch(error){
      res.send(error)
    }
  },

  joinVoiceRoom: async (req,res) => {
    try {
      const { userId, channelId } = req.body

      await prisma.users.update({
        where: {
          id: userId
        },
        data: {
          voice_channelId: channelId
        }
      })

      res.send({ success: true, message: `User ${userId} joined vc ${channelId}.`})
    }
    catch(error){
      res.send(error)
    }
  },

  leaveVoiceRoom: async (req,res) => {
    try {
      const { id } = req.body

      await prisma.users.update({
        where: {
          id
        },
        data: {
          voice_channelId: null
        }
      })

      res.send({ success: true, message: `User ${userId} has left the channel.`})
    }
    catch(error){
      res.send(error)
    }
  },

  fetchUsersInRoom: async (req,res) => {
    try {
      const { channelId } = req.params

      const result = await prisma.users.findMany({
        where: {
          voice_channelId: channelId
        },
        select: {
          id: true,
          username: true,
          image: true,
          muted: true,
          deafened: true
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },
  
  deleteMessage: async (req,res) => {
    try {
      const { senderId, messageId } = req.body
      console.log(senderId, messageId)

      const result = await prisma.serverMessages.delete({
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
  }
}