import { get, writable, type Readable, type Writable } from 'svelte/store';
import {
  ZodDefault,
  ZodEffects,
  ZodNumber,
  ZodOptional,
  ZodString,
  z,
  type ZodType,
} from 'zod';
import { formatZodErrorString } from './zod-error-formatter';
import { browser } from '$app/environment';

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

export type FormGroupInitialValue<T extends RecordZod> = {
  [K in keyof T]: z.input<T[K]>;
};
export type FormGroupValue<T extends RecordZod> = {
  [K in keyof T]: z.infer<T[K]>;
};
export type FormGroupContraints<T extends RecordZod> = {
  [K in keyof T]: FormConstraints;
};
export type FormGroupErrors<T extends RecordZod> = {
  [K in keyof T]?: string;
};
export type FormGroupValid<T extends RecordZod> = {
  [K in keyof T]: boolean;
};

export type FormGroup<T extends RecordZod> = {
  form: Writable<FormGroupValue<T>>;
  errors: Readable<FormGroupErrors<T>>;
  valid: Readable<FormGroupValid<T>>;
  formValid: Readable<boolean>;
  constraints: FormGroupContraints<T>;
};

export type FormGroupOptions<T extends RecordZod> = {
  schema: T;
  initial: FormGroupInitialValue<T>;
  initialValidation?: boolean;
};

type Entries<T, K extends keyof T = keyof T> = [K, T[K]][];
type Keys<T, K extends keyof T = keyof T> = K[];

function objectEntries<T extends Record<string, any>>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

function objectKeys<T extends Record<string, any>>(object: T): Keys<T> {
  return Object.keys(object);
}

function getKeys(key: keyof any) {
  const value = `__${String(key)}__value`;
  const newValue = `__${String(key)}__newValue`;
  const setValue = `__${String(key)}__setValue`;
  return {
    value,
    newValue,
    setValue,
  };
}

function makeImmutable<T extends Record<any, any>>(object: T): T {
  const newObject: Record<any, any> = {};
  for (const [key, value] of objectEntries(object)) {
    const keys = getKeys(key);
    Object.defineProperties(newObject, {
      [keys.value]: {
        value,
        writable: true,
      },
      [keys.newValue]: {
        value,
        writable: true,
      },
      [keys.setValue]: {
        value: (newValue: any) => {
          newObject[keys.value] = newValue;
        },
        enumerable: false,
        writable: false,
      },
      [key]: {
        set: (newValue: any) => {
          newObject[keys.newValue] = newValue;
        },
        get: () => newObject[keys.value],
        enumerable: true,
      },
    });
  }
  return newObject as T;
}

function getInitial<T extends RecordZod>(schema: T, initial: FormGroupInitialValue<T>) {
  for (const key of objectKeys(schema)) {
    if (typeof initial[key] === 'undefined') {
      initial[key] = undefined;
    }
  }
  return initial;
}

function getInitialValid<T extends RecordZod>(
  schema: T,
  initial: FormGroupValue<T>,
  initialValidation?: boolean
) {
  const valid = {} as FormGroupValid<T>;
  for (const key of objectKeys(schema)) {
    valid[key] =
      !browser || !initialValidation || schema[key].safeParse(initial[key]).success;
  }
  return valid;
}

function isFormValid<T extends RecordZod>(valid: FormGroupValid<T>) {
  return Object.values(valid).every(Boolean);
}

function getInner(schema: ZodType): ZodType {
  if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
    return getInner(schema._def.innerType);
  }
  if (schema instanceof ZodEffects) {
    return getInner(schema._def.schema);
  }
  return schema;
}

function getRequired(schema: ZodType): boolean {
  if (schema instanceof ZodDefault) {
    return true;
  }
  if (schema instanceof ZodOptional) {
    return false;
  }
  if (schema instanceof ZodEffects) {
    return getRequired(schema._def.schema);
  }
  return true;
}

function getContraint(key: keyof any, schema: ZodType): FormConstraints {
  const inner = getInner(schema);
  const keyString = String(key);
  const object: FormConstraints = {
    name: keyString,
    id: keyString,
    required: !schema.isOptional() || getRequired(schema),
  };
  if (inner instanceof ZodString) {
    object.maxlength = inner.maxLength ?? undefined;
    object.minlength = inner.minLength ?? undefined;
    for (const check of inner._def.checks) {
      if (check.kind === 'regex') {
        object.pattern = check.regex.source;
      }
    }
  }
  if (inner instanceof ZodNumber) {
    object.max = inner.maxValue ?? undefined;
    object.min = inner.minValue ?? undefined;
  }
  return object;
}

function getContraints<T extends RecordZod>(schema: T): FormGroupContraints<T> {
  const contraints = {} as FormGroupContraints<T>;
  for (const [key, value] of objectEntries(schema)) {
    contraints[key] = getContraint(key, value);
  }
  return contraints;
}

function getInitialErrors<T extends RecordZod>(
  schema: T,
  initial: FormGroupInitialValue<T>
): FormGroupErrors<T> {
  const errors: FormGroupErrors<T> = {};
  for (const [key, value] of objectEntries(schema)) {
    const result = value.safeParse(initial[key]);
    errors[key] = result.success
      ? undefined
      : formatZodErrorString(result.error, { onlyFirstError: true });
  }
  return errors;
}

export function formGroup2<T extends RecordZod>({
  schema,
  initial,
  initialValidation,
}: FormGroupOptions<T>): FormGroup<T> {
  const store = writable(makeImmutable(getInitial(schema, initial)));
  const errors = writable<FormGroupErrors<T>>(
    initialValidation ? getInitialErrors(schema, initial) : {}
  );
  const initialValid = getInitialValid(schema, initial, initialValidation);
  const valid = writable<FormGroupValid<T>>(initialValid);
  const formValid = writable<boolean>(isFormValid(initialValid));
  return {
    form: {
      subscribe: store.subscribe,
      set: (formValue) => {
        const newErrors: FormGroupErrors<T> = { ...get(errors) };
        const newValid = { ...get(valid) };
        for (const key of objectKeys(formValue)) {
          const keys = getKeys(key);
          const validator = schema[key];
          const oldValue = formValue[keys.value];
          const newValue = formValue[keys.newValue];
          if (oldValue !== newValue) {
            const result = validator.safeParse(newValue);
            newErrors[key] = result.success
              ? undefined
              : formatZodErrorString(result.error, { onlyFirstError: true });
            formValue[keys.setValue](newValue);
            newValid[key] = result.success;
          }
        }
        valid.set(newValid);
        formValid.set(isFormValid(newValid));
        errors.set(newErrors);
        store.set(formValue);
      },
      update: () => {
        throw new Error('Update is not allowed');
      },
    },
    errors: {
      subscribe: errors.subscribe,
    },
    valid: {
      subscribe: valid.subscribe,
    },
    formValid: {
      subscribe: formValid.subscribe,
    },
    constraints: getContraints(schema),
  };
}
