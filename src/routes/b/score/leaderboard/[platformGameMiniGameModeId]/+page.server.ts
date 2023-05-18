import { PageQuerySchema } from '$lib/schemas.js';
import { ScoreService } from '$lib/server/services/score.service.js';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export async function load({ fetch, params, url }) {
  const page = PageQuerySchema.parseOrFallback(url.searchParams.get('p'), 1);
  const scoreLeaderboardService = ScoreService.create(fetch);
  const [responseError, response] = await scoreLeaderboardService.getLeaderboard(
    params.platformGameMiniGameModeId,
    {
      page,
    }
  );
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
