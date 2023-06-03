import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { parseFormData } from '$lib/server/form-data';
import { AuthService } from '$lib/server/services/auth.service';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions } from './$types';
import { loadFlashMessage } from 'sveltekit-flash-message/server';

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
      return fail(formError.status, { error: formError, formData });
    }
    const authService = AuthService.create(fetch);
    const [error, response] = await authService.login(formData);
    if (error) {
      return fail(error.status, { error, formData });
    }
    const { accessToken } = response;
    cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken);
    const redirectTo = url.searchParams.get('redirectTo') ?? '/a';
    throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectTo);
  },
} satisfies Actions;

export const load = loadFlashMessage(async ({ fetch, url, cookies }) => {
  const authService = AuthService.create(fetch);

  const operationId = url.searchParams.get('operationId');
  if (operationId) {
    const [, response] = await authService.getSteamAuthToken(operationId);
    if (response) {
      cookies.set(ACCESS_TOKEN_COOKIE_KEY, response.token);
      const redirectTo = url.searchParams.get('redirectTo') ?? '/a';
      throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectTo);
    }
  }

  return {
    authSteam: authService
      .getSteamAuthUrl({
        redirectTo: 'http://localhost:5173/login/',
        replyTo: 'auth-steam_login',
      })
      .then(([, data]) => data ?? null),
  };
});
