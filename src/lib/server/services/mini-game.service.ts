import { MINI_GAME_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import { MiniGameGetSchema } from '../schemas/mini-game-get.schema';

export class MiniGameService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(MINI_GAME_END_POINT, {
      fetch: this._fetch,
      schema: MiniGameGetSchema,
    });
  }

  static create(_fetch: typeof fetch) {
    return new MiniGameService(_fetch);
  }
}
