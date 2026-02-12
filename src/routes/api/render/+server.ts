import { env } from '$env/dynamic/private';
import { sanitizeFilename } from '$lib/server/sanitize';
import { makeRecapUrlKey, redis } from '$lib/server/redis';
import { mainSchema } from '$lib/schemas/stats';
import { getFunctions, renderMediaOnLambda } from '@remotion/lambda/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  userSlug: z.string(),
  stats: mainSchema,
  filename: z.string()
});

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const results = schema.safeParse(data);
  if (!results.success) {
    return error(400, {
      message: results.error.message
    });
  }

  // Check if a render is not available
  const key = makeRecapUrlKey(results.data.stats.thisIsMyRecapProps.year, results.data.userSlug);
  const videoUrl = await redis.get(key);
  if (videoUrl) {
    return json({
      url: videoUrl
    });
  }

  // Trigger a render on AWS otherwise
  const inputProps = results.data.stats;

  const [lambda] = await getFunctions({
    region: 'us-east-1',
    compatibleOnly: true
  });

  const COMPOSITION = 'Main';
  const { bucketName, renderId } = await renderMediaOnLambda({
    apiKey: process.env.REMOTION_AWS_ACCESS_KEY_ID,
    region: 'us-east-1',
    functionName: lambda.functionName,
    composition: COMPOSITION,
    serveUrl: env.REMOTION_BUNDLE_LOCATION,
    codec: 'vp9',
    downloadBehavior: {
      type: 'download',
      fileName: sanitizeFilename(results.data.filename)
    },
    inputProps
  });

  return json({ bucketName, renderId });
};
