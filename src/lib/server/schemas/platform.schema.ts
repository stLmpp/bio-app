import { z } from 'zod';

export const PlatformSchema = z.object({
  platformId: z.string(),
  name: z.string(),
  shortName: z.string(),
});
