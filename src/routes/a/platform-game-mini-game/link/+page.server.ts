import { arrayUniqBy } from '$lib/array-uniq-by';
import { GameMiniGameService } from '$lib/server/services/game-mini-game.service';
import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service';
import { PlatformService } from '$lib/server/services/platform.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const platformService = PlatformService.create(fetch);
  const gameMiniGameService = GameMiniGameService.create(fetch);
  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const [platformsResponse, gameMiniGamesResponse, platformGameMiniGamesResponse] =
    await Promise.all([
      platformService.get(),
      gameMiniGameService.get(),
      platformGameMiniGameService.get(),
    ]);
  const [platformsError, platforms] = platformsResponse;
  if (platformsError) {
    throw error(platformsError.status, platformsError);
  }
  const [gameMiniGamesError, gameMiniGames] = gameMiniGamesResponse;
  if (gameMiniGamesError) {
    throw error(gameMiniGamesError.status, gameMiniGamesError);
  }
  const [platformGameMiniGamesError, platformGameMiniGames] =
    platformGameMiniGamesResponse;
  if (platformGameMiniGamesError) {
    throw error(platformGameMiniGamesError.status, platformGameMiniGamesError);
  }
  const games = arrayUniqBy(gameMiniGames, (item) => item.gameId).map((game) => ({
    gameId: game.gameId,
    name: game.gameName,
  }));
  const miniGames = arrayUniqBy(gameMiniGames, (item) => item.miniGameId).map(
    (miniGame) => ({ miniGameId: miniGame.miniGameId, name: miniGame.miniGameName })
  );
  return {
    platforms,
    gameMiniGames,
    games,
    miniGames,
    platformGameMiniGames,
  };
}) satisfies PageServerLoad;
