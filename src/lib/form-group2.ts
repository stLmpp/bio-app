import { get, writable, type Readable, type Writable } from 'svelte/store';
import type { ZodType, z } from 'zod';
import { formatZodErrorString } from './zod-error-formatter';

type RecordZod = Record<string, ZodType>;
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

export type FormGroupValue<T extends RecordZod> = {
  [K in keyof T]: z.infer<T[K]>;
};
export type FormGroupContraints<T extends RecordZod> = {
  [K in keyof T]: FormConstraints;
};
export type FormGroupErrors<T extends RecordZod> = {
  [K in keyof T]?: string;
};

export type FormGroup<T extends RecordZod> = {
  form: Writable<FormGroupValue<T>>;
  errors: Readable<FormGroupErrors<T>>;
};

export type FormGroupOptions<T extends RecordZod> = {
  schema: T;
  initial: FormGroupValue<T>;
};

type Entries<T, K extends keyof T = keyof T> = [K, T[K]][];

function entries<T extends Record<string, any>>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

export function formGroup2<T extends RecordZod>({
  schema,
  initial,
}: FormGroupOptions<T>): FormGroup<T> {
  const store = writable({ ...initial });
  const errors = writable<FormGroupErrors<T>>({});
  return {
    form: {
      subscribe: store.subscribe,
      set: (formValue) => {
        const oldValue = { ...get(store) };
        const newErrors: FormGroupErrors<T> = {};
        for (const [key, value] of entries(formValue)) {
          const validator = schema[key];
          if (oldValue[key] !== value) {
            const result = validator.safeParse(value);
            newErrors[key] = result.success
              ? undefined
              : formatZodErrorString(result.error, { onlyFirstError: true });
          }
        }
        console.log({ newErrors, oldValue, formValue });
        errors.set(newErrors);
        store.set(formValue);
      },
      update: (updater) => {
        console.log({ updater });
        store.update(updater);
      },
    },
    errors: {
      subscribe: errors.subscribe,
    },
  };
}
