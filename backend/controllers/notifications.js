const { prisma } = require("../prisma/connection")

module.exports = {
  
  createDirectMessageNotification: async (req,res) => {
    try {
      const { senderId, recipientId, conversationId } = req.body
      
      const recipientInRoom = await prisma.conversations.findFirst({
        where: {
          id: conversationId,
          usersInRoom: {
            some: {
              id: recipientId
            }
          }
        }
      })
      
      // if the recipient of the notification is already in the room, the notification won't be created.
      if(recipientInRoom) return res.send("recipient in room.")
      
      const notificationExists = await prisma.directMessageNotifications.findFirst({
        where: {
          senderId,
          recipientId
        }
      })
      
      if(notificationExists){
        await prisma.directMessageNotifications.updateMany({
          where: {
            senderId,
            recipientId
          },
          data: {
            messages: {
              increment: 1
            }
          }
        })
        
        return res.send({ success: true, message: "Incremented Notifications" })
      }

      await prisma.directMessageNotifications.create({
        data: {
          senderId,
          recipientId,
          conversationId
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  fetchAllNotifications: async (req,res) => {
    try {
      const { id } = req.params

      const directMessageNotifications = await prisma.directMessageNotifications.findMany({
        where: {
          recipientId: id
        },
        include: {
          sender: true
        }
      })

      const friendRequestNotifications = await prisma.friendRequestNotifications.count({
        where: {
          recipientId: id
        }
      })

      var directMessageNotificationsObject = {}
      for(var i in directMessageNotifications){
        directMessageNotificationsObject[directMessageNotifications[i].conversationId] = directMessageNotifications[i]
      }

      res.send({
        DirectMessageNotifications: Object.keys(directMessageNotificationsObject).length ? directMessageNotificationsObject : null,
        FriendRequestNotifications: friendRequestNotifications ? friendRequestNotifications : null
      })
    }
    catch(error){
      res.send(error)
    }
  },

  removeDirectMessageNotification: async (req,res) => {
    try {
      const { recipientId, conversationId } = req.body

      const result = await prisma.directMessageNotifications.deleteMany({
        where: {
          conversationId,
          recipientId
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  },

  createFriendRequestNotification: async (req,res) => {
    try {
      const { senderId, recipientId } = req.body

      await prisma.friendRequestNotifications.create({
        data: {
          senderId,
          recipientId
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  removeFriendRequestNotification: async (req,res) => {
    try {
      const { recipientId } = req.body

      await prisma.friendRequestNotifications.delete({
        where: {
          recipientId
        }
      })

      res.send({ success: true })
    }
    catch(error){
      res.send(error)
    }
  },

  fetchDirectMessageNotifications: async (req,res) => {
    try {
      const { id } = req.params

      const directMessageNotifications = await prisma.directMessageNotifications.findMany({
        where: {
          recipientId: id
        },
        include: {
          sender: true
        }
      })

      var directMessageNotificationsObject = {}
      for(var i in directMessageNotifications){
        directMessageNotificationsObject[directMessageNotifications[i].conversationId] = directMessageNotifications[i]
      }

      res.send(directMessageNotificationsObject)
    }
    catch(error){
      res.send(error)
    }
  },

  fetchFriendRequestNotifications: async (req,res) => {
    try {
      const { id } = req.params

      console.log(id)

        const friendRequestNotifications = await prisma.friendRequestNotifications.count({
        where: {
          recipientId: id
        }
      })
      res.send({ requests: friendRequestNotifications ? friendRequestNotifications : null })
    }
    catch(error){
      res.send(error)
    }
  }
}