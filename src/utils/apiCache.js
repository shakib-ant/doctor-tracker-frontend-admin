// Simple in-memory API cache with configurable TTL
const cache = new Map();
const DEFAULT_TTL = 1000 * 60 * 3; // 3 minutes

export const getCachedData = (key, ttlMs = DEFAULT_TTL) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > ttlMs) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

export const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (prefix = "") => {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};

