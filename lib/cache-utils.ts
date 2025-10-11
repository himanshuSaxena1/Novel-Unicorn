// lib/cache-utils.ts
import redis, { CACHE_KEYS } from "@/lib/redis";

export async function invalidateNovelCache(slug: string) {
  const cacheKey = CACHE_KEYS.novel(slug);
  try {
    await redis.del(cacheKey);
  } catch (error) {
    console.error("❌ Error invalidating cache:", error);
  }
}
