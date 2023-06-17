import { arrayUniqBy } from '$lib/array-uniq-by.js';
import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service.js';
import { PlatformService } from '$lib/server/services/platform.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params }) {
  const platformService = PlatformService.create(fetch);
  const [platformError, platform] = await platformService.getOne(params.platformId);

  if (platformError) {
    if (platformError.status === StatusCodes.NOT_FOUND) {
      throw redirect(StatusCodes.MOVED_PERMANENTLY, '/b/score/submit');
    }
    throw error(platformError.status, platformError);
  }

  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const [responseError, platformGameMiniGames] =
    await platformGameMiniGameService.getByPlatformId(params.platformId);

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
