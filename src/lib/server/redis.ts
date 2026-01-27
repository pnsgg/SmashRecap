import { env } from '$env/dynamic/private';
import Redis from 'ioredis';

export const redis = new Redis(env.REDIS_URL as string);

/**
 * Creates a key pointing to a video URL for the user's recap for a given year
 * @param year year of the recap to get
 * @param userId  start.gg id of the player
 * @returns A redis key pointing to a recap URL for the user for a given year
 */
export const makeRecapUrlKey = (year: number, userId: number): string =>
  `recap:url:${year}:${userId}`;

/**
 * Creates a key pointing to stats for a user in a given year
 * @param year year of the recap to get
 * @param userId start.gg id of the player
 * @returns A redis key pointing to stats for a given player in a given year
 */
export const makerRecapStatsKey = (year: number, userId: number | '*'): string =>
  `recap:stats:${year}:${userId}`;
