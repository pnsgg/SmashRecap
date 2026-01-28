import { redis } from '$lib/server/redis';
import type { Redis } from 'ioredis';

type RateLimitterOptions = {
  limit: number;
};

export class RateLimitter {
  private redis: Redis;
  private opts: RateLimitterOptions;

  constructor(redis: Redis, opts: RateLimitterOptions) {
    this.redis = redis;
    this.opts = opts;
  }

  async check(key: string): Promise<{ allowed: boolean; remaining: number }> {
    const currentMinute = Math.floor(Date.now() / 60000);
    const redisKey = `rate-limit:${key}:${currentMinute}`;

    try {
      const multi = this.redis.multi();
      multi.incr(redisKey);
      multi.expire(redisKey, 59);
      const results = await multi.exec();

      if (!results) return { allowed: true, remaining: 0 };

      const incrErr = results[0][0];
      const count = results[0][1] as number;

      if (incrErr) return { allowed: true, remaining: 0 };

      const allowed = count <= this.opts.limit;
      const remaining = Math.max(0, this.opts.limit - count);

      return { allowed, remaining };
    } catch {
      return { allowed: true, remaining: 0 };
    }
  }
}

export const rateLimitter = new RateLimitter(redis, {
  limit: 20
});
