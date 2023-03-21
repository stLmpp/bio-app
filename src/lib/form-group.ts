import { browser } from '$app/environment';
import { onDestroy } from 'svelte';
import {
  writable,
  type Unsubscriber,
  type Writable,
  type Readable,
  type Updater,
} from 'svelte/store';
import type { Simplify } from 'type-fest';
import type { z, ZodType } from 'zod';
import { formatZodErrorString } from './zod-error-formatter';

type FormGroupValid<T extends Record<string, ZodType>> = { [K in keyof T]: boolean } & {
  group: boolean;
};
type FormGroupErrors<T extends Record<string, ZodType>> = {
  [K in keyof T]: string | undefined;
};
type FormGroupValue<T extends Record<string, ZodType>> = {
  [K in keyof T]: z.infer<T[K]>;
};
type FormGroupControls<T extends Record<string, ZodType>> = {
  [K in keyof T]: Writable<z.input<T[K]>>;
};

type FormGroup<T extends Record<string, ZodType>> = Simplify<
  [
    FormGroupControls<T>,
    {
      group: Readable<FormGroupValue<T>>;
      valid: Readable<FormGroupValid<T>>;
      errors: Readable<FormGroupErrors<T>>;
      showAllErrors: () => void;
      set: (value: FormGroupValue<T>) => void;
      update: (updater: Updater<FormGroupValue<T>>) => void;
    }
  ]
>;

function getValidGroup(group: FormGroupValid<any>) {
  for (const [key, value] of Object.entries(group)) {
    if (key === 'group') {
      continue;
    }
    if (!value) {
      return false;
    }
  }
  return true;
}

export function formGroup<T extends Record<string, ZodType>>(
  schema: T,
  initial: FormGroupValue<T>
): FormGroup<T> {
  const entries = Object.entries(schema);
  const valid = entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: !browser || value.safeParse(initial[key]).success,
    }),
    {
      group: true,
    } as FormGroupValid<T>
  );
  if (browser) {
    valid.group = getValidGroup(valid);
  }

  const validWritable = writable(valid);

  const groupWritable = writable<FormGroupValue<T>>(initial);
  const errorsWritable = writable<FormGroupErrors<T>>(
    entries.reduce(
      (acc, [key]) => ({ ...acc, [key]: undefined }),
      {} as FormGroupErrors<T>
    )
  );
  const controls: FormGroupControls<T> = {} as any;
  const subscriptions: Unsubscriber[] = [];
  const values: FormGroupValue<T> = {} as any;
  for (const [key, value] of entries) {
    let index = 0;
    const valueWritable = writable((initial as any)[key]);
    if (browser) {
      subscriptions.push(
        valueWritable.subscribe(async (newValue) => {
          (values as any)[key] = newValue;
          const validation = value.safeParse(newValue);
          validWritable.update((valid) => {
            const newObject = { ...valid, [key]: validation.success };
            return { ...newObject, group: getValidGroup(newObject) };
          });
          groupWritable.update((group) => ({ ...group, [key]: newValue }));
          if (index) {
            errorsWritable.update((errors) => ({
              ...errors,
              [key]: validation.success
                ? undefined
                : formatZodErrorString(validation.error, { onlyFirstError: true }),
            }));
          }
          index++;
        })
      );
    }
    (controls as any)[key] = valueWritable;
  }
  onDestroy(() => {
    for (const subscription of subscriptions) {
      subscription();
    }
  });
  return [
    controls,
    {
      group: groupWritable,
      valid: validWritable,
      errors: errorsWritable,
      showAllErrors: () => {
        errorsWritable.set(
          entries.reduce((acc, [key, value]) => {
            const validation = value.safeParse(values[key]);
            if (validation.success) {
              (acc as any)[key] = undefined;
            } else {
              (acc as any)[key] = formatZodErrorString(validation.error, {
                onlyFirstError: true,
              });
            }
            return acc;
          }, {} as FormGroupErrors<T>)
        );
      },
      set: (value) => {
        for (const [key] of entries) {
          controls[key].set(value[key]);
        }
      },
      update: (updater) => {
        const newValue = updater(values);
        for (const [key] of entries) {
          controls[key].set(newValue[key]);
        }
      },
    },
  ];
}

// TODO enhance this piece of code
