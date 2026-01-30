import { z } from 'zod';

/**
 * Sanitizes a filename to be safe for file systems and URL paths.
 * Uses Zod transformation pipeline for clarity.
 */
export const sanitizeFilename = (name: string): string => {
  const schema = z
    .string()
    .trim()
    .min(1)
    .max(255)
    .transform((val) => val.replace(/\s+/g, '-')) // Replace spaces with dashes
    .transform((val) => val.replace(/[^a-zA-Z0-9._-]/g, '')) // Remove unsafe chars
    .transform((val) => val.replace(/-+/g, '-')) // Collapse dashes
    .transform((val) => val.replace(/_+/g, '_')) // Collapse underscores
    .transform((val) => {
      // Ensure extension is .webm
      if (val.toLowerCase().endsWith('.webm')) return val;
      const lastDotIndex = val.lastIndexOf('.');
      if (lastDotIndex > 0 && lastDotIndex > val.length - 6) {
        return val.substring(0, lastDotIndex) + '.webm';
      }
      return `${val}.webm`;
    });

  return schema.parse(name);
};
