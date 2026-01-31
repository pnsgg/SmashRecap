import { makeRecapStatsKey, redis } from '$lib/server/redis';

export const load = async () => {
  const totalVideos = await redis.keys(makeRecapStatsKey(2025, '*'));
  return {
    totalRecaps: totalVideos.length
  };
};
