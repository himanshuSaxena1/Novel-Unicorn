export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NovelAPI } from '@/lib/api'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      search: searchParams.get('search') || undefined,
      genres: searchParams.get('genres')?.split(',').filter(Boolean) || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }

    const result = await NovelAPI.getNovelsByFilters(filters)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching novels:', error)
    return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const novel = await prisma.novel.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        cover: data.cover,
        status: data.status || 'ONGOING',
        genres: data.genres || [],
        tags: data.tags || [],
        authorId: session.user.id,
        isPublished: data.isPublished || false,
        isFeatured: data.isFeaturing || false,
        novelPrice: data.novelPrice || null,
        language: data.language || 'ENGLISH',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription
      },
      include: {
        author: { select: { username: true, id: true } },
        _count: { select: { chapters: true, bookmarks: true } }
      }
    })

    return NextResponse.json(novel, { status: 201 })
  } catch (error) {
    console.error('Error creating novel:', error)
    return NextResponse.json({ error: 'Failed to create novel' }, { status: 500 })
  }
}