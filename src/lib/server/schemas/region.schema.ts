import { z } from 'zod';

export const RegionSchema = z.object({
  regionId: z.number(),
  name: z.string(),
  shortName: z.string(),
});
