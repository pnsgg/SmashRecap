import { REMOTION_BUNDLE_LOCATION } from '$env/static/private';
import { mainSchema } from '$remotion/Main';
import { getFunctions, renderMediaOnLambda } from '@remotion/lambda/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import 'dotenv/config';

export const POST: RequestHandler = async ({ request }) => {
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  const data = await request.json();
  const inputPropsResult = mainSchema.safeParse(data);
  if (!inputPropsResult.success) {
    return error(400, {
      message: inputPropsResult.error.message
    });
  }

  const inputProps = inputPropsResult.data;

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
    serveUrl: REMOTION_BUNDLE_LOCATION,
    codec: 'vp9',
    downloadBehavior: {
      type: 'download',
      fileName: 'output.webm'
    },
    inputProps
  });

  return json({ bucketName, renderId });
};
