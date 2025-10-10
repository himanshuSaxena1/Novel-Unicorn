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
      !canAccessAdminPanel(session.user.role as "USER" | "AUTHOR" | "TRANSLATOR" | "EDITOR" | "MODERATOR" | "ADMIN")
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (status && status !== 'ALL') {
      where.status = status
    }

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        include: {
          author: { select: { username: true, id: true } },
          _count: { 
            select: { 
              chapters: true, 
              bookmarks: true,
              reviews: true
            } 
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.novel.count({ where })
    ])

    return NextResponse.json({
      novels,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching novels:', error)
    return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 })
  }
}