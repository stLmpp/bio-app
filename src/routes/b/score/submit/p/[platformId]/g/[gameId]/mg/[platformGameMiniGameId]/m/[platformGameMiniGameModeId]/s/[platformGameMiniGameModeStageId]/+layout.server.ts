import { PlatformGameMiniGameModeStageService } from '$lib/server/services/platform-game-mini-game-mode-stage.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params, parent }) {
  await parent();
  const platformGameMinIGameModeStageService =
    PlatformGameMiniGameModeStageService.create(fetch);
  const [platformGameMiniGameModeStageError, platformGameMiniGameModeStage] =
    await platformGameMinIGameModeStageService.getOne(
      params.platformGameMiniGameModeStageId
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
