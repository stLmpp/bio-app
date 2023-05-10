import { z } from 'zod';

export const GameMiniGamePostSchema = z.object({
  gameMiniGameId: z.string(),
  gameId: z.string(),
  miniGameId: z.string(),
});

export interface GameMiniGamePostBody {
  gameId: string;
  miniGameId: string;
}
