import {
  PLATFORM_END_POINT,
  PLATFORM_GAME_MINI_GAME_END_POINT,
} from '$env/static/private';
import { httpServer } from '$lib/server/http-server.js';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { arrayUniqBy } from '$lib/array-uniq-by.js';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params }) {
  const [platformError, platform] = await httpServer(
    `${PLATFORM_END_POINT}/${params.platformId}`,
    {
      fetch,
      schema: z.object({
        platformId: z.string(),
        name: z.string(),
      }),
    }
  );

  if (platformError) {
    if (platformError.status === StatusCodes.NOT_FOUND) {
      throw redirect(StatusCodes.MOVED_PERMANENTLY, '/b/score/submit');
    }
    throw error(platformError.status, platformError);
  }

  const [responseError, platformGameMiniGames] = await httpServer(
    PLATFORM_GAME_MINI_GAME_END_POINT,
    {
      fetch,
      schema: z.array(
        z.object({
          platformGameMiniGameId: z.string(),
          gameId: z.string(),
          gameName: z.string(),
          miniGameId: z.string(),
          miniGameName: z.string(),
        })
      ),
      query: {
        platformId: params.platformId,
      },
    }
  );

  if (responseError) {
    throw error(responseError.status, responseError);
  }

  const games = arrayUniqBy(platformGameMiniGames, (item) => item.gameId).map((item) => ({
    gameId: item.gameId,
    gameName: item.gameName,
  }));

  return {
    games,
    platformGameMiniGames,
    platform,
  };
}
