import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { safeDecode } from '$lib/server/safe-decode-jwt';
import { AuthService } from '$lib/server/services/auth.service';
import type { HandleFetch } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import './polyfills';

export const handleFetch = (async ({ fetch, event, request }) => {
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (accessToken) {
    request.headers.set('authorization', `Bearer ${accessToken}`);
  }
  return fetch(request);
}) satisfies HandleFetch;

export async function handle({ event, resolve }) {
  const admin = event.url.pathname.startsWith('/a');
  if (!event.url.pathname.startsWith('/b') && !admin) {
    return resolve(event);
  }
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  const originalPath = event.url.pathname + event.url.search;
  const loginUrl = new URL('/login', event.url.origin);
  loginUrl.searchParams.set('redirectTo', originalPath);
  const loginResponse = new Response(null, {
    headers: {
      location: loginUrl.toString(),
      'Set-Cookie': `${ACCESS_TOKEN_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
    status: StatusCodes.MOVED_PERMANENTLY,
  });
  if (!accessToken) {
    event.locals.user = null;
    event.locals.player = null;
    return loginResponse;
  }
  const decoded = safeDecode(accessToken);
  if (!decoded?.exp || Date.now() >= decoded.exp * 1000) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    event.locals.player = null;
    event.locals.user = null;
    return loginResponse;
  }
  const authService = AuthService.create(fetch);
  const [responseError, response] = await authService.autoLogin(accessToken);
  if (responseError) {
    event.cookies.delete(ACCESS_TOKEN_COOKIE_KEY);
    event.locals.player = null;
    event.locals.user = null;
    return loginResponse;
  }
  event.locals.user = response.user;
  event.locals.player = response.player;
  if (admin && !response.user.admin) {
    return Response.redirect('/b', 300);
  }
  return resolve(event);
}
