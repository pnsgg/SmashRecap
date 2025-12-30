import { REMOTION_BUNDLE_LOCATION } from '$env/static/private';
import { renderMedia, selectComposition } from '@remotion/renderer';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  // The composition you want to render
  const compositionId = 'ThisIsMyRecap';

  const inputProps = {
    year: 2025,
    user: {
      gamerTag: 'RouxChov',
      image: 'images/rouxchov.jpg',
      country: 'France',
      prefix: 'PNS',
      pronouns: 'He/Him',
      socialMedias: {
        x: 'le_grld'
      }
    }
  };

  // Get the composition you want to render. Pass `inputProps` if you
  // want to customize the duration or other metadata.
  const composition = await selectComposition({
    serveUrl: REMOTION_BUNDLE_LOCATION,
    id: compositionId,
    inputProps
  });

  await renderMedia({
    composition,
    serveUrl: REMOTION_BUNDLE_LOCATION,
    codec: 'h264',
    imageFormat: 'png',
    crf: 1,
    pixelFormat: 'yuv420p',
    colorSpace: 'bt709',
    muted: true,
    outputLocation: `out/${compositionId}.mp4`,
    inputProps
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Render completed successfully'
    })
  );
};
