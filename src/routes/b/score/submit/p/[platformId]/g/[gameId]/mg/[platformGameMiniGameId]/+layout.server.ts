import { PlatformGameMiniGameModeService } from '$lib/server/services/platform-game-mini-game-mode.service.js';
import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params, parent }) {
  await parent();
  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const [platformGameMiniGameError, platformGameMiniGame] =
    await platformGameMiniGameService.getOne(params.platformGameMiniGameId);

  if (platformGameMiniGameError) {
    if (platformGameMiniGameError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}/g/${params.gameId}`
      );
    }
    throw error(platformGameMiniGameError.status, platformGameMiniGameError);
  }
  const platformGameMiniGameModeService = PlatformGameMiniGameModeService.create(fetch);
  const [responseError, platformGameMiniGameModes] =
    await platformGameMiniGameModeService.get({
      platformGameMiniGameId: params.platformGameMiniGameId,
    });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    platformGameMiniGame,
    platformGameMiniGameModes,
  };
}
