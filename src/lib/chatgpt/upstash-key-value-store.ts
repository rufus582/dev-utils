import type { KeyValueStore } from "@opencoredev/loginwithchatgpt-server";
import { Redis } from "@upstash/redis";

export function createUpstashRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

/** Shared Upstash-backed {@link KeyValueStore} for Login with ChatGPT handlers. */
export function createUpstashKeyValueStore<T>(
  redis: Redis,
  prefix: string,
): KeyValueStore<T> {
  const toKey = (id: string) => `${prefix}:${id}`;

  return {
    async get(id: string) {
      const value = await redis.get<T>(toKey(id));
      return value ?? undefined;
    },
    async set(id: string, value: T, options?: { ttlMs?: number }) {
      const redisKey = toKey(id);
      if (options?.ttlMs !== undefined) {
        await redis.set(redisKey, value, { px: options.ttlMs });
        return;
      }
      await redis.set(redisKey, value);
    },
    async delete(id: string) {
      await redis.del(toKey(id));
    },
  };
}
