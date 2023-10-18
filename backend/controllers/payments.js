const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { prisma } = require("../prisma/connection")

module.exports = {
  createSession: async (req,res) => {
    try {
      const { id, email } = req.body

      // checking if user is a registered stripe customer
      await stripe.customers.retrieve(id, async (error, customer) => {
        if(error){
          // if the customer doesn't exist in the stripe customers then create a new customer
          await stripe.customers.create({
            email
          })
        }
      })

      // checking if user is already has turbo subscription
      const alreadyTurbo = await prisma.users.findFirst({
        where: {
          id,
          role: "TURBO"
        }
      })

      // if user is a turbo member return an error
      if(alreadyTurbo) return res.send({ error: "User is already a Turbo member", code: "AT" })

      // creating a stripe session
      const session = await stripe.checkout.sessions.create({
        customer: id,
        mode: "payment",
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "USD",
            unit_amount: 299, // 2.99$ in cents,
            product_data: {
              name: "Wavecord Turbo Subscription"
            }
          }
        }],
        success_url: `${process.env.CLIENT_URL}/turbo?success=1`,
        cancel_url: `${process.env.CLIENT_URL}/turbo?success=0`,
        metadata: {
          userId: id
        }
      })

      res.send({ url: session.url })
    }
    catch(error){
      res.send(error)
    }
  },

  webhook: async (req,res) => {
    try {
      const body = req.body
      const signature = req.get("Stripe-Signature")

      const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

      const session = event.data.object
      const userId = session.metadata.userId

      if(event.type === "checkout.session.completed"){
        await prisma.users.update({
          where: {
            id: userId
          },
          data: {
            role: "TURBO"
          }
        })
        return res.send({ success: true })
      }

      res.send({ success: false })
    }
    catch(error){
      res.send(error)
    }
  }
}