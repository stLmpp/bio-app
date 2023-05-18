import { z } from 'zod';

export const PlatformGameMiniGameGetOneSchema = z.object({
  platformGameMiniGameId: z.string(),
  miniGameId: z.string(),
  miniGameName: z.string(),
});
