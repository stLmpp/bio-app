import { z } from 'zod';

export const PlatformGameMiniGameModeGetSchema = z.array(
  z.object({
    platformGameMiniGameModeId: z.string(),
    platformGameMiniGameId: z.string(),
    modeName: z.string(),
    modeId: z.string(),
    platformId: z.string(),
    platformName: z.string(),
    gameMiniGameId: z.string(),
    gameId: z.string(),
    gameName: z.string(),
    miniGameId: z.string(),
    miniGameName: z.string(),
  })
);

export interface PlatformGameMiniGameModeGetQuery {
  platformGameMiniGameId?: string;
}
