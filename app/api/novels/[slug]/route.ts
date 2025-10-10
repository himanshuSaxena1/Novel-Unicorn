import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNovelBySlug } from '@/lib/queries'
import { prisma } from '@/lib/prisma'
import redis, { CACHE_KEYS } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const novel = await getNovelBySlug(params.slug, session?.user?.id)
    
    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.novel.update({
      where: { id: novel.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(novel)
  } catch (error) {
    console.error('Error fetching novel:', error)
    return NextResponse.json({ error: 'Failed to fetch novel' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const novel = await prisma.novel.findUnique({
      where: { slug: params.slug }
    })

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 })
    }

    // Check if user owns the novel or is admin
    if (novel.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedNovel = await prisma.novel.update({
      where: { slug: params.slug },
      data: {
        title: data.title,
        description: data.description,
        cover: data.cover,
        status: data.status,
        genres: data.genres,
        tags: data.tags,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription
      },
      include: {
        author: { select: { username: true, id: true } },
        _count: { select: { chapters: true, bookmarks: true } }
      }
    })

    return NextResponse.json(updatedNovel)
  } catch (error) {
    console.error('Error updating novel:', error)
    return NextResponse.json({ error: 'Failed to update novel' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const novel = await prisma.novel.findUnique({
      where: { slug: params.slug },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // Check if user owns the novel or is an admin
    if (novel.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the novel from the database
    await prisma.novel.delete({
      where: { slug: params.slug },
    });

    // 🧹 Invalidate Redis cache
    try {
      const cacheKey = CACHE_KEYS.novel(params.slug);
      await redis.del(cacheKey);
      console.log(`Cache invalidated for key: ${cacheKey}`);
    } catch (cacheError) {
      console.error("Error deleting Redis cache:", cacheError);
    }

    return NextResponse.json({ message: "Novel deleted successfully" });
  } catch (error) {
    console.error("Error deleting novel:", error);
    return NextResponse.json(
      { error: "Failed to delete novel" },
      { status: 500 }
    );
  }
}
