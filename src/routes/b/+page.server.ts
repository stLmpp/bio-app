import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  return {
    user: locals.user,
    player: locals.player,
  };
}) satisfies PageServerLoad;

export const actions = {
  logout: (event) => {
    event.cookies.delete('ACCESS_TOKEN');
    throw redirect(301, '/');
  },
} satisfies Actions;
