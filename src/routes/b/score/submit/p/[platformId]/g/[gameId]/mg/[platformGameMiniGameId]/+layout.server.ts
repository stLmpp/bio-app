import {
  PLATFORM_GAME_MINI_GAME_END_POINT,
  PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
} from '$env/static/private';
import { httpServer } from '$lib/server/http-server.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function load({ fetch, params, parent }) {
  await parent();
  const [platformGameMiniGameError, platformGameMiniGame] = await httpServer(
    `${PLATFORM_GAME_MINI_GAME_END_POINT}/${params.platformGameMiniGameId}`,
    {
      fetch,
      schema: z.object({
        platformGameMiniGameId: z.string(),
        miniGameId: z.string(),
        miniGameName: z.string(),
      }),
    }
  );

  if (platformGameMiniGameError) {
    if (platformGameMiniGameError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}/g/${params.gameId}`
      );
    }
    throw error(platformGameMiniGameError.status, platformGameMiniGameError);
  }

  const [responseError, platformGameMiniGameModes] = await httpServer(
    PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
    {
      fetch,
      schema: z.array(
        z.object({
          platformGameMiniGameModeId: z.string(),
          modeName: z.string(),
          modeId: z.string(),
        })
      ),
      query: {
        platformGameMiniGameId: params.platformGameMiniGameId,
      },
    }
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    platformGameMiniGame,
    platformGameMiniGameModes,
  };
}
