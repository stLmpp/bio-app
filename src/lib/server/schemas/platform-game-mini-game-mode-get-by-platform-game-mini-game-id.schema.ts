import { z } from 'zod';

export const PlatformGameMiniGameModeGetByPlatformGameMiniGameIdSchema = z.array(
  z.object({
    platformGameMiniGameModeId: z.string(),
    platformGameMiniGameId: z.string(),
    modeName: z.string(),
    modeId: z.string(),
  })
);
