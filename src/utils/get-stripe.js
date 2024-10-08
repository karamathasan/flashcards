import { loadStripe } from '@stripe/stripe-js'
require('dotenv').config

let stripePromise

const getStripe = () => {
  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export default getStripe