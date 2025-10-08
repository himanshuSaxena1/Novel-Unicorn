import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const plan = await prisma.subscriptionPlan.update({
      where: { id: params.id },
      data: {
        name: data.name,
        price: data.price,
        yearlyPrice: data.yearlyPrice,
        features: data.features,
        maxChapters: data.maxChapters,
        description: data.description,
        color: data.color,
        isPopular: data.isPopular,
        discount: data.discount,
        isActive: data.isActive
      }
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error updating subscription plan:', error)
    return NextResponse.json({ error: 'Failed to update subscription plan' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.subscriptionPlan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting subscription plan:', error)
    return NextResponse.json({ error: 'Failed to delete subscription plan' }, { status: 500 })
  }
}