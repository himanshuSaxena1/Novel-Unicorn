// @ts-nocheck
import { prisma } from "@/lib/prisma";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export async function getNovels(page = 1, limit = 12, filters: any = {}) {
  // const cacheKey = CACHE_KEYS.novels(page, JSON.stringify(filters));

  // try {
  //   const cached = await redis.get(cacheKey);
  //   if (cached) return JSON.parse(cached);
  // } catch (error) {
  //   console.error("Redis cache error:", error);
  // }

  const skip = (page - 1) * limit;

  const where = {
    ...(filters.genre && { genres: { has: filters.genre } }),
    ...(filters.status && { status: filters.status }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        {
          author: {
            username: { contains: filters.search, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const [novels, total] = await Promise.all([
    prisma.novel.findMany({
      where,
      include: {
        author: { select: { username: true, id: true } },
        chapters: {
          select: { id: true, title: true, accessTier: true, createdAt: true },
          orderBy: { order: "desc" },
          take: 1,
        },
        _count: { select: { chapters: true, bookmarks: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.novel.count({ where }),
  ]);

  const result = {
    novels: novels.map((novel) => ({
      ...novel,
      latestChapter: novel.chapters[0] || null,
      chapterCount: novel._count.chapters,
      bookmarkCount: novel._count.bookmarks,
    })),
    total,
    pages: Math.ceil(total / limit),
  };

  // try {
  //   await redis.setex(cacheKey, CACHE_TTL.medium, JSON.stringify(result));
  // } catch (error) {
  //   console.error("Redis cache error:", error);
  // }

  return result;
}

export async function getNovelBySlug(slug: string, userId?: string) {
  const cacheKey = CACHE_KEYS.novel(slug);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const novel = JSON.parse(cached);
      if (userId) {
        const bookmark = await prisma.bookmark.findUnique({
          where: { userId_novelId: { userId, novelId: novel.id } },
        });
        novel.isBookmarked = !!bookmark;

        // Check chapter purchases to update isLocked
        const purchases = await prisma.chapterPurchase.findMany({
          where: { userId, novelId: novel.id },
          select: { chapterId: true },
        });
        const purchasedChapterIds = new Set(purchases.map(p => p.chapterId));
        novel.chapters = novel.chapters.map((chapter: any) => ({
          ...chapter,
          isLocked: chapter.isLocked && !purchasedChapterIds.has(chapter.id),
        }));
      }
      return novel;
    }
  } catch (error) {
    console.error("Redis cache error:", error);
  }

  const novel = await prisma.novel.findUnique({
    where: { slug },
    include: {
      author: { select: { username: true, id: true } },
      chapters: {
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          isLocked: true, // Include isLocked
          priceCoins: true, // Include priceCoins for coin-based purchases
          createdAt: true,
          isPublished: true,
          views: true,
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { bookmarks: true } },
    },
  });

  if (!novel) return null;

  if (userId) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_novelId: { userId, novelId: novel.id } },
    });
    (novel as any).isBookmarked = !!bookmark;

    // Check chapter purchases to update isLocked
    const purchases = await prisma.chapterPurchase.findMany({
      where: { userId, novelId: novel.id },
      select: { chapterId: true },
    });
    const purchasedChapterIds = new Set(purchases.map(p => p.chapterId));
    novel.chapters = novel.chapters.map(chapter => ({
      ...chapter,
      isLocked: chapter.isLocked && !purchasedChapterIds.has(chapter.id),
    }));
  }

  try {
    await redis.setex(cacheKey, CACHE_TTL.long, JSON.stringify(novel));
  } catch (error) {
    console.error("Redis cache error:", error);
  }

  return novel;
}

export async function getUserSubscription(userId: string) {
  const cacheKey = CACHE_KEYS.userSubscription(userId);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error("Redis cache error:", error);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionExpiry: true,
    },
  });

  if (user) {
    try {
      await redis.setex(cacheKey, CACHE_TTL.medium, JSON.stringify(user));
    } catch (error) {
      console.error("Redis cache error:", error);
    }
  }

  return user;
}

export async function getChapterBySlugs(
  novelSlug: string,
  chapterSlug: string
) {
  const novel = await getNovelBySlug(novelSlug);
  if (!novel) return { novel: undefined, chapter: undefined, index: -1 };
  const index = novel.chapters.findIndex(
    (c: { slug: string }) => c.slug === chapterSlug
  );
  const chapter = index >= 0 ? novel.chapters[index] : undefined;
  return { novel, chapter, index };
}
