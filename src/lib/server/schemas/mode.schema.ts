import { z } from 'zod';

export const ModeSchema = z.object({
  modeId: z.string(),
  name: z.string(),
  playerQuantity: z.number(),
});
