import { PLATFORM_GAME_MINI_GAME_MODE_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { PlatformGameMiniGameModeGetByPlatformGameMiniGameIdSchema } from '../schemas/platform-game-mini-game-mode-get-by-platform-game-mini-game-id.schema';
import { PlatformGameMiniGameModeGetOneSchema } from '../schemas/platform-game-mini-game-mode-get-one.schema';
import {
  PlatformGameMiniGameModeGetSchema,
  type PlatformGameMiniGameModeGetQuery,
} from '../schemas/platform-game-mini-game-mode-get.schema';
import {
  PlatformGameMiniGameModePostSchema,
  type PlatformGameMiniGameModePostBody,
} from '../schemas/platform-game-mini-game-mode-post.schema';

export class PlatformGameMiniGameModeService {
  private constructor(private readonly _fetch: typeof fetch) {}

  getByPlatformGameMiniGameId(platformGameMiniGameId: string) {
    return httpServer(
      [
        PLATFORM_GAME_MINI_GAME_MODE_END_POINT,
        'platform-game-mini-game',
        platformGameMiniGameId,
      ],
      {
        fetch: this._fetch,
        schema: PlatformGameMiniGameModeGetByPlatformGameMiniGameIdSchema,
      }
    );
  }

  get(query?: PlatformGameMiniGameModeGetQuery) {
    return httpServer(PLATFORM_GAME_MINI_GAME_MODE_END_POINT, {
      fetch: this._fetch,
      schema: PlatformGameMiniGameModeGetSchema,
      query,
    });
  }

  getOne(platformGameMiniGameModeId: string) {
    return httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_END_POINT}/${platformGameMiniGameModeId}`,
      {
        fetch: this._fetch,
        schema: PlatformGameMiniGameModeGetOneSchema,
      }
    );
  }

  post(body: PlatformGameMiniGameModePostBody) {
    return httpServer(PLATFORM_GAME_MINI_GAME_MODE_END_POINT, {
      fetch: this._fetch,
      schema: PlatformGameMiniGameModePostSchema,
      body,
      method: 'POST',
    });
  }

  delete(platformGameMiniGameModeId: string) {
    return httpServer(
      `${PLATFORM_GAME_MINI_GAME_MODE_END_POINT}/${platformGameMiniGameModeId}`,
      {
        fetch: this._fetch,
        method: 'DELETE',
        schema: z.void(),
      }
    );
  }

  static create(_fetch: typeof fetch) {
    return new PlatformGameMiniGameModeService(_fetch);
  }
}
