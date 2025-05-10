import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const { amount, customer_id, email } = await req.json()
  if (!amount || !customer_id || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Get Stripe keys from env
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripeSecretKey || !stripePublishableKey) {
    return NextResponse.json({ error: 'Stripe keys not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit',
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        customer_id,
        type: 'wallet_deposit',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/mobile/wallet/add-funds?stripe_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/mobile/wallet/add-funds?stripe_cancel=true`,
    })
    return NextResponse.json({ sessionId: session.id, stripePublicKey: stripePublishableKey })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 