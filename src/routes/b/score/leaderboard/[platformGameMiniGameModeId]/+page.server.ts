import { httpServer } from '$lib/server/http-server.js';
import { SCORE_LEADERBOARD_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { error, redirect } from '@sveltejs/kit';

export async function load({ fetch, params, url }) {
  const page = url.searchParams.get('p');
  if (!page) {
    const newUrl = new URL(url);
    newUrl.searchParams.set('p', '1');
    throw redirect(301, newUrl.pathname + newUrl.search);
  }
  const [responseError, response] = await httpServer(SCORE_LEADERBOARD_END_POINT, {
    fetch,
    query: {
      platformGameMiniGameModeId: params.platformGameMiniGameModeId,
      page: url.searchParams.get('p'),
    },
    schema: z.object({
      metadata: z.object({
        page: z.number(),
        itemsPerPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number(),
      }),
      stages: z.array(
        z.object({
          stageId: z.string(),
          stageName: z.string(),
          stageShortName: z.string(),
        })
      ),
      players: z.array(
        z.object({
          playerId: z.string(),
          playerName: z.string(),
          position: z.number(),
          total: z.number(),
          scores: z.array(
            z
              .object({
                scoreId: z.string(),
                score: z.number(),
                worldRecordAt: z.string().datetime().optional(),
              })
              .nullable()
          ),
        })
      ),
    }),
  });
  if (responseError) {
    throw error(responseError.status, responseError);
  }
  return {
    leaderboard: response,
  };
}
