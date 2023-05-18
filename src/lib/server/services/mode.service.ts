import { MODE_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { ModeGetSchema } from '../schemas/mode-get.schema';
import { ModePostSchema, type ModePostBody } from '../schemas/mode-post.schema';

export class ModeService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(MODE_END_POINT, {
      fetch: this._fetch,
      schema: ModeGetSchema,
    });
  }

  post(body: ModePostBody) {
    return httpServer(MODE_END_POINT, {
      fetch: this._fetch,
      schema: ModePostSchema,
      method: 'POST',
      body,
    });
  }

  delete(modeId: string) {
    return httpServer(`${MODE_END_POINT}/${modeId}`, {
      fetch: this._fetch,
      schema: z.void(),
      method: 'DELETE',
    });
  }

  static create(_fetch: typeof fetch) {
    return new ModeService(_fetch);
  }
}
