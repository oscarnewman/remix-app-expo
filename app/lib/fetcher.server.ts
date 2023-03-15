import type LRUCache from "lru-cache";
import { cache } from "~/lib/cache.server";
import hash from "object-hash";

export async function cached<T>(
  key: Parameters<typeof hash>[0] | string,
  fetcher: () => Promise<T>,
  options: LRUCache.SetOptions<string, any> = {}
): Promise<T> {
  let hashedKey: string;
  if (typeof key === "string") {
    hashedKey = key;
  } else {
    hashedKey = hash(key);
  }

  const cached = cache.get(hashedKey);
  if (cached) {
    console.log("cache hit", key);
    return Promise.resolve(cached);
  }

  console.log("cache miss", key);
  const value = await fetcher();
  await cache.set(hashedKey, value, options);
  return value;
}
