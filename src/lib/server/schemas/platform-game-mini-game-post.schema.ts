import { z } from 'zod';

export const PlatformGameMiniGamePostSchema = z.object({
  platformId: z.string(),
  gameMiniGameId: z.string(),
  platformGameMiniGameId: z.string(),
});

export interface PlatformGameMiniGamePostBody {
  platformId: string;
  gameMiniGameId: string;
}
