import type { HandleFetch } from '@sveltejs/kit';
import { addRequest, removeRequest } from '$lib/stores/requesting';

export const handleFetch = (async ({ fetch, request }) => {
  addRequest();
  const response = await fetch(request);
  removeRequest();
  return response;
}) satisfies HandleFetch;
