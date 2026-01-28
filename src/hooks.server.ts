import { rateLimitter } from '$lib/server/rate-limitter';
import { type Handle } from '@sveltejs/kit';

export const rateLimit: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api/')) {
    const ip = event.getClientAddress();
    const { allowed } = await rateLimitter.check(ip);

    if (!allowed) {
      return new Response('Too Many Requests', {
        status: 429
      });
    }
  }

  return resolve(event);
};

export const handle = rateLimit;
