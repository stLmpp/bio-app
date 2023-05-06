import type { RequestEvent } from '@sveltejs/kit';

export function autoLoginLoad() {
  return async ({ locals }: RequestEvent) => ({
    user: locals.user!,
    player: locals.player!,
  });
}
