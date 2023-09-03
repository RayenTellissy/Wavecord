const { prisma } = require("../prisma/connection")

module.exports = {
  
  createTicket: async (req,res) => {
    try {
      const { senderId, message } = req.body
  
      const result = await prisma.bugReports.create({
        data: {
          senderId,
          message
        }
      })

      res.send(result)
    }
    catch(error){
      res.send(error)
    }
  }
}