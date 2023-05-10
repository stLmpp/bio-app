import { REGION_END_POINT } from '$env/static/private';
import { httpServer } from '../http-server';
import { RegionGetSchema } from '../schemas/region-get.schema';

export class RegionService {
  private constructor(private readonly _fetch: typeof fetch) {}

  get() {
    return httpServer(REGION_END_POINT, {
      fetch: this._fetch,
      schema: RegionGetSchema,
    });
  }

  static create(_fetch: typeof fetch) {
    return new RegionService(_fetch);
  }
}
