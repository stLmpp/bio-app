import { GameMiniGameService } from '$lib/server/services/game-mini-game.service';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ fetch, params }) => {
  const gameMiniGameService = GameMiniGameService.create(fetch);
  const [responseError] = await gameMiniGameService.delete(params.gameMiniGameId);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
