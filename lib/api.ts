import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export class NovelAPI {
  static async getFeaturedNovels(limit = 8) {
    const cacheKey = CACHE_KEYS.featuredNovels;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis cache read error:", error);
    }

    const novels = await prisma.novel.findMany({
      where: { isFeatured: true },
      include: {
        author: { select: { username: true, id: true } },
        chapters: {
          select: { id: true, title: true, accessTier: true, createdAt: true },
          orderBy: { order: "desc" },
          take: 1,
        },
        _count: { select: { chapters: true, bookmarks: true, reviews: true } },
      },
      orderBy: { featuredAt: "desc" },
      take: limit,
    });

    if (!novels.length) {
      console.warn("No featured novels found in database");
    }

    const result = novels.map((novel) => ({
      ...novel,
      latestChapter: novel.chapters[0] || null,
      chapterCount: novel._count.chapters,
      bookmarkCount: novel._count.bookmarks,
      reviewCount: novel._count.reviews,
    }));

    try {
      await redis.setex(cacheKey, CACHE_TTL.short, JSON.stringify(result));
    } catch (error) {
      console.error("Redis cache write error:", error);
    }

    return result;
  }

  static async getTrendingNovels(limit = 10) {
    const cacheKey = CACHE_KEYS.trendingNovels;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis cache error:", error);
    }

    const novels = await prisma.novel.findMany({
      include: {
        author: { select: { username: true, id: true } },
        chapters: {
          select: { id: true, title: true, accessTier: true, createdAt: true },
          orderBy: { order: "desc" },
          take: 1,
        },
        _count: { select: { chapters: true, bookmarks: true, reviews: true } },
      },
      orderBy: { views: "desc" },
      take: limit,
    });

    const result = novels.map((novel) => ({
      ...novel,
      latestChapter: novel.chapters[0] || null,
      chapterCount: novel._count.chapters,
      bookmarkCount: novel._count.bookmarks,
      reviewCount: novel._count.reviews,
    }));

    try {
      await redis.setex(cacheKey, CACHE_TTL.medium, JSON.stringify(result));
    } catch (error) {
      console.error("Redis cache error:", error);
    }

    return result;
  }

  static async getNovelsByFilters() {
    const filters = {
      page: 1,
      limit: 12,
      search: "",
      genres: [],
      status: "ONGOING",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    const skip = (filters.page - 1) * filters.limit;

    const where: any = {};

    // ✅ Search filters
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        {
          author: {
            username: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    // ✅ Genre filters
    if (filters.genres && filters.genres.length > 0) {
      where.genres = { hasSome: filters.genres };
    }

    // ✅ Status filter
    if (filters.status) {
      where.status = filters.status;
    }

    // ✅ Validate sortBy against allowed Prisma columns
    const validSortFields = ["createdAt", "views", "rating", "title"];
    const safeSortBy = validSortFields.includes(filters.sortBy) ? filters.sortBy : "createdAt";

    // ✅ Fetch data
    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        include: {
          author: { select: { username: true, id: true } },
          chapters: {
            select: {
              id: true,
              title: true,
              accessTier: true,
              createdAt: true,
            },
            orderBy: { order: "desc" },
            take: 1,
          },
          _count: {
            select: { chapters: true, bookmarks: true, reviews: true },
          },
        },
        orderBy: { [safeSortBy]: filters.sortOrder }, // ✅ correct computed key usage
        skip,
        take: filters.limit,
      }),
      prisma.novel.count({ where }),
    ]);

    // ✅ Return formatted result
    return {
      novels: novels.map((novel) => ({
        ...novel,
        latestChapter: novel.chapters[0] || null,
        chapterCount: novel._count.chapters,
        bookmarkCount: novel._count.bookmarks,
        reviewCount: novel._count.reviews,
      })),
      total,
      pages: Math.ceil(total / filters.limit),
      currentPage: filters.page,
    };
  }
}

export class SubscriptionAPI {
  static async getActivePlans() {
    return await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  }

  static async getUserSubscriptions(userId: string) {
    return await prisma.userSubscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getHighestUserTier(userId: string): Promise<string> {
    const subscriptions = await this.getUserSubscriptions(userId);

    if (subscriptions.length === 0) return "FREE";

    const tierOrder = ["FREE", "SMALL", "MEDIUM", "PREMIUM"];
    const userTiers = subscriptions.map((sub) => sub.plan.tier);

    return userTiers.reduce((highest, current) => {
      const currentIndex = tierOrder.indexOf(current);
      const highestIndex = tierOrder.indexOf(highest);
      return currentIndex > highestIndex ? current : highest;
    }, "FREE");
  }
}

export class AdminAPI {
  static async getDashboardStats() {
    const [
      totalUsers,
      totalNovels,
      totalChapters,
      totalSubscriptions,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.novel.count(),
      prisma.chapter.count(),
      prisma.userSubscription.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers,
      totalNovels,
      totalChapters,
      totalSubscriptions,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
    };
  }

  static async getRecentActivity() {
    const [recentUsers, recentNovels, recentPayments] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          role: true,
        },
      }),
      prisma.novel.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { username: true } } },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { username: true, email: true } } },
      }),
    ]);

    return { recentUsers, recentNovels, recentPayments };
  }
}

export async function getChapter(slug: string, chapterSlug: string) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const novel = await prisma.novel.findFirst({
      where: {
        slug,
      },
    });

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const chapterData = await prisma.chapter.findFirst({
      where: {
        slug: chapterSlug,
        novelId: novel.id,
      },
    });

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
        ? prisma.chapterPurchase.findFirst({
            where: { chapterId: chapter.id, userId },
          })
        : null,
    ]);

    // Clear chapter cache
    await redis.del(CACHE_KEYS.chapter(slug, chapterSlug));

    // Check if the user owns the chapter
    const isOwnedByUser = userId && userChapters !== null;
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
