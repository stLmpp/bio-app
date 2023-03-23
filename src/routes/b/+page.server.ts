import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (!locals.user || !locals.player) {
    throw redirect(301, '/');
  }
  return {
    user: locals.user,
    player: locals.player,
  };
}) satisfies PageServerLoad;

export const actions = {
  logout: (event) => {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    throw redirect(301, '/');
  },
} satisfies Actions;
