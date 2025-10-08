import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, paypalSubscriptionId } = await request.json()
    
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Calculate end date (30 days from now)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: session.user.id,
        planId: planId,
        status: 'ACTIVE',
        endDate: endDate,
        paypalSubscriptionId: paypalSubscriptionId
      },
      include: {
        plan: true
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}