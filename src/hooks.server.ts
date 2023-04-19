import type { Handle } from '@sveltejs/kit';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const handle = (({ event, resolve }) => {
  return resolve(event);
}) satisfies Handle;
