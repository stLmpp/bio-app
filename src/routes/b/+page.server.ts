import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  logout: (event) => {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    throw redirect(301, '/');
  },
} satisfies Actions;
