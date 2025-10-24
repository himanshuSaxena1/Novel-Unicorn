import redis, { CACHE_KEYS } from "@/lib/redis";

export async function clearNovelCaches() {
  try {
    const keys = await redis.keys("trending:novels*");
    const keys2 = await redis.keys("featured:novels*");
    const allKeys = [...keys, ...keys2];

    if (allKeys.length > 0) {
      await redis.del(...allKeys);
    }
  } catch (err) {
    console.error("Failed to clear novel caches:", err);
  }
}
