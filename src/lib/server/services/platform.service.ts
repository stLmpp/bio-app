import { PLATFORM_END_POINT } from '$env/static/private';
import { z } from 'zod';
import { httpServer } from '../http-server';
import { PlatformGetSchema } from '../schemas/platform-get.schema';
import {
  PlatformPostSchema,
  type PlatformPostBody,
} from '../schemas/platform-post.schema';
import { PlatformGetOneSchema } from '../schemas/platform-get-one.schema';

export class PlatformService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(PLATFORM_END_POINT, {
      fetch: this._fetch,
      schema: PlatformGetSchema,
    });
  }

  getOne(platformId: string) {
    return httpServer(`${PLATFORM_END_POINT}/${platformId}`, {
      fetch: this._fetch,
      schema: PlatformGetOneSchema,
    });
  }

  post(body: PlatformPostBody) {
    return httpServer(PLATFORM_END_POINT, {
      fetch: this._fetch,
      schema: PlatformPostSchema,
      body,
      method: 'POST',
    });
  }

  delete(platformId: string) {
    return httpServer(`${PLATFORM_END_POINT}/${platformId}`, {
      fetch: this._fetch,
      schema: z.void(),
      method: 'DELETE',
    });
  }

  static create(_fetch: typeof fetch) {
    return new PlatformService(_fetch);
  }
}
