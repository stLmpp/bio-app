import { z } from 'zod';

export const PlatformGameMiniGameModeCharacterCostumeGetByPlatformGameMiniGameModeIdSchema =
  z.array(
    z.object({
      platformGameMiniGameModeCharacterCostumeId: z.string(),
      characterFullName: z.string(),
    })
  );
