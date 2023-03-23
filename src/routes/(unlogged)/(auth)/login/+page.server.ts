import { AUTH_END_POINT } from '$env/static/private';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { parseFormData } from '$lib/server/form-data';
import { http } from '$lib/server/http';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';

export const actions = {
  default: async ({ fetch, request, cookies }) => {
    const [formData, formError] = await parseFormData(
      zfd.formData({
        usernameOrEmail: zfd.text(
          z.union([z.string().trim().email().max(254), z.string().trim().min(3).max(50)])
        ),
        password: z.string().min(6),
      }),
      await request.formData()
    );
    if (formError) {
      return fail(formError.status, { error: formError });
    }
    const [response, error] = await http(`${AUTH_END_POINT}/login`, {
      fetch,
      method: 'POST',
      schema: z.object({
        accessToken: z.string(),
      }),
      body: formData,
    });
    if (error) {
      return fail(error.status, { error });
    }
    const { accessToken } = response;
    cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, { httpOnly: true });
    throw redirect(301, '/a'); // TODO figure out why it's no redirecting to /b when not an admin
  },
} satisfies Actions;

export { load } from 'sveltekit-flash-message/server';
