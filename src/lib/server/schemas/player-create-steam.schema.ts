import { z } from 'zod';

export const PlayerCreateSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  regionId: z.number(),
  steamid: z.string(),
});

export interface PlayerCreateBody {
  name?: string;
}
