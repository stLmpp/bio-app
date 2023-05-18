import { error, json } from '@sveltejs/kit';
import { PlatformGameMiniGameModeService } from '$lib/server/services/platform-game-mini-game-mode.service';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ params, fetch }) => {
  const platformGameMiniGameModeService = PlatformGameMiniGameModeService.create(fetch);
  const [responseError] = await platformGameMiniGameModeService.delete(
    params.platformGameMiniGameModeId
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
