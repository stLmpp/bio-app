import { PLATFORM_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
  const [platformsError, platforms] = await httpServer(PLATFORM_END_POINT, {
    fetch,
    schema: z.array(
      z.object({
        platformId: z.string(),
        name: z.string(),
        shortName: z.string(),
      })
    ),
  });
  if (platformsError) {
    throw error(platformsError.status, platformsError);
  }
  return {
    platforms,
  };
}) satisfies PageServerLoad;
