import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { noop } from 'svelte/internal';
import { addRequest, removeRequest } from './stores/requesting';

export function enhanceForm<
  Success extends Record<string, unknown> | undefined = Record<string, any>,
  Invalid extends Record<string, unknown> | undefined = Record<string, any>
>(form: HTMLFormElement, submit?: SubmitFunction<Success, Invalid>): { destroy(): void } {
  return enhance(form, async (input) => {
    addRequest();
    submit ??= noop;
    const result = await submit(input);
    return async (opts) => {
      if (result) {
        await result(opts as any);
      }
      removeRequest();
    };
  });
}
