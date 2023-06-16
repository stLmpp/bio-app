import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { noop } from 'svelte/internal';
import { addRequest, removeRequest } from './stores/requesting';
import { browser } from '$app/environment';

interface EnhanceFormOptions {
  useNativeValidation?: boolean;
}

export function enhanceForm<
  Success extends Record<string, unknown> | undefined = Record<string, any>,
  Invalid extends Record<string, unknown> | undefined = Record<string, any>
>(
  form: HTMLFormElement,
  submit?: SubmitFunction<Success, Invalid>,
  options?: EnhanceFormOptions
): { destroy(): void } {
  if (browser && !options?.useNativeValidation) {
    form.setAttribute('novalidate', '');
  }
  return enhance(form, async (input) => {
    submit ??= noop;
    const result = await submit(input);
    if (!result) {
      return;
    }
    addRequest();
    return async (args) => {
      // @ts-expect-error avoid generics errors
      await result(args);
      removeRequest();
    };
  });
}
