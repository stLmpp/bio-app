import { parseFormData } from '$lib/server/form-data';
import { GameService } from '$lib/server/services/game.service';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const gameService = GameService.create(fetch);
  const [responseError, game] = await gameService.getOne(params.gameId);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    game,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ fetch, params, request }) => {
    const [formDataError, formData] = await parseFormData(
      zfd.formData({
        name: zfd.text(z.string().trim().nonempty().max(100).optional()),
        shortName: zfd.text(z.string().trim().nonempty().max(10).optional()),
      }),
      await request.formData()
    );
    if (formDataError) {
      return fail(formDataError.status, { error: formDataError });
    }
    const gameService = GameService.create(fetch);
    const [responseError] = await gameService.patch(params.gameId, formData);
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(301, '/a/game');
  },
} satisfies Actions;
