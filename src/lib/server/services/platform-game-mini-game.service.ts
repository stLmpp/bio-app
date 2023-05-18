import { PLATFORM_GAME_MINI_GAME_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import {
  PlatformGameMiniGameGetSchema,
  type PlatformGameMiniGameGetQuery,
} from '../schemas/platform-game-mini-game-get.schema';
import {
  PlatformGameMiniGamePostSchema,
  type PlatformGameMiniGamePostBody,
} from '../schemas/platform-game-mini-game-post.schema';
import { PlatformGameMiniGameGetOneSchema } from '../schemas/platform-game-mini-game-get-one.schema';

export class PlatformGameMiniGameService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get(query?: PlatformGameMiniGameGetQuery) {
    return httpServer(PLATFORM_GAME_MINI_GAME_END_POINT, {
      fetch: this._fetch,
      schema: PlatformGameMiniGameGetSchema,
      query,
    });
  }

  getOne(platformGameMiniGameId: string) {
    return httpServer(`${PLATFORM_GAME_MINI_GAME_END_POINT}/${platformGameMiniGameId}`, {
      fetch: this._fetch,
      schema: PlatformGameMiniGameGetOneSchema,
    });
  }

  post(body: PlatformGameMiniGamePostBody) {
    return httpServer(PLATFORM_GAME_MINI_GAME_END_POINT, {
      fetch: this._fetch,
      schema: PlatformGameMiniGamePostSchema,
      body,
      method: 'POST',
    });
  }

  delete(platformGameMiniGameId: string) {
    return httpServer(`${PLATFORM_GAME_MINI_GAME_END_POINT}/${platformGameMiniGameId}`, {
      fetch: this._fetch,
      method: 'DELETE',
      schema: z.void(),
    });
  }

  static create(_fetch: typeof fetch) {
    return new PlatformGameMiniGameService(_fetch);
  }
}
