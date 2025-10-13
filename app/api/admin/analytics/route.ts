export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canAccessAdminPanel } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (
          !session?.user ||
          !canAccessAdminPanel(
            session.user.role as "USER" | "AUTHOR" | "TRANSLATOR" | "EDITOR" | "MODERATOR" | "ADMIN"
          )
        ) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

    // Get current month start
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const [
      totalRevenue,
      activeSubscribers,
      totalViews,
      newUsers
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.userSubscription.count({
        where: {
          status: 'ACTIVE',
          endDate: { gt: new Date() }
        }
      }),
      prisma.novel.aggregate({
        _sum: { views: true }
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: currentMonth }
        }
      })
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscribers,
      totalViews: totalViews._sum.views || 0,
      newUsers
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}