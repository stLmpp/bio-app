import { GAME_END_POINT } from '$env/static/private';
import { parseFormData } from '$lib/server/form-data';
import { httpServer } from '$lib/server/http-server';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { zfd } from 'zod-form-data';

export const load = (async ({ fetch, params }) => {
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
    const [responseError] = await httpServer(`${GAME_END_POINT}/${params.gameId}`, {
      method: 'PATCH',
      fetch,
      schema: z.object({
        gameId: z.string(),
        name: z.string(),
        shortName: z.string(),
      }),
      body: formData,
    });
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(301, '/a/game');
  },
} satisfies Actions;
