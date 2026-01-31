import { sequence } from '@sveltejs/kit/hooks';
import { type Handle } from '@sveltejs/kit';
import { rateLimitter } from '$lib/server/rate-limitter';
import { paraglideMiddleware } from '$lib/paraglide/server';

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

export const i18n: Handle = async ({ event, resolve }) => {
  return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
    event.request = localizedRequest;
    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html.replace('%lang%', locale);
      }
    });
  });
};

export const handle = sequence(rateLimit, i18n);
