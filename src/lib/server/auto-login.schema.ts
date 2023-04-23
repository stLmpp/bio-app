import { z } from 'zod';

export const AutoLoginSchema = z.object({
  user: z.object({
    userId: z.string(),
    username: z.string(),
    admin: z.boolean(),
  }),
  player: z.object({
    playerId: z.string(),
    name: z.string(),
  }),
});
