import { z } from 'zod';

export const PlatformGameMiniGameModeStageGetOneSchema = z.object({
  platformGameMiniGameModeStageId: z.string(),
  stageId: z.string(),
  stageName: z.string(),
});
