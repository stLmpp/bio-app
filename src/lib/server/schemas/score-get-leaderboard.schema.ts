import { z } from 'zod';
import { PaginationMetadataSchema } from './pagination-metadata.schema';

export const ScoreGetLeaderboardSchema = z.object({
  metadata: PaginationMetadataSchema,
  platformName: z.string(),
  platformShortName: z.string(),
  gameName: z.string(),
  gameShortName: z.string(),
  miniGameName: z.string(),
  modeName: z.string(),
  stages: z.array(
    z.object({
      stageId: z.string(),
      stageName: z.string(),
      stageShortName: z.string(),
      platformGameMiniGameModeStageId: z.string(),
    })
  ),
  players: z.array(
    z.object({
      playerId: z.string(),
      playerName: z.string(),
      position: z.number(),
      total: z.number(),
      scores: z.array(
        z
          .object({
            scoreId: z.string(),
            score: z.number(),
            worldRecordAt: z.string().datetime().optional(),
            partners: z.array(
              z.object({
                playerName: z.string(),
                playerId: z.string(),
              })
            ),
          })
          .nullable()
      ),
    })
  ),
});

export interface ScoreGetLeaderboardQuery {
  page: number;
}
