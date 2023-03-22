import { AUTH_END_POINT, REGION_END_POINT } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { formData, zfd } from 'zod-form-data';
import { parseFormData } from '$lib/server/form-data';
import type { Actions, PageServerLoad } from './$types';
import { http } from '$lib/server/http';
import { redirect } from 'sveltekit-flash-message/server';

export const actions = {
  default: async (event) => {
    const [form, formError] = await parseFormData(
      zfd.formData({
        username: zfd.text(z.string().trim().max(50).min(3)),
        email: zfd.text(z.string().trim().email().max(254)),
        password: zfd.text(z.string().min(6)),
        regionId: zfd.text(z.string().max(20).optional()),
      }),
      await event.request.formData()
    );
    if (formError) {
      return fail(formError.status, { error: formError });
    }
    const [, responseError] = await http(`${AUTH_END_POINT}/register`, {
      fetch: event.fetch,
      schema: z.any(),
      method: 'POST',
      body: form,
    });
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    const query = new URLSearchParams({
      username: form.username,
    });
    throw redirect(301, `/?${query.toString()}`, {}, event);
  },
} satisfies Actions;

export const load = (async ({ fetch, setHeaders }) => {
  const [regions, regionsError] = await http(`${REGION_END_POINT}`, {
    method: 'GET',
    fetch,
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
  });
  if (regionsError) {
    throw error(regionsError.status, regionsError);
  }
  setHeaders({
    'Cache-Control': 'public, max-age=3600',
  });
  return { regions };
}) satisfies PageServerLoad;
