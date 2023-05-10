import { PlatformService } from '$lib/server/services/platform.service';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ fetch, params }) => {
  const platformService = PlatformService.create(fetch);
  const [responseError] = await platformService.delete(params.platformId);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
