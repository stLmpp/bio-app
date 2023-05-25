import { z } from 'zod';

export const MiniGameSchema = z.object({
  miniGameId: z.string(),
  name: z.string(),
});
