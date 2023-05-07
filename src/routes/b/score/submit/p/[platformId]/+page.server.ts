import { Exceptions } from '$lib/exceptions.js';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const gameId = formData.get('gameId');
    if (!gameId) {
      const exception = Exceptions.FormActionCustomBadRequest({
        message: 'Game is required',
      });
      return fail(exception.status, { error: exception });
    }
    throw redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/b/score/submit/p/${params.platformId}/g/${gameId}`
    );
  },
};
