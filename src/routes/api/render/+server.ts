import { REMOTION_BUNDLE_LOCATION } from '$env/static/private';
import { renderMedia, selectComposition } from '@remotion/renderer';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  // The composition you want to render
  const compositionId = 'Main';

  const inputProps = {};

  // Get the composition you want to render. Pass `inputProps` if you
  // want to customize the duration or other metadata.
  const composition = await selectComposition({
    serveUrl: REMOTION_BUNDLE_LOCATION,
    id: compositionId,
    inputProps
  });

  try {
    const media = await renderMedia({
      composition,
      serveUrl: REMOTION_BUNDLE_LOCATION,
      codec: 'h264',
      imageFormat: 'png',
      // crf: 1,
      // pixelFormat: 'yuv420p',
      // colorSpace: 'bt709',
      muted: true,
      inputProps,
      onProgress: ({ progress, renderEstimatedTime }) =>
        console.log(`Progress: ${progress * 100}% | Estimated time: ${renderEstimatedTime}`)
    });
    const mediaBuffer = media.buffer;
    if (!mediaBuffer || mediaBuffer.length === 0) {
      throw new Error('Rendered media is empty');
    }

    const buffer = Buffer.from(mediaBuffer);
    return new Response(buffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error) {
    return new Response('Render failed for the following reason: ' + error, {
      status: 500
    });
  }
};
