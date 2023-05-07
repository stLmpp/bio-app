import { MODE_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [modesError, modes] = await httpServer(MODE_END_POINT, {
    fetch,
    schema: z.array(
      z.object({
        modeId: z.string(),
        name: z.string(),
        playerQuantity: z.number(),
      })
    ),
  });
  if (modesError) {
    throw error(modesError.status, modesError);
  }
  return {
    modes,
  };
}) satisfies PageServerLoad;
