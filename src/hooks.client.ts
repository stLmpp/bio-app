import type { HandleFetch } from '@sveltejs/kit';
import { addRequest, removeRequest } from '$lib/stores/requesting';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const handleFetch = (async ({ fetch, request }) => {
  addRequest();
  const response = await fetch(request);
  removeRequest();
  return response;
}) satisfies HandleFetch;
