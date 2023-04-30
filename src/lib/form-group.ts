import { browser } from '$app/environment';
import { generateSchema } from '@anatine/zod-openapi';
import { onDestroy } from 'svelte';
import {
  writable,
  type Readable,
  type Unsubscriber,
  type Updater,
  type Writable,
  derived,
} from 'svelte/store';
import type { Simplify } from 'type-fest';
import type { z, ZodType } from 'zod';
import { formatZodErrorString } from './zod-error-formatter';

interface FormConstraints {
  // All
  required?: boolean;
  // String
  maxlength?: number;
  minlength?: number;
  pattern?: string;
  // Number/Date
  max?: number;
  min?: number;
  // Others
  name: string;
  id: string;
}

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
type FormGroupConstraints<T extends Record<string, unknown>> = {
  [K in keyof T]: FormConstraints;
};

type FormGroup<T extends Record<string, ZodType>> = Simplify<
  [
    FormGroupControls<T>,
    {
      group: Readable<FormGroupValue<T>>;
      valid: Readable<FormGroupValid<T>>;
      errors: Readable<FormGroupErrors<T>>;
      constraints: Readonly<FormGroupConstraints<T>>;
      groupDirty: Readable<Partial<FormGroupValue<T>>>;
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
  const constraints: FormGroupConstraints<T> = {} as any;
  for (const [key, value] of entries) {
    let index = 0;
    const jsonSchema = generateSchema(value);
    const controlContraints: FormConstraints = {
      name: key,
      id: key,
    };
    if (jsonSchema.type === 'string') {
      if (typeof jsonSchema.maxLength !== 'undefined') {
        controlContraints.maxlength = jsonSchema.maxLength;
      }
      if (typeof jsonSchema.minLength !== 'undefined') {
        controlContraints.minlength = jsonSchema.minLength;
      }
      if (typeof jsonSchema.pattern !== 'undefined') {
        controlContraints.pattern = jsonSchema.pattern;
      }
    }
    if (jsonSchema.type === 'number' || jsonSchema.type === 'integer') {
      if (typeof jsonSchema.maximum !== 'undefined') {
        controlContraints.max = jsonSchema.maximum;
      }
      if (typeof jsonSchema.minimum !== 'undefined') {
        controlContraints.min = jsonSchema.minimum;
      }
    }
    if (!value.isOptional()) {
      controlContraints.required = true;
    }
    (constraints as any)[key] = controlContraints;
    const valueWritable = writable((initial as any)[key]);
    if (browser) {
      subscriptions.push(
        valueWritable.subscribe(async (newValue) => {
          (values as any)[key] = newValue;
          const validation = value.safeParse(newValue);
          validWritable.update((validValue) => {
            const newObject = { ...validValue, [key]: validation.success };
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
      constraints,
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
      groupDirty: derived(groupWritable, (group) => {
        const partial: Partial<FormGroupValue<T>> = {};
        for (const [key, value] of Object.entries(group)) {
          if (value !== initial[key]) {
            (partial as any)[key] = value;
          }
        }
        return partial;
      }),
    },
  ];
}

// TODO enhance this piece of code
