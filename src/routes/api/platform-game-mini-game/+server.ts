import { parseBody } from '$lib/server/parse-request';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { httpServer } from '$lib/server/http-server';
import { PLATFORM_GAME_MINI_GAME_END_POINT } from '$env/static/private';

export const POST = (async ({ request, fetch }) => {
  const [bodyError, body] = await parseBody(
    z.object({
      platformId: z.string(),
      gameMiniGameId: z.string(),
    }),
    await request.json()
  );
  if (bodyError) {
    throw error(bodyError.status, bodyError);
  }
  const [responseError, response] = await httpServer(PLATFORM_GAME_MINI_GAME_END_POINT, {
    fetch,
    schema: z.object({
      platformId: z.string(),
      gameMiniGameId: z.string(),
      platformGameMiniGameId: z.string(),
    }),
    body,
    method: 'POST',
  });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json({
    platformGameMiniGame: response,
  });
}) satisfies RequestHandler;
