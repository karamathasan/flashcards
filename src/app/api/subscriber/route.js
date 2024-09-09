import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export async function POST(req) {
    const {subscriber_id} = await req.json()

    try{
        const subscription = await stripe.subscriptions.retrieve(subscriber_id)
        return NextResponse.json({"status":subscription.status})
    } catch (e) {
        return NextResponse.json({"error":e.message})
    }
}

