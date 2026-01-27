import { getRenderProgress, speculateFunctionName } from '@remotion/lambda/client';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
  renderId: z.string(),
  bucketName: z.string()
});

export const POST = async ({ request }) => {
  const data = await request.json();
  const result = schema.safeParse(data);

  if (!result.success) {
    return json(JSON.stringify({ type: 'error', message: result.error.message }), {
      status: 400
    });
  }

  const { renderId, bucketName } = result.data;

  const functionName = speculateFunctionName({
    diskSizeInMb: 2048,
    memorySizeInMb: 2048,
    timeoutInSeconds: 120
  });

  const renderProgress = await getRenderProgress({
    bucketName,
    functionName,
    region: 'us-east-1',
    renderId
  });

  if (renderProgress.fatalErrorEncountered) {
    const errorMessage = renderProgress.errors[0];
    return json(
      {
        type: 'error',
        message: errorMessage
      },
      {
        status: 500
      }
    );
  }

  if (renderProgress.done) {
    return json({
      type: 'done',
      url: renderProgress.outputFile,
      size: renderProgress.outputSizeInBytes
    });
  }

  return json({
    type: 'progress',
    progress: renderProgress.overallProgress
  });
};
