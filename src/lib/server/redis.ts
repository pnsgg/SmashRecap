import { env } from '$env/dynamic/private';
import Redis from 'ioredis';

export const redis = new Redis(env.REDIS_URL as string);
