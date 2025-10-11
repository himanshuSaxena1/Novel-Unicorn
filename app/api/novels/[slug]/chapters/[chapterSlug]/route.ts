import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNovelBySlug } from "@/lib/queries";
import redis, { CACHE_KEYS } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { slug: string; chapterSlug: string } }
) {
  const { slug, chapterSlug } = await params;

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const novel = await getNovelBySlug(slug, userId);
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapterData = novel.chapters.find((c: any) => c.slug === chapterSlug);
    if (!chapterData) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterData.id },
      include: {
        novel: { select: { id: true, title: true, slug: true } },
        author: { select: { id: true, username: true } },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const [prev, next, userChapters] = await Promise.all([
      prisma.chapter.findFirst({
        where: { novelId: novel.id, order: { lt: chapter.order } },
        orderBy: { order: "desc" },
        select: { slug: true, title: true },
      }),
      prisma.chapter.findFirst({
        where: { novelId: novel.id, order: { gt: chapter.order } },
        orderBy: { order: "asc" },
        select: { slug: true, title: true },
      }),
      userId
        ? prisma.user.findUnique({
            where: { id: userId },
            select: { chapters: { where: { id: chapter.id } } },
          })
        : null,
    ]);

    // Clear chapter cache
    await redis.del(CACHE_KEYS.chapter(slug, chapterSlug));

    // Check if the user owns the chapter
    const isOwnedByUser = userId && userChapters && userChapters.chapters.length > 0;
    const isLocked = chapter.isLocked && !isOwnedByUser;

    return NextResponse.json({
      novel,
      chapter: {
        id: chapter.id,
        title: chapter.title,
        slug: chapter.slug,
        order: chapter.order,
        content: isLocked ? null : chapter.content,
        priceCoins: chapter.priceCoins,
        isLocked,
      },
      prev,
      next,
    });
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
