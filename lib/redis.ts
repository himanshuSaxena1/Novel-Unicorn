import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: {}, 
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export default redis

// Cache keys
export const CACHE_KEYS = {
  novel: (slug: string) => `novel:${slug}`,
  novels: (page: number, filters: string) => `novels:${page}:${filters}`,
  chapter: (novelSlug: string, chapterSlug: string) => `chapter:${novelSlug}:${chapterSlug}`,
  userSubscription: (userId: string) => `user:${userId}:subscription`,
  trendingNovels: 'trending:novels',
  featuredNovels: 'featured:novels',
}

export const CACHE_TTL = {
  short: 300, // 5 minutes
  medium: 1800, // 30 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
}