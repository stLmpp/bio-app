import { arrayUniqBy } from '$lib/array-uniq-by.js';
import { redirect } from '@sveltejs/kit';
import { error } from 'console';
import { StatusCodes } from 'http-status-codes';
import { GameService } from '$lib/server/services/game.service.js';

export async function load({ parent, params, fetch }) {
  const { platformGameMiniGames } = await parent();
  const gameService = GameService.create(fetch);
  const [gameError, game] = await gameService.getOne(params.gameId);

  if (gameError) {
    if (gameError.status === StatusCodes.NOT_FOUND) {
      throw redirect(
        StatusCodes.MOVED_PERMANENTLY,
        `/b/score/submit/p/${params.platformId}`
      );
    }
    throw error(gameError.status, gameError);
  }

  const miniGames = arrayUniqBy(
    platformGameMiniGames.filter((item) => item.gameId === game.gameId),
    (item) => item.miniGameId
  );
  return {
    miniGames,
    game,
  };
}
