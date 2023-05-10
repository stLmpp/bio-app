import { error, json } from '@sveltejs/kit';
import { GameService } from '$lib/server/services/game.service';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ fetch, params }) => {
  const gameService = GameService.create(fetch);
  const [responseError] = await gameService.delete(params.gameId);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
