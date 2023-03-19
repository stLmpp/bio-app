import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';

export const load = (async ({ locals }) => {
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
