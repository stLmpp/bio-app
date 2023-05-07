import { MODE_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const DELETE = (async ({ fetch, params }) => {
  const [responseError] = await httpServer(`${MODE_END_POINT}/${params.modeId}`, {
    fetch,
    schema: z.void(),
    method: 'DELETE',
  });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json(undefined);
}) satisfies RequestHandler;
