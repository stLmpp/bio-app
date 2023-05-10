import { Exceptions } from '$lib/exceptions.js';
import { PlatformService } from '$lib/server/services/platform.service.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch }) {
  const platformService = PlatformService.create(fetch);
  const [platformsError, platforms] = await platformService.get();

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
