import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { orderID, planId } = await request.json()
    
    const accessToken = await getPayPalAccessToken()
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const captureData = await response.json()
    
    if (captureData.status === 'COMPLETED') {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          amount: parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value),
          userId: session.user.id,
          paypalPaymentId: captureData.id,
          status: 'COMPLETED'
        }
      })

      // Create subscription
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
      })

      if (plan) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 30) // 30 days subscription

        await prisma.userSubscription.create({
          data: {
            userId: session.user.id,
            planId: planId,
            status: 'ACTIVE',
            endDate: endDate,
            paypalSubscriptionId: captureData.id
          }
        })
      }

      return NextResponse.json({ success: true, payment })
    } else {
      return NextResponse.json({ error: 'Payment failed' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error)
    return NextResponse.json({ error: 'Failed to capture order' }, { status: 500 })
  }
}