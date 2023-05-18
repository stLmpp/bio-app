import { z } from 'zod';

export const PlatformGameMiniGameGetSchema = z.array(
  z.object({
    platformGameMiniGameId: z.string(),
    platformId: z.string(),
    platformName: z.string(),
    gameMiniGameId: z.string(),
    gameId: z.string(),
    gameName: z.string(),
    miniGameId: z.string(),
    miniGameName: z.string(),
  })
);

export interface PlatformGameMiniGameGetQuery {
  platformId?: string;
}
