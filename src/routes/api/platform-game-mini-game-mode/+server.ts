import { parseBody } from '$lib/server/parse-request';
import { PlatformGameMiniGameModeService } from '$lib/server/services/platform-game-mini-game-mode.service';
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
  const platformGameMiniGameModeService = PlatformGameMiniGameModeService.create(fetch);
  const [responseError, platformGameMiniGameMode] =
    await platformGameMiniGameModeService.post(body);
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return json({
    platformGameMiniGameMode,
  });
}) satisfies RequestHandler;
