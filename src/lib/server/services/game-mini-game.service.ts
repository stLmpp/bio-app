import { GAME_MINI_GAME_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { GameMiniGameGetSchema } from '../schemas/game-mini-game-get.schema';
import {
  GameMiniGamePostSchema,
  type GameMiniGamePostBody,
} from '../schemas/game-mini-game-post.schema';

export class GameMiniGameService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(GAME_MINI_GAME_END_POINT, {
      fetch: this._fetch,
      schema: GameMiniGameGetSchema,
    });
  }

  post(body: GameMiniGamePostBody) {
    return httpServer(GAME_MINI_GAME_END_POINT, {
      fetch: this._fetch,
      schema: GameMiniGamePostSchema,
      body,
      method: 'POST',
    });
  }

  delete(gameMiniGameId: string) {
    return httpServer(`${GAME_MINI_GAME_END_POINT}/${gameMiniGameId}`, {
      fetch: this._fetch,
      schema: z.void(),
      method: 'DELETE',
    });
  }

  static create(_fetch: typeof fetch) {
    return new GameMiniGameService(_fetch);
  }
}
