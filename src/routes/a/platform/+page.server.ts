import { PlatformService } from '$lib/server/services/platform.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const platformService = PlatformService.create(fetch);
  const [platformsError, platforms] = await platformService.get();
  if (platformsError) {
    throw error(platformsError.status, platformsError);
  }
  return {
    platforms,
  };
}) satisfies PageServerLoad;
