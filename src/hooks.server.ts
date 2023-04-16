import type { Handle, RequestEvent } from '@sveltejs/kit';
import { AUTH_AUTO_LOGIN_END_POINT } from '$env/static/private';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/server/constants';
import { http } from '$lib/server/http';
import { z } from 'zod';
import jwtDecode, { type JwtPayload } from 'jwt-decode';

export const handle = (async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/a')) {
    const responseOrRedirect = await getAuthUser(event);
    if (responseOrRedirect instanceof Response) {
      return responseOrRedirect;
    }
    const { user } = responseOrRedirect;
    if (!user.admin) {
      return Response.redirect(event.url.origin + '/b', 301);
    }
    return resolve(event);
  } else if (event.url.pathname.startsWith('/b')) {
    const responseOrRedirect = await getAuthUser(event);
    if (responseOrRedirect instanceof Response) {
      return responseOrRedirect;
    }
    return resolve(event);
  }
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    return resolve(event);
  }
  return Response.redirect(event.url.origin + '/b', 301);
}) satisfies Handle;

function safeDecode(jwt: string): JwtPayload | null {
  try {
    return jwtDecode(jwt);
  } catch {
    return null;
  }
}

const AutoLoginSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    admin: z.boolean(),
  }),
  player: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

async function getAuthUser(event: RequestEvent) {
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!accessToken) {
    event.locals.player = null;
    event.locals.user = null;
    return Response.redirect(event.url.origin, 301);
  }
  const decoded = safeDecode(accessToken);
  if (!decoded?.exp || Date.now() >= decoded.exp * 1000) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    event.locals.player = null;
    event.locals.user = null;
    return Response.redirect(event.url.origin, 301);
  }
  const [response, responseError] = await http(AUTH_AUTO_LOGIN_END_POINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    fetch: event.fetch,
    schema: AutoLoginSchema,
  });
  if (responseError) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    event.locals.player = null;
    event.locals.user = null;
    return Response.redirect(event.url.origin, 301);
  }
  event.locals.user = response.user;
  event.locals.player = response.player;
  return response;
}
