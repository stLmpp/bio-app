import { z } from 'zod';

export const PlatformGameMiniGameModeStageGetByPlatformGameMiniGameModeIdSchema = z.array(
  z.object({
    platformGameMiniGameModeStageId: z.string(),
    stageId: z.string(),
    stageName: z.string(),
  })
);
