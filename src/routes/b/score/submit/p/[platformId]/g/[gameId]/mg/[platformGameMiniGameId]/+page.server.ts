import { Exceptions } from '$lib/exceptions.js';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const platformGameMiniGameModeId = formData.get('platformGameMiniGameModeId');
    if (!platformGameMiniGameModeId) {
      const exception = Exceptions.FormActionCustomBadRequest({
        message: 'Mode is required',
      });
      return fail(exception.status, { error: exception });
    }
    throw redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/b/score/submit/p/${params.platformId}/g/${params.gameId}/mg/${params.platformGameMiniGameId}/m/${platformGameMiniGameModeId}`
    );
  },
};
