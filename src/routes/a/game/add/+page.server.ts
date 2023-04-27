import { GAME_END_POINT } from '$env/static/private';
import { parseFormData } from '$lib/server/form-data';
import { httpServer } from '$lib/server/http-server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';

export const actions = {
  default: async ({ fetch, request }) => {
    const [formDataError, formData] = await parseFormData(
      zfd.formData({
        name: zfd.text(z.string().trim().nonempty().max(100)),
        shortName: zfd.text(z.string().trim().nonempty().max(10)),
      }),
      await request.formData()
    );
    if (formDataError) {
      return fail(formDataError.status, { error: formDataError });
    }
    const [responseError] = await httpServer(GAME_END_POINT, {
      fetch,
      schema: z.object({
        gameId: z.string(),
        name: z.string(),
        shortName: z.string(),
      }),
      method: 'POST',
      body: formData,
    });
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(301, '/a/game');
  },
} satisfies Actions;
