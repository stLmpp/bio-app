import { z } from 'zod';

export const GameMiniGameGetSchema = z.array(
  z.object({
    gameMiniGameId: z.string(),
    gameId: z.string(),
    miniGameId: z.string(),
    gameName: z.string(),
    miniGameName: z.string(),
  })
);
