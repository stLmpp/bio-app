import { z } from 'zod';

export const GameSchema = z.object({
  gameId: z.string(),
  name: z.string(),
  shortName: z.string(),
});
