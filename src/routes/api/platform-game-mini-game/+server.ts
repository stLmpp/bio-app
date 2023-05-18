import { parseBody } from '$lib/server/parse-request';
import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
  const [bodyError, body] = await parseBody(
    z.object({
      platformId: z.string(),
      gameMiniGameId: z.string(),
    }),
    await request.json()
  );
  if (bodyError) {
    throw error(bodyError.status, bodyError);
  }
  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const [responseError, response] = await platformGameMiniGameService.post(body);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json({
    platformGameMiniGame: response,
  });
}) satisfies RequestHandler;
