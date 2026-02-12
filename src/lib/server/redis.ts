import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import Redis from 'ioredis';

const options = building ? { lazyConnect: true } : {};
export const redis = new Redis(env.REDIS_URL as string, options);

/**
 * Creates a key pointing to a video URL for the user's recap for a given year
 * @param year year of the recap to get
 * @param userSlug start.gg slug of the player
 * @returns A redis key pointing to a recap URL for the user for a given year
 */
export const makeRecapUrlKey = (year: number, userSlug: string): string =>
  `recap:url:${year}:${userSlug}`;

/**
 * Creates a key pointing to a still image URL for the user's recap for a given year
 * @param year year of the recap to get
 * @param userSlug start.gg slug of the player
 * @returns A redis key pointing to a recap still image URL for the user for a given year
 */
export const makeStillUrlKey = (year: number, userSlug: string): string =>
  `recap:still:url:${year}:${userSlug}`;

/**
 * Creates a key pointing to stats for a user in a given year
 * @param year year of the recap to get
 * @param userSlug start.gg slug of the player
 * @returns A redis key pointing to stats for a given player in a given year
 */
export const makeRecapStatsKey = (year: number, userSlug: string | '*'): string =>
  `recap:stats:${year}:${userSlug}`;
