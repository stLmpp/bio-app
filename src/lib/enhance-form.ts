import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { noop } from 'svelte/internal';
import { addRequest, removeRequest } from './stores/requesting';

export function enhanceForm<
  Success extends Record<string, unknown> | undefined = Record<string, any>,
  Invalid extends Record<string, unknown> | undefined = Record<string, any>
>(
  form: HTMLFormElement,
  /**
   * Called upon submission with the given FormData and the `action` that should be triggered.
   * If `cancel` is called, the form will not be submitted.
   * You can use the abort `controller` to cancel the submission in case another one starts.
   * If a function is returned, that function is called with the response from the server.
   * If nothing is returned, the fallback will be used.
   *
   * If this function or its return value isn't set, it
   * - falls back to updating the `form` prop with the returned data if the action is one same page as the form
   * - updates `$page.status`
   * - resets the `<form>` element and invalidates all data in case of successful submission with no redirect response
   * - redirects in case of a redirect response
   * - redirects to the nearest error page in case of an unexpected error
   *
   * If you provide a custom function with a callback and want to use the default behavior, invoke `update` in your callback.
   */
  submit?: SubmitFunction<Success, Invalid>
): { destroy(): void } {
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
