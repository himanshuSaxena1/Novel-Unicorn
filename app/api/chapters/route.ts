export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { invalidateNovelCache } from "@/lib/cache-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get("novelId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = novelId ? { novelId } : {};

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        include: {
          novel: { select: { title: true, slug: true } },
          author: { select: { username: true } },
        },
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      prisma.chapter.count({ where }),
    ]);

    return NextResponse.json({
      chapters,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // if (!hasPermission(session.user.role as any, 'CREATE_CHAPTER')) {
    //   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    // }

    const data = await request.json();

    // Get the next order number for this novel
    const lastChapter = await prisma.chapter.findFirst({
      where: { novelId: data.novelId },
      orderBy: { order: "desc" },
    });

    const nextOrder = (lastChapter?.order || 0) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        order: nextOrder,
        accessTier: data.accessTier || "FREE",
        isPublished: data.isPublished || false,
        novelId: data.novelId,
        authorId: session.user.id,
        wordCount: data.content?.split(/\s+/).length || 0,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      },
      include: {
        novel: { select: { title: true, slug: true } },
        author: { select: { username: true } },
      },
    });

    await invalidateNovelCache(chapter.novel.slug);

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}
