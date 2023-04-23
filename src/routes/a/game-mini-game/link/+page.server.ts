import {
  GAME_END_POINT,
  GAME_MINI_GAME_END_POINT,
  MINI_GAME_END_POINT,
} from '$env/static/private';
import { httpServer } from '$lib/server/http-server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [gamesResponse, miniGamesResponse, gameMiniGamesResponse] = await Promise.all([
    httpServer(GAME_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          gameId: z.string(),
          name: z.string(),
          shortName: z.string(),
        })
      ),
    }),
    httpServer(MINI_GAME_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          miniGameId: z.string(),
          name: z.string(),
        })
      ),
    }),
    httpServer(GAME_MINI_GAME_END_POINT, {
      fetch,
      schema: z.array(
        z.object({
          gameMiniGameId: z.string(),
          gameId: z.string(),
          miniGameId: z.string(),
        })
      ),
    }),
  ]);

  const [gamesError, games] = gamesResponse;
  const [miniGamesError, miniGames] = miniGamesResponse;
  const [gameMiniGamesError, gameMiniGames] = gameMiniGamesResponse;

  if (gamesError) {
    throw error(gamesError.status, gamesError);
  }
  if (miniGamesError) {
    throw error(miniGamesError.status, miniGamesError);
  }
  if (gameMiniGamesError) {
    throw error(gameMiniGamesError.status, gameMiniGamesError);
  }

  return {
    games,
    miniGames,
    gameMiniGames,
  };
}) satisfies PageServerLoad;
