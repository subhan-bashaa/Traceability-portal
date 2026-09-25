import { createClient } from 'redis';
import { env } from '../config/env.js';

/**
 * Enterprise Cache Service
 * Supports Redis with transparent In-Memory fallback for local development.
 */

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlSeconds = 3600) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiry });
  }

  del(key) {
    this.store.delete(key);
  }

  flush() {
    this.store.clear();
  }
}

const memoryFallback = new MemoryCache();
let redisClient = null;
let isRedisReady = false;

// Initialize Redis if configured
if (env.REDIS_URL) {
  try {
    redisClient = createClient({ url: env.REDIS_URL });

    redisClient.on('connect', () => {
      console.log('✓ Redis client connected.');
    });

    redisClient.on('ready', () => {
      isRedisReady = true;
      console.log('✓ Redis client ready for caching.');
    });

    redisClient.on('error', (err) => {
      console.warn(`Redis connection issue: ${err.message}. Falling back to In-Memory cache.`);
      isRedisReady = false;
    });

    // Attempt non-blocking connection
    redisClient.connect().catch((err) => {
      console.warn(`Could not connect to Redis at ${env.REDIS_URL}: ${err.message}. Using In-Memory cache.`);
      isRedisReady = false;
    });
  } catch (err) {
    console.warn(`Failed to initialize Redis client: ${err.message}. Using In-Memory cache.`);
    isRedisReady = false;
  }
} else {
  // Silent fallback when REDIS_URL is not set
}

export const cacheService = {
  /**
   * Get value from cache (Redis or Memory)
   */
  async get(key) {
    if (isRedisReady && redisClient) {
      try {
        const data = await redisClient.get(key);
        if (data) {
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        }
        return null;
      } catch (err) {
        console.warn(`Redis GET error for key ${key}: ${err.message}. Falling back to memory.`);
      }
    }
    return memoryFallback.get(key);
  },

  /**
   * Set value in cache with TTL in seconds
   */
  async set(key, value, ttlSeconds = env.AI_CACHE_TTL) {
    if (isRedisReady && redisClient) {
      try {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await redisClient.set(key, serialized, { EX: ttlSeconds });
        return;
      } catch (err) {
        console.warn(`Redis SET error for key ${key}: ${err.message}. Falling back to memory.`);
      }
    }
    memoryFallback.set(key, value, ttlSeconds);
  },

  /**
   * Delete key from cache
   */
  async del(key) {
    if (isRedisReady && redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {
        console.warn(`Redis DEL error for key ${key}: ${err.message}`);
      }
    }
    memoryFallback.del(key);
  },

  /**
   * Flush all keys (useful in tests)
   */
  async flush() {
    if (isRedisReady && redisClient) {
      try {
        await redisClient.flushAll();
      } catch (err) {
        console.warn(`Redis FLUSH error: ${err.message}`);
      }
    }
    memoryFallback.flush();
  },

  /**
   * Status indicator
   */
  isRedisConnected() {
    return isRedisReady;
  },
};

export default cacheService;
