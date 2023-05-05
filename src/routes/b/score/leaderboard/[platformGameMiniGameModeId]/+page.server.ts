import { SCORE_LEADERBOARD_END_POINT } from '$env/static/private';
import { PageQuerySchema } from '$lib/schemas.js';
import { httpServer } from '$lib/server/http-server.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function load({ fetch, params, url }) {
  const page = PageQuerySchema.parseOrFallback(url.searchParams.get('p'), 1);
  const [responseError, response] = await httpServer(SCORE_LEADERBOARD_END_POINT, {
    fetch,
    query: {
      platformGameMiniGameModeId: params.platformGameMiniGameModeId,
      page,
    },
    schema: z.object({
      metadata: z.object({
        page: z.number(),
        itemsPerPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number(),
      }),
      platformName: z.string(),
      platformShortName: z.string(),
      gameName: z.string(),
      gameShortName: z.string(),
      miniGameName: z.string(),
      modeName: z.string(),
      stages: z.array(
        z.object({
          stageId: z.string(),
          stageName: z.string(),
          stageShortName: z.string(),
          platformGameMiniGameModeStageId: z.string(),
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
                partners: z.array(
                  z.object({
                    playerName: z.string(),
                    playerId: z.string(),
                  })
                ),
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
  if (page > response.metadata.totalPages) {
    const newUrl = new URL(url);
    newUrl.searchParams.set('p', String(response.metadata.totalPages));
    throw redirect(StatusCodes.PERMANENT_REDIRECT, newUrl.pathname + newUrl.search);
  }
  return {
    leaderboard: response,
  };
}
