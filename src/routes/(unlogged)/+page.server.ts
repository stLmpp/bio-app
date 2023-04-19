import type { PageServerLoad } from './$types';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { redirect } from '@sveltejs/kit';

export const load = (({ cookies }) => {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return;
  }
  throw redirect(301, '/b');
}) satisfies PageServerLoad;
