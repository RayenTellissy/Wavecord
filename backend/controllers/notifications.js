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

      const result = await prisma.directMessageNotifications.findMany({
        where: {
          recipientId: id
        },
        include: {
          sender: true
        }
      })

      var directMessageNotificationsObject = {}
      for(var i in result){
        directMessageNotificationsObject[result[i].conversationId] = result[i]
      }

      res.send({
        DirectMessageNotifications: directMessageNotificationsObject
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
  }
}