import { dev } from '$app/environment';
import { REMOTION_BUNDLE_LOCATION } from '$env/static/private';
import { mainSchema } from '$remotion/Main';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { error, type RequestHandler } from '@sveltejs/kit';
import path from 'node:path';

export const POST: RequestHandler = async ({ request }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  // The composition you want to render
  const compositionId = 'Main';

  const data = await request.json();
  const inputProps = mainSchema.safeParse(data);
  if (!inputProps.success) {
    console.log(inputProps.error.message);
    return error(400, {
      message: inputProps.error.message
    });
  }

  let bundleLocation: string;
  if (dev) {
    bundleLocation = await bundle({
      entryPoint: path.resolve('./src/remotion/index.ts'),
      webpackOverride: (config) => config,
      publicDir: path.resolve('static')
    });
  } else {
    bundleLocation = REMOTION_BUNDLE_LOCATION;
  }

  // Get the composition you want to render. Pass `inputProps` if you
  // want to customize the duration or other metadata.
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: inputProps.data
  });

  try {
    const media = await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      imageFormat: 'png',
      muted: true,
      inputProps: inputProps.data,
      onProgress: ({ progress, renderEstimatedTime }) =>
        console.log(
          `Progress: ${Math.round(progress * 100)}% | Estimated time: ${Math.round(renderEstimatedTime / 1000)}s`
        )
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
