export type BlueSkyIntent = {
  text: string;
  isMobile: boolean;
};

export const createBlueSkyIntent = (intent: BlueSkyIntent) => {
  let url: URL;

  if (intent.isMobile) url = new URL('bluesky://intent/compose');
  else url = new URL('https://bsky.app/intent/compose');

  url.searchParams.append('text', intent.text);

  return url.toString();
};

export type XIntent = {
  text: string;
  url?: string;
  hashtags?: string[];
};

export const createXIntent = (intent: XIntent) => {
  const url = new URL('https://twitter.com/intent/tweet');

  if (intent.hashtags) url.searchParams.append('hashtags', intent.hashtags.join(','));
  if (intent.url) url.searchParams.append('url', new URL(intent.url).href);

  url.searchParams.append('text', intent.text);

  return url.toString();
};
