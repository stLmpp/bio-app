import type { Handle, RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AUTH_END_POINT } from '$env/static/private';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { http } from '$lib/server/http';
import { z } from 'zod';

const authHandle = (async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/b') || event.url.pathname.startsWith('/a')) {
    return resolve(event);
  }
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return resolve(event);
  }
  return Response.redirect(event.url.origin + '/b', 301);
}) satisfies Handle;

async function getAuthUser(event: RequestEvent) {
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return Response.redirect(event.url.origin, 301);
  }
  const [response, responseError] = await http(`${AUTH_END_POINT}/auto-login`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    fetch: event.fetch,
    schema: z.object({
      user: z.object({
        id: z.string(),
        username: z.string(),
        admin: z.boolean(),
      }),
      player: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }),
  });
  if (responseError) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    return Response.redirect(event.url.origin, 301);
  }
  return response;
}

const aHandle = (async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/a')) {
    return resolve(event);
  }
  const responseOrRedirect = await getAuthUser(event);
  if (responseOrRedirect instanceof Response) {
    return responseOrRedirect;
  }
  const { user, player } = responseOrRedirect;
  if (!user.admin) {
    return Response.redirect(event.url.origin + '/b', 301);
  }
  event.locals.user = user;
  event.locals.player = player;
  return resolve(event);
}) satisfies Handle;

const bHandle = (async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/b')) {
    return resolve(event);
  }
  const responseOrRedirect = await getAuthUser(event);
  if (responseOrRedirect instanceof Response) {
    return responseOrRedirect;
  }
  const { user, player } = responseOrRedirect;
  event.locals.user = user;
  event.locals.player = player;
  return resolve(event);
}) satisfies Handle;

export const handle = sequence(authHandle, aHandle, bHandle);
