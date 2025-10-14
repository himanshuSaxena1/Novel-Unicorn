export const dynamic = "force-dynamic";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  tls: {}, // Upstash requires TLS (rediss)
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export default redis;

export const CACHE_KEYS = {
  novel: (slug: string) => `novel:${slug}`,
  novels: (page: number, filters: string) => `novels:${page}:${filters}`,
  chapter: (novelSlug: string, chapterSlug: string) =>
    `chapter:${novelSlug}:${chapterSlug}`,
  userSubscription: (userId: string) => `user:${userId}:subscription`,
  trendingNovels: "trending:novels",
  featuredNovels: "featured:novels",
};

export const CACHE_TTL = {
  short: 1, // 5 minutes
  medium: 1, // 30 minutes
  long: 1, // 1 hour
  day: 1, // 24 hours
};
