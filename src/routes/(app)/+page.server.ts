import { makerRecapStatsKey, redis } from '$lib/server/redis';

export const load = async () => {
  const keys = await redis.keys(makerRecapStatsKey(2025, '*'));
  return {
    totalRecaps: keys.length
  };
};
