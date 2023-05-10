import { GameMiniGameService } from '$lib/server/services/game-mini-game.service';
import { GameService } from '$lib/server/services/game.service';
import { MiniGameService } from '$lib/server/services/mini-game.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const gameService = GameService.create(fetch);
  const miniGameService = MiniGameService.create(fetch);
  const gameMiniGameService = GameMiniGameService.create(fetch);
  const [gamesResponse, miniGamesResponse, gameMiniGamesResponse] = await Promise.all([
    gameService.get(),
    miniGameService.get(),
    gameMiniGameService.get(),
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
