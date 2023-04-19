import { z } from 'zod';
import { zStringBigInt } from '$lib/z-string-big-int';

export const AutoLoginSchema = z.object({
  user: z.object({
    userId: zStringBigInt,
    username: z.string(),
    admin: z.boolean(),
  }),
  player: z.object({
    playerId: zStringBigInt,
    name: z.string(),
  }),
});
