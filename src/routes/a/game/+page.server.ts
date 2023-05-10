import { GameService } from '$lib/server/services/game.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const gameService = GameService.create(fetch);
  const [gamesError, games] = await gameService.get();
  if (gamesError) {
    throw error(gamesError.status, gamesError);
  }
  return {
    games,
  };
}) satisfies PageServerLoad;
