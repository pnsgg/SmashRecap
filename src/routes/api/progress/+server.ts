import { getRenderProgress, speculateFunctionName } from '@remotion/lambda/client';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
  renderId: z.string().min(1),
  bucketName: z.string().min(1)
});

export const POST: RequestHandler = async ({ request }) => {
  // TODO: Implement authorization check
  const authorization = request.headers.get('Authorization');
  console.log('Authorization:', authorization);

  const data = await request.json();
  const validation = schema.safeParse(data);
  if (!validation.success) {
    return new Response(JSON.stringify({ type: 'error', message: 'Invalid request' }), {
      status: 400
    });
  }

  const { renderId, bucketName } = validation.data;

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
    const errorMessage = renderProgress.errors[0].message;
    return new Response(errorMessage, { status: 500 });
  }

  if (renderProgress.done) {
    return new Response(
      JSON.stringify({
        type: 'done',
        url: renderProgress.outputFile as string,
        size: renderProgress.outputSizeInBytes as number
      })
    );
  }

  return new Response(
    JSON.stringify({
      type: 'progress',
      progress: Math.max(0.03, renderProgress.overallProgress)
    })
  );
};
