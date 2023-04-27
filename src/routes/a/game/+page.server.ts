import { GAME_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [gamesError, games] = await httpServer(GAME_END_POINT, {
    fetch,
    schema: z.array(
      z.object({
        gameId: z.string(),
        name: z.string(),
        shortName: z.string(),
      })
    ),
  });
  if (gamesError) {
    throw error(gamesError.status, gamesError);
  }
  return {
    games,
  };
}) satisfies PageServerLoad;
