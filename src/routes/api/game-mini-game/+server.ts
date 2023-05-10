import { parseBody } from '$lib/server/parse-request';
import { GameMiniGameService } from '$lib/server/services/game-mini-game.service';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST = (async ({ fetch, request }) => {
  const [errorBody, body] = await parseBody(
    z.object({
      gameId: z.string(),
      miniGameId: z.string(),
    }),
    await request.json()
  );
  if (errorBody) {
    throw error(errorBody.status, errorBody);
  }
  const gameMiniGameService = GameMiniGameService.create(fetch);
  const [errorResponse, response] = await gameMiniGameService.post(body);
  if (errorResponse) {
    throw error(errorResponse.status, errorResponse);
  }
  return json(response);
}) satisfies RequestHandler;
