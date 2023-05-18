import { PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import { PlatformGameMiniGameModeStageGetByPlatformGameMiniGameModeIdSchema } from '../schemas/platform-game-mini-game-mode-stage-get-by-platform-game-mini-game-mode-id.schema';
import { PlatformGameMiniGameModeStageGetOneSchema } from '../schemas/platform-game-mini-game-mode-stage-get-one.schema';

export class PlatformGameMiniGameModeStageService {
  private constructor(private readonly _fetch: typeof fetch) {}

  getByPlatformGameMiniGameModeId(platformGameMiniGameModeId: string) {
    return httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT}/platform-game-mini-game-mode/${platformGameMiniGameModeId}`,
      {
        fetch: this._fetch,
        schema: PlatformGameMiniGameModeStageGetByPlatformGameMiniGameModeIdSchema,
      }
    );
  }

  getOne(platformGameMiniGameModeStageId: string) {
    return httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_STAGE_END_POINT}/${platformGameMiniGameModeStageId}`,
      {
        fetch: this._fetch,
        schema: PlatformGameMiniGameModeStageGetOneSchema,
      }
    );
  }

  static create(_fetch: typeof fetch) {
    return new PlatformGameMiniGameModeStageService(_fetch);
  }
}
