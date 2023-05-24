import { PlatformGameMiniGameModeStageService } from '$lib/server/services/platform-game-mini-game-mode-stage.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { PlatformGameMiniGameModeCharacterCostumeService } from '$lib/server/services/platform-game-mini-game-mode-character-costume.service';

export async function load({ fetch, params, parent }) {
  await parent();
  const platformGameMinIGameModeStageService =
    PlatformGameMiniGameModeStageService.create(fetch);
  const platformGameMiniGameModeCharacterCostumeService =
    PlatformGameMiniGameModeCharacterCostumeService.create(fetch);
  const [platformGameMiniGameModeStageResponse, charactersResponse] = await Promise.all([
    platformGameMinIGameModeStageService.getOne(params.platformGameMiniGameModeStageId),
    platformGameMiniGameModeCharacterCostumeService.getByPlatformGameMiniGameModeId(
      params.platformGameMiniGameModeId
    ),
  ]);
  const [platformGameMiniGameModeStageError, platformGameMiniGameModeStage] =
    platformGameMiniGameModeStageResponse;
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

  const [charactersError, characters] = charactersResponse;

  if (charactersError) {
    throw error(charactersError.status, charactersError);
  }

  return {
    platformGameMiniGameModeStage,
    characters,
  };
}
