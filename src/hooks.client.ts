import { ACCESS_TOKEN_COOKIE_KEY } from '$lib/constants';
import { addRequest, removeRequest } from '$lib/stores/requesting';
import type { HandleFetch } from '@sveltejs/kit';
import './polyfills';
import { dev } from '$app/environment';

if (dev) {
  await fetch('http://127.0.0.1:5001/biomercs-bcf4c/us-central1/dev/setup/', {
    method: 'POST',
  });
}

export const handleFetch = (async ({ fetch, request, event }) => {
  addRequest();
  const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (accessToken) {
    request.headers.set('authorization', `Bearer ${accessToken}`);
  }
  const response = await fetch(request);
  removeRequest();
  return response;
}) satisfies HandleFetch;
