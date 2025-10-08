import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubscriptionAPI } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const plans = await SubscriptionAPI.getActivePlans()
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        tier: data.tier,
        price: data.price,
        yearlyPrice: data.yearlyPrice,
        features: data.features,
        maxChapters: data.maxChapters,
        description: data.description,
        color: data.color,
        isPopular: data.isPopular,
        discount: data.discount
      }
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json({ error: 'Failed to create subscription plan' }, { status: 500 })
  }
}