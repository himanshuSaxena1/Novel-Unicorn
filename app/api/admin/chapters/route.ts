export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canAccessAdminPanel } from '@/lib/permissions'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const accessTier = searchParams.get('accessTier')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { novel: { title: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (accessTier && accessTier !== 'ALL') {
      where.accessTier = accessTier
    }

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        include: {
          novel: { select: { title: true, slug: true } },
          author: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.chapter.count({ where })
    ])

    return NextResponse.json({
      chapters,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 })
  }
}