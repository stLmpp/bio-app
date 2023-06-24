import { PLAYER_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import {
  PlayerCreateSchema,
  type PlayerCreateBody,
} from '../schemas/player-create-steam.schema';

export class PlayerService {
  private constructor(private readonly _fetch: typeof fetch) {}

  createSteam(steamid: string, body: PlayerCreateBody) {
    return httpServer([PLAYER_END_POINT, 'steam', steamid], {
      fetch: this._fetch,
      body,
      schema: PlayerCreateSchema,
      method: 'POST',
    });
  }

  static create(_fetch: typeof fetch) {
    return new PlayerService(_fetch);
  }
}
