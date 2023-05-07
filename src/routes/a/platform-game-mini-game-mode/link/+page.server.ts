import {
  MODE_END_POINT,
  PLATFORM_GAME_MINI_GAME_END_POINT,
  PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
} from '$env/static/private';
import { arrayUniqBy } from '$lib/array-uniq-by';
import { httpServer } from '$lib/server/http-server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [
    modesResponse,
    platformGameMiniGamesResponse,
    platformGameMiniGameModesResponse,
  ] = await Promise.all([
    httpServer(MODE_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          modeId: z.string(),
          name: z.string(),
        })
      ),
    }),
    httpServer(PLATFORM_GAME_MINI_GAME_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          platformGameMiniGameId: z.string(),
          platformId: z.string(),
          platformName: z.string(),
          gameMiniGameId: z.string(),
          gameId: z.string(),
          gameName: z.string(),
          miniGameId: z.string(),
          miniGameName: z.string(),
        })
      ),
    }),
    httpServer(PLATFORM_GAME_MINI_GAME_MODE_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          platformGameMiniGameModeId: z.string(),
          platformGameMiniGameId: z.string(),
          modeName: z.string(),
          modeId: z.string(),
          platformId: z.string(),
          platformName: z.string(),
          gameMiniGameId: z.string(),
          gameId: z.string(),
          gameName: z.string(),
          miniGameId: z.string(),
          miniGameName: z.string(),
        })
      ),
    }),
  ]);
  const [modesError, modes] = modesResponse;
  if (modesError) {
    throw error(modesError.status, modesError);
  }
  const [platformGameMiniGamesError, platformGameMiniGames] =
    platformGameMiniGamesResponse;
  if (platformGameMiniGamesError) {
    throw error(platformGameMiniGamesError.status, platformGameMiniGamesError);
  }
  const [platformGameMiniGameModesError, platformGameMiniGameModes] =
    platformGameMiniGameModesResponse;
  if (platformGameMiniGameModesError) {
    throw error(platformGameMiniGameModesError.status, platformGameMiniGameModesError);
  }
  const platforms = arrayUniqBy(platformGameMiniGames, (item) => item.platformId).map(
    (platform) => ({
      platformId: platform.platformId,
      platformName: platform.platformName,
    })
  );
  return {
    platforms,
    modes,
    platformGameMiniGameModes,
    platformGameMiniGames,
  };
}) satisfies PageServerLoad;
