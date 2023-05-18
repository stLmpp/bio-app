import { arrayUniqBy } from '$lib/array-uniq-by';
import { ModeService } from '$lib/server/services/mode.service';
import { PlatformGameMiniGameModeService } from '$lib/server/services/platform-game-mini-game-mode.service';
import { PlatformGameMiniGameService } from '$lib/server/services/platform-game-mini-game.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const platformGameMiniGameService = PlatformGameMiniGameService.create(fetch);
  const modeService = ModeService.create(fetch);
  const platformGameMiniGameModeService = PlatformGameMiniGameModeService.create(fetch);
  const [
    modesResponse,
    platformGameMiniGamesResponse,
    platformGameMiniGameModesResponse,
  ] = await Promise.all([
    modeService.get(),
    platformGameMiniGameService.get(),
    platformGameMiniGameModeService.get(),
  ]);
  const [modesError, modes] = modesResponse;
  if (modesError) {
    throw error(modesError.status, modesError);
  }
  const [platformGameMiniGamesError, platformGameMiniGames] =
    platformGameMiniGamesResponse;
  if (platformGameMiniGamesError) {
    throw error(platformGameMiniGamesError.status, platformGameMiniGamesError);
  }
  const [platformGameMiniGameModesError, platformGameMiniGameModes] =
    platformGameMiniGameModesResponse;
  if (platformGameMiniGameModesError) {
    throw error(platformGameMiniGameModesError.status, platformGameMiniGameModesError);
  }
  const platforms = arrayUniqBy(platformGameMiniGames, (item) => item.platformId).map(
    (platform) => ({
      platformId: platform.platformId,
      platformName: platform.platformName,
    })
  );
  return {
    platforms,
    modes,
    platformGameMiniGameModes,
    platformGameMiniGames,
  };
}) satisfies PageServerLoad;
