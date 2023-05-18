import { z } from 'zod';

export const PlatformGameMiniGameModeGetOneSchema = z.object({
  platformGameMiniGameModeId: z.string(),
  modeId: z.string(),
  modeName: z.string(),
  playerQuantity: z.number(),
});
