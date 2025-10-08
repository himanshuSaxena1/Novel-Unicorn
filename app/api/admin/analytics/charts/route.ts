import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canAccessAdminPanel } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !canAccessAdminPanel(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get last 12 months data
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })
    }

    // Monthly revenue
    const monthlyRevenue = await Promise.all(
      months.map(async (month) => {
        const revenue = await prisma.payment.aggregate({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: month.start,
              lte: month.end
            }
          },
          _sum: { amount: true }
        })
        return {
          month: month.name,
          revenue: revenue._sum.amount || 0
        }
      })
    )

    // User growth
    const userGrowth = await Promise.all(
      months.map(async (month) => {
        const users = await prisma.user.count({
          where: {
            createdAt: {
              gte: month.start,
              lte: month.end
            }
          }
        })
        return {
          month: month.name,
          users
        }
      })
    )

    // User roles distribution
    const userRoles = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })

    const totalUsers = userRoles.reduce((sum, role) => sum + role._count.role, 0)
    const userRolesData = userRoles.map(role => ({
      name: role.role,
      count: role._count.role,
      percentage: ((role._count.role / totalUsers) * 100).toFixed(1)
    }))

    // Popular genres
    const novels = await prisma.novel.findMany({
      select: { genres: true }
    })

    const genreCount: { [key: string]: number } = {}
    novels.forEach(novel => {
      novel.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })

    const popularGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      monthlyRevenue,
      userGrowth,
      userRoles: userRolesData,
      popularGenres
    })
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}