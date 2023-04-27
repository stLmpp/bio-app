import { GAME_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ fetch, params }) => {
  const [responseError] = await httpServer(`${GAME_END_POINT}/${params.gameId}`, {
    fetch,
    schema: z.void(),
    method: 'DELETE',
  });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
