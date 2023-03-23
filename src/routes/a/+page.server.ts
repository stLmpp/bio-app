import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  if (!locals.user || !locals.player) {
    throw redirect(301, '/');
  }
  return {
    user: locals.user,
    player: locals.player,
  };
}) satisfies PageServerLoad;
