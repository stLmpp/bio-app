import './polyfills';
import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch = (async ({ fetch, event, request }) => {
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (accessToken) {
    request.headers.set('authorization', `Bearer ${accessToken}`);
  }
  return fetch(request);
}) satisfies HandleFetch;
