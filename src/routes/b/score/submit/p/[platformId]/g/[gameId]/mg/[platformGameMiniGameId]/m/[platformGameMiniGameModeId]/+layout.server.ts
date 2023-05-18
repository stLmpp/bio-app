import { PlatformGameMiniGameModeStageService } from '$lib/server/services/platform-game-mini-game-mode-stage.service.js';
import { PlatformGameMiniGameModeService } from '$lib/server/services/platform-game-mini-game-mode.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params, parent }) {
  await parent();
  const platformGameMiniGameModeService = PlatformGameMiniGameModeService.create(fetch);
  const [platformGameMiniGameModeError, platformGameMiniGameMode] =
    await platformGameMiniGameModeService.getOne(params.platformGameMiniGameModeId);

  if (platformGameMiniGameModeError) {
    if (platformGameMiniGameModeError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}/g/${params.gameId}/mg/${params.platformGameMiniGameId}`
      );
    }
    throw error(platformGameMiniGameModeError.status, platformGameMiniGameModeError);
  }
  const platformGameMiniGameModeStageService =
    PlatformGameMiniGameModeStageService.create(fetch);
  const [responseError, platformGameMiniGameModeStages] =
    await platformGameMiniGameModeStageService.getByPlatformGameMiniGameModeId(
      params.platformGameMiniGameModeId
    );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    platformGameMiniGameMode,
    platformGameMiniGameModeStages,
  };
}
