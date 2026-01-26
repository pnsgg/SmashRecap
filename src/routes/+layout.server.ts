import { getUserAgentInfo } from '$lib/userAgent';

export const load = async ({ request }) => {
  const userAgent = request.headers.get('user-agent');
  const userAgentInfo = getUserAgentInfo(userAgent);

  return {
    userAgentInfo
  };
};
