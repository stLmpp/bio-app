import { GAME_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { GameGetOneSchema } from '../schemas/game-get-one.schema';
import { GameGetSchema } from '../schemas/game-get.schema';
import { GamePatchSchema, type GamePatchBody } from '../schemas/game-patch.schema';
import { GamePostSchema, type GamePostBody } from '../schemas/game-post.schema';

export class GameService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(GAME_END_POINT, {
      fetch: this._fetch,
      schema: GameGetSchema,
    });
  }

  getOne(gameId: string) {
    return httpServer(`${GAME_END_POINT}/${gameId}`, {
      fetch: this._fetch,
      schema: GameGetOneSchema,
    });
  }

  patch(gameId: string, body: GamePatchBody) {
    return httpServer(`${GAME_END_POINT}/${gameId}`, {
      fetch: this._fetch,
      schema: GamePatchSchema,
      body,
      method: 'PATCH',
    });
  }

  post(body: GamePostBody) {
    return httpServer(GAME_END_POINT, {
      fetch: this._fetch,
      schema: GamePostSchema,
      body,
      method: 'POST',
    });
  }

  delete(gameId: string) {
    return httpServer(`${GAME_END_POINT}/${gameId}`, {
      fetch: this._fetch,
      schema: z.void(),
      method: 'DELETE',
    });
  }

  static create(_fetch: typeof fetch) {
    return new GameService(_fetch);
  }
}
