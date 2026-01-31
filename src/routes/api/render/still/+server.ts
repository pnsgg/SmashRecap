import { env } from '$env/dynamic/private';
import { makeStillUrlKey, redis } from '$lib/server/redis';
import { mainSchema } from '$lib/schemas/stats';
import { getFunctions, renderStillOnLambda } from '@remotion/lambda/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
    userId: z.number(),
    stats: mainSchema
});

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const results = schema.safeParse(data);
    if (!results.success) {
        return error(400, {
            message: results.error.message
        });
    }

    const { userId, stats } = results.data;
    const year = stats.thisIsMyRecapProps.year;

    // Check if a render is available in cache
    const key = makeStillUrlKey(year, userId);
    const cachedUrl = await redis.get(key);
    if (cachedUrl) {
        return json({
            url: cachedUrl
        });
    }

    // Trigger a still render on AWS
    const inputProps = stats;

    const [lambda] = await getFunctions({
        region: 'us-east-1',
        compatibleOnly: true
    });

    const COMPOSITION = 'VerticalStill';
    const { url } = await renderStillOnLambda({
        apiKey: process.env.REMOTION_AWS_ACCESS_KEY_ID,
        region: 'us-east-1',
        functionName: lambda.functionName,
        composition: COMPOSITION,
        serveUrl: env.REMOTION_BUNDLE_LOCATION,
        inputProps,
        frame: 0,
        imageFormat: 'png',
        privacy: 'public'
    });

    // Store the URL in redis for future use
    await redis.set(key, url);

    return json({ url });
};
