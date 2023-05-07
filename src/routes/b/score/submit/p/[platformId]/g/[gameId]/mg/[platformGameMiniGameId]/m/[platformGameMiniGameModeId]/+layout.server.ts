import {
  PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
  PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT,
} from '$env/static/private';
import { httpServer } from '$lib/server/http-server.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function load({ fetch, params, parent }) {
  await parent();
  const [platformGameMiniGameModeError, platformGameMiniGameMode] = await httpServer(
    `${PLATFORM_GAME_MINI_GAME_MODE_END_POINT}/${params.platformGameMiniGameModeId}`,
    {
      fetch,
      schema: z.object({
        platformGameMiniGameModeId: z.string(),
        modeId: z.string(),
        modeName: z.string(),
      }),
    }
  );

  if (platformGameMiniGameModeError) {
    if (platformGameMiniGameModeError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}/g/${params.gameId}/mg/${params.platformGameMiniGameId}`
      );
    }
    throw error(platformGameMiniGameModeError.status, platformGameMiniGameModeError);
  }

  const [responseError, platformGameMiniGameModeStages] = await httpServer(
    `${PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT}/platform-game-mini-game-mode/${params.platformGameMiniGameModeId}`,
    {
      fetch,
      schema: z.array(
        z.object({
          platformGameMiniGameModeStageId: z.string(),
          stageId: z.string(),
          stageName: z.string(),
        })
      ),
    }
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    platformGameMiniGameMode,
    platformGameMiniGameModeStages,
  };
}
