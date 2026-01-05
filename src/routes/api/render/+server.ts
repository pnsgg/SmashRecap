import { dev } from '$app/environment';
import { REMOTION_BUNDLE_LOCATION, S3_BUCKET_NAME } from '$env/static/private';
import { s3Client } from '$lib/server/s3';
import { mainSchema } from '$remotion/Main';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { error, type RequestHandler } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import path from 'node:path';

export const POST: RequestHandler = async ({ request }) => {
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  const data = await request.json();
  const inputPropsResult = mainSchema.safeParse(data);
  if (!inputPropsResult.success) {
    console.log(inputPropsResult.error.message);
    return error(400, {
      message: inputPropsResult.error.message
    });
  }

  const inputProps = inputPropsResult.data;

  const bucketName = S3_BUCKET_NAME;

  // Generate Cache Key
  const hash = createHash('sha256').update(JSON.stringify(inputProps)).digest('hex');
  const key = `${hash}.mp4`;

  // Try to get from S3
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    const response = await s3Client.send(command);
    if (response.Body) {
      console.log('Serving from cache:', key);
      const buffer = Buffer.from(await response.Body.transformToByteArray());
      return new Response(buffer);
    }
  } catch (e) {
    console.error(e);
  }

  // The composition you want to render
  const compositionId = 'Main';
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
    inputProps
  });

  try {
    const media = await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      imageFormat: 'png',
      muted: true,
      inputProps,
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

    // Upload to S3
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: 'video/mp4'
        })
      );
      console.log('Saved to cache:', key);
    } catch (s3Error) {
      console.error('Failed to save to S3:', s3Error);
    }

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
