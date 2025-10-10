import { prisma } from "@/lib/prisma";
import redis, { CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

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

  static async getNovelsByFilters(filters: {
    page?: number;
    limit?: number;
    search?: string;
    genres?: string[];
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 12,
      search,
      genres,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (genres && genres.length > 0) {
      where.genres = { hasSome: genres };
    }

    if (status) {
      where.status = status;
    }

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
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.novel.count({ where }),
    ]);

    return {
      novels: novels.map((novel) => ({
        ...novel,
        latestChapter: novel.chapters[0] || null,
        chapterCount: novel._count.chapters,
        bookmarkCount: novel._count.bookmarks,
        reviewCount: novel._count.reviews,
      })),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
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
