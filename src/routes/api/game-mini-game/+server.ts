import { GAME_MINI_GAME_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { parseBody } from '$lib/server/parse-request';
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
  const [errorResponse, response] = await httpServer(GAME_MINI_GAME_END_POINT, {
    method: 'POST',
    fetch,
    schema: z.object({
      gameMiniGameId: z.string(),
      gameId: z.string(),
      miniGameId: z.string(),
    }),
    body: {
      gameId: body.gameId,
      miniGameId: body.miniGameId,
    },
  });
  if (errorResponse) {
    throw error(errorResponse.status, errorResponse);
  }
  return json(response);
}) satisfies RequestHandler;
