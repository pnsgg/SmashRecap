import {
  REMOTION_AWS_ACCESS_KEY_ID,
  REMOTION_AWS_SECRET_ACCESS_KEY,
  REMOTION_AWS_SERVE_URL
} from '$env/static/private';
import { renderMediaOnLambda, speculateFunctionName } from '@remotion/lambda/client';
import type { RequestHandler } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

export const POST: RequestHandler = async ({ request, params }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  const { userId } = params;

  const functionName = speculateFunctionName({
    diskSizeInMb: 2048,
    memorySizeInMb: 2048,
    timeoutInSeconds: 120
  });

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: 'us-east-1',
    functionName,
    serveUrl: REMOTION_AWS_SERVE_URL,
    apiKey: REMOTION_AWS_ACCESS_KEY_ID,
    envVariables: {
      REMOTION_AWS_ACCESS_KEY_ID,
      REMOTION_AWS_SECRET_ACCESS_KEY
    },
    composition: 'ThisIsMyRecap',
    inputProps: {},
    codec: 'h264',
    imageFormat: 'png',
    maxRetries: 1,
    framesPerLambda: 30,
    privacy: 'public'
  });

  return new Response(
    JSON.stringify({
      renderId,
      bucketName
    })
  );
};
