import { ModeService } from '$lib/server/services/mode.service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
  const modeService = ModeService.create(fetch);
  const [modesError, modes] = await modeService.get();
  if (modesError) {
    throw error(modesError.status, modesError);
  }
  return {
    modes,
  };
}) satisfies PageServerLoad;
