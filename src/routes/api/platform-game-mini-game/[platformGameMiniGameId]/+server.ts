import { PLATFORM_GAME_MINI_GAME_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ params, fetch }) => {
  const [responseError] = await httpServer(
    `${PLATFORM_GAME_MINI_GAME_END_POINT}/${params.platformGameMiniGameId}`,
    {
      fetch,
      method: 'DELETE',
      schema: z.void(),
    }
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
