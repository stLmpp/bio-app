import { REGION_END_POINT } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { httpServer } from '../http-server';
import { RegionGetSchema } from '../schemas/region-get.schema';

export class RegionService {
  private constructor(private readonly event: RequestEvent) {}

  get() {
    this.event.setHeaders({
      'cache-control': 'public, max-age=3600',
    });
    return httpServer(REGION_END_POINT, {
      fetch: this.event.fetch,
      schema: RegionGetSchema,
    });
  }

  static create(event: RequestEvent) {
    return new RegionService(event);
  }
}
