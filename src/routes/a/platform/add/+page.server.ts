import { parseFormData } from '$lib/server/form-data';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { httpServer } from '$lib/server/http-server';
import { PLATFORM_END_POINT } from '$env/static/private';

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
    const [responseError] = await httpServer(PLATFORM_END_POINT, {
      fetch,
      schema: z.object({
        platformId: z.string(),
        name: z.string(),
        shortName: z.string(),
      }),
      method: 'POST',
      body: formData,
    });
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    throw redirect(301, '/a/platform');
  },
} satisfies Actions;
