import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ params, fetch }) => {
  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const [responseError] = await platformGameMiniGameService.delete(
    params.platformGameMiniGameId
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
