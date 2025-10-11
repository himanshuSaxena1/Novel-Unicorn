import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import redis, { CACHE_KEYS } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId },
      select: {
        id: true,
        isLocked: true,
        slug: true,
        title: true,
        content: true,
        chapterPrice: true,
        isPublished: true,
        novelId: true,
        novel: { select: { slug: true, title: true } },
        accessTier: true,
        metaTitle: true,
        metaDescription: true,
        priceCoins: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } } // Changed from chapterId to id
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      content,
      novelId,
      accessTier,
      isPublished,
      metaTitle,
      metaDescription,
      priceCoins,
      isLocked,
    } = body;

    const chapter = await prisma.chapter.findUnique({
      where: { id: params.id }, // Changed from params.chapterId to params.id
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Ensure the user is the author or has admin rights
    if (chapter.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: params.id }, // Changed from params.chapterId to params.id
      data: {
        title,
        slug,
        content,
        novelId,
        accessTier,
        isPublished,
        metaTitle,
        metaDescription,
        priceCoins,
        isLocked,
        wordCount: content.split(/\s+/).length,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        isLocked: true,
        slug: true,
        title: true,
        content: true,
        chapterPrice: true,
        isPublished: true,
        novelId: true,
        novel: { select: { slug: true } },
        accessTier: true,
        metaTitle: true,
        metaDescription: true,
        priceCoins: true,
      },
    });

    // Clear cache
    await Promise.all([
      redis.del(CACHE_KEYS.novel(updatedChapter.novel.slug)),
      redis.del(
        CACHE_KEYS.chapter(updatedChapter.novel.slug, updatedChapter.slug)
      ),
    ]);

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[UPDATE_CHAPTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
