import { PLATFORM_GAME_MINI_GAME_MODE_CHARACTER_COSTUME_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import { PlatformGameMiniGameModeCharacterCostumeGetByPlatformGameMiniGameModeIdSchema } from '../schemas/platform-game-mini-game-mode-character-costume-get-by-platform-game-mini-game-mode-id.schema';

export class PlatformGameMiniGameModeCharacterCostumeService {
  private constructor(private readonly _fetch: typeof fetch) {}

  getByPlatformGameMiniGameModeId(platformGameMiniGameModeId: string) {
    return httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_CHARACTER_COSTUME_END_POINT}/platform-game-mini-game-mode/${platformGameMiniGameModeId}`,
      {
        fetch: this._fetch,
        schema:
          PlatformGameMiniGameModeCharacterCostumeGetByPlatformGameMiniGameModeIdSchema,
      }
    );
  }

  static create(_fetch: typeof fetch) {
    return new PlatformGameMiniGameModeCharacterCostumeService(_fetch);
  }
}
