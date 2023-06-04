import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { ErrorCodes } from '$lib/error-codes';
import type { HttpError } from '$lib/http-shared';
import { parseFormData } from '$lib/server/form-data';
import { AuthService } from '$lib/server/services/auth.service';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { loadFlashMessage } from 'sveltekit-flash-message/server';
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
      return fail(formError.status, { error: formError, formData });
    }
    const authService = AuthService.create(fetch);
    const [responseError, response] = await authService.login(formData);
    if (responseError) {
      return fail(responseError.status, { error: responseError, formData });
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
  let operationError: HttpError | undefined = undefined;
  if (operationId) {
    const [responseError, response] = await authService.getSteamAuthToken(operationId);
    if (response) {
      cookies.set(ACCESS_TOKEN_COOKIE_KEY, response.token);
      const redirectTo = url.searchParams.get('redirectTo') ?? '/a';
      throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectTo);
    }
    if (responseError.errorCode !== ErrorCodes.AUTH_STEAM_TIMEOUT_GET_TOKEN) {
      // TODO handler others errors
      const newUrl = new URL(url);
      newUrl.searchParams.delete('operationId');
      throw redirect(StatusCodes.MOVED_PERMANENTLY, newUrl.toString());
    }
    operationError = responseError;
  }

  return {
    operationError,
    authSteam: authService
      .getSteamAuthUrl({
        redirectTo: url.toString(),
        replyTo: 'auth-steam_login',
      })
      .then(([, data]) => data ?? null),
  };
});
