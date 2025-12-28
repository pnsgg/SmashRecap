interface UserAgentInfo {
  browser: string;
  os: string;
  platform: string;
  isMobile: boolean;
}

export function getUserAgentInfo(userAgent: string | null): UserAgentInfo {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      platform: 'Unknown',
      isMobile: false
    };
  }

  const ua = userAgent.toLowerCase();
  let browser = 'Unknown';
  let os = 'Unknown';
  let platform = 'Unknown';
  let isMobile = false;

  const browserMatchers = [
    { name: 'Chrome', regex: /chrome\/([\d.]+)/ },
    { name: 'Firefox', regex: /firefox\/([\d.]+)/ },
    { name: 'Safari', regex: /version\/([\d.]+).*safari/ },
    { name: 'Internet Explorer', regex: /(?:msie |rv:)([\d.]+)/ },
    { name: 'Edge', regex: /edge\/([\d.]+)/ }
  ];

  const osMatchers = [
    { name: 'Windows', regex: /windows nt/ },
    { name: 'Mac OS', regex: /mac os x/ },
    { name: 'Android', regex: /android/, mobile: true },
    { name: 'iOS', regex: /iphone|ipad/, mobile: true },
    { name: 'Linux', regex: /linux/ }
  ];

  const platformMatchers = [
    { name: 'Mobile', regex: /mobile/, mobile: true },
    { name: 'Tablet', regex: /tablet/, mobile: true },
    { name: 'Desktop', regex: /.*/ }
  ];

  for (const { name, regex } of browserMatchers) {
    const match = ua.match(regex);
    if (match) {
      browser = name;
      break;
    }
  }

  for (const { name, regex, mobile } of osMatchers) {
    if (regex.test(ua)) {
      os = name;
      if (mobile) isMobile = true;
      break;
    }
  }

  for (const { name, regex, mobile } of platformMatchers) {
    if (regex.test(ua)) {
      platform = name;
      if (mobile) isMobile = true;
      break;
    }
  }

  return {
    browser,
    os,
    platform,
    isMobile
  };
}
