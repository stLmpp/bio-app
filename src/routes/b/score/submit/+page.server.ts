import { PLATFORM_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Exceptions } from '$lib/exceptions.js';

export async function load({ fetch }) {
  const [platformsError, platforms] = await httpServer(PLATFORM_END_POINT, {
    fetch,
    schema: z.array(
      z.object({
        platformId: z.string(),
        name: z.string(),
      })
    ),
  });

  if (platformsError) {
    throw error(platformsError.status, platformsError);
  }

  return {
    platforms,
  };
}

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const platformId = formData.get('platformId');
    if (!platformId) {
      const exception = Exceptions.FormActionCustomBadRequest({
        message: 'Platform is required',
      });
      return fail(exception.status, { error: exception });
    }
    throw redirect(StatusCodes.MOVED_PERMANENTLY, `/b/score/submit/p/${platformId}`);
  },
};
