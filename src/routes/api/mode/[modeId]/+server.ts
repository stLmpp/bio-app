import { ModeService } from '$lib/server/services/mode.service';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ fetch, params }) => {
  const modeService = ModeService.create(fetch);
  const [responseError] = await modeService.delete(params.modeId);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
