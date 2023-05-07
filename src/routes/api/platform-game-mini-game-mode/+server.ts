import { PLATFORM_GAME_MINI_GAME_MODE_END_POINT } from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { parseBody } from '$lib/server/parse-request';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
  const [bodyError, body] = await parseBody(
    z.object({
      platformGameMiniGameId: z.string(),
      modeId: z.string(),
    }),
    await request.json()
  );
  if (bodyError) {
    throw error(bodyError.status, bodyError);
  }
  const [responseError, platformGameMiniGameMode] = await httpServer(
    PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
    {
      fetch,
      schema: z.object({
        platformGameMiniGameId: z.string(),
        modeId: z.string(),
        platformGameMiniGameModeId: z.string(),
      }),
      body,
      method: 'POST',
    }
  );
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json({
    platformGameMiniGameMode,
  });
}) satisfies RequestHandler;
