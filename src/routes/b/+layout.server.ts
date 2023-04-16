import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (!locals.user || !locals.player) {
    throw redirect(301, '/');
  }
  return {
    user: locals.user,
    player: locals.player,
  };
}) satisfies LayoutServerLoad;
