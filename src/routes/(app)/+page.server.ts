import { redis } from '$lib/server/redis';

export const load = async () => {
    const count = await redis.get('total_recaps');
    return {
        totalRecaps: count ? parseInt(count) : 0
    };
};
