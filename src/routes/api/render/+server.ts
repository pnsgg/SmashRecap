import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

export const POST: RequestHandler = async ({ request, params }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  const { userId } = params;

  // The composition you want to render
  const compositionId = 'ThisIsMyRecap';

  // You only have to create a bundle once, and you may reuse it
  // for multiple renders that you can parametrize using input props.
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/remotion/index.ts'),
    // If you have a webpack override in remotion.config.ts, pass it here as well.
    webpackOverride: (config) => config,
    publicDir: path.resolve('static')
  });

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
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps
  });

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
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
