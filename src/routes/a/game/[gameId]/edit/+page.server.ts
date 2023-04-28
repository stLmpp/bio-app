import { GAME_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// TODO add action

export const load = (async ({ fetch, params }) => {
  console.log(`${GAME_END_POINT}/${params.gameId}`);
  const [responseError, game] = await httpServer(`${GAME_END_POINT}/${params.gameId}`, {
    fetch,
    schema: z.object({
      gameId: z.string(),
      name: z.string(),
      shortName: z.string(),
    }),
  });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    game,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: () => {},
} satisfies Actions;
