import { getUserAgentInfo } from '$lib/userAgent';

export const load = async ({ request, url }) => {
  const canonicalUrl = url.origin;
  const userAgent = request.headers.get('user-agent');
  const userAgentInfo = getUserAgentInfo(userAgent);

  return {
    canonicalUrl,
    userAgentInfo
  };
};
