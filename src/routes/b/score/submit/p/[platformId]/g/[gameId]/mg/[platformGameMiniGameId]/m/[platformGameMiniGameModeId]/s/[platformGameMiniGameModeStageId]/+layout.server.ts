import { PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function load({ fetch, params, parent }) {
  await parent();
  const [platformGameMiniGameModeStageError, platformGameMiniGameModeStage] =
    await httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT}/${params.platformGameMiniGameModeStageId}`,
      {
        fetch,
        schema: z.object({
          platformGameMiniGameModeStageId: z.string(),
          stageId: z.string(),
          stageName: z.string(),
        }),
      }
    );
  if (platformGameMiniGameModeStageError) {
    if (platformGameMiniGameModeStageError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}/g/${params.gameId}/mg/${params.platformGameMiniGameId}/m/${params.platformGameMiniGameModeId}/s/${params.platformGameMiniGameModeStageId}`
      );
    }
    throw error(
      platformGameMiniGameModeStageError.status,
      platformGameMiniGameModeStageError
    );
  }

  return {
    platformGameMiniGameModeStage,
  };
}
