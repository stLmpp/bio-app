import { AuthService } from '$lib/server/services/auth.service';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { RegionService } from '$lib/server/services/region.service';
import { parseFormData } from '$lib/server/form-data';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { StatusCodes } from 'http-status-codes';

export const actions = {
  default: async ({ fetch, request, params, cookies, url }) => {
    const [formError, form] = await parseFormData(
      zfd.formData({
        name: zfd.text(z.string().min(3).max(50)),
        email: zfd.text(z.string().email().max(254)),
        regionId: zfd.numeric(z.number().min(-1)),
      }),
      await request.formData()
    );
    if (formError) {
      return fail(formError.status, { error: formError });
    }
    const authService = AuthService.create(fetch);
    const [responseError, response] = await authService.registerWithSteamOperation(
      params.operationId,
      form
    );
    if (responseError) {
      return fail(responseError.status, { error: responseError });
    }
    cookies.set(ACCESS_TOKEN_COOKIE_KEY, response.token);
    const redirectTo = url.searchParams.get('redirectTo') ?? '/a';
    throw redirect(StatusCodes.MOVED_PERMANENTLY, redirectTo);
  },
} satisfies Actions;

export const load = (async (event) => {
  const authService = AuthService.create(event.fetch);
  const regionService = RegionService.create(event);
  const [response, regionsResponse] = await Promise.all([
    authService.extendSteamOperation(event.params.operationId),
    regionService.get(),
  ]);
  const [responseError, extend] = response;
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  const [regionsError, regions] = regionsResponse;
  if (regionsError) {
    throw error(regionsError.status, regionsError);
  }
  return {
    suggestedPlayerName: extend.suggestedPlayerName,
    regions,
  };
}) satisfies PageServerLoad;
