import { z } from 'zod';

export const PlatformGameMiniGameModePostSchema = z.object({
  platformGameMiniGameModeId: z.string(),
  platformGameMiniGameId: z.string(),
  modeId: z.string(),
});

export interface PlatformGameMiniGameModePostBody {
  platformGameMiniGameId: string;
  modeId: string;
}
