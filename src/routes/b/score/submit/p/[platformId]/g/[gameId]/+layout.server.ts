import { GAME_END_POINT } from '$env/static/private';
import { arrayUniqBy } from '$lib/array-uniq-by.js';
import { httpServer } from '$lib/server/http-server.js';
import { redirect } from '@sveltejs/kit';
import { error } from 'console';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function load({ parent, params }) {
  const { platformGameMiniGames } = await parent();

  const [gameError, game] = await httpServer(`${GAME_END_POINT}/${params.gameId}`, {
    fetch,
    schema: z.object({
      gameId: z.string(),
      name: z.string(),
    }),
  });

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
