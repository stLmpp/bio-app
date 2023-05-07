import { Exceptions } from '$lib/exceptions.js';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const platformGameMiniGameModeStageId = formData.get(
      'platformGameMiniGameModeStageId'
    );
    if (!platformGameMiniGameModeStageId) {
      const exception = Exceptions.FormActionCustomBadRequest({
        message: 'Stage is required',
      });
      return fail(exception.status, { error: exception });
    }
    throw redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/b/score/submit/p/${params.platformId}/g/${params.gameId}/mg/${params.platformGameMiniGameId}/m/${params.platformGameMiniGameModeId}/s/${platformGameMiniGameModeStageId}`
    );
  },
};
