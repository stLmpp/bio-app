import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { parseFormData } from '$lib/server/form-data';
import { AuthService } from '$lib/server/services/auth.service';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';

export const actions = {
  default: async ({ fetch, request, cookies, url }) => {
    const [formError, formData] = await parseFormData(
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
    const authService = AuthService.create(fetch);
    const [error, response] = await authService.login(formData);
    if (error) {
      return fail(error.status, { error });
    }
    const { accessToken } = response;
    cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken);
    const redirectTo = url.searchParams.get('redirectTo') ?? '/a';
    throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectTo);
  },
} satisfies Actions;

export { load } from 'sveltekit-flash-message/server';
