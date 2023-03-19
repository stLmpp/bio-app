import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_USER_END_POINT } from '$env/static/public';
import { prepareStylesSSR } from '@svelteuidev/core';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';

const authHandle = (async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/b')) {
    return resolve(event);
  }
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return resolve(event);
  }
  return Response.redirect(event.url.origin + '/b', 301);
}) satisfies Handle;

const bHandle = (async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/b')) {
    return resolve(event);
  }
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return Response.redirect(event.url.origin, 301);
  }
  const response = await event.fetch(`${PUBLIC_USER_END_POINT}/auto-login`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
  });
  if (!response.ok) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    return Response.redirect(event.url.origin, 301);
  }
  const { user, player } = await response.json();
  event.locals.user = user;
  event.locals.player = player;
  return resolve(event);
}) satisfies Handle;

export const handle = sequence(prepareStylesSSR, authHandle, bHandle);
