const { prisma } = require("../prisma/connection")

module.exports = {

  // function to fetch all contacts of a user
  fetchContacts: async (req,res) => {
    try{
      const { id } = req.params // user's id

      const result = await prisma.friends.findMany({
        where: {
          users: {
            some: {
              id: id
            }
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