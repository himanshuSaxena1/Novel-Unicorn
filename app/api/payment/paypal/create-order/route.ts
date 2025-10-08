import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com'

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })
  
  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, amount } = await request.json()
    
    const accessToken = await getPayPalAccessToken()
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Subscription Plan - ${planId}`
      }],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/subscription/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/subscription/cancel`
      }
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const order = await response.json()
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}