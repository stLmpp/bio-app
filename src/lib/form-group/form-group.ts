import { readable, type Readable, type Updater } from 'svelte/store';
import { derived, get, writable, type Writable } from 'svelte/store';
import {
  ZodDefault,
  ZodEffects,
  ZodNumber,
  ZodOptional,
  ZodString,
  type ZodType,
} from 'zod';
import { formatZodErrorString } from '../zod-error-formatter';
import type {
  FormConstraints,
  FormGroupConstraints,
  FormGroupErrors,
  FormGroupInitialValue,
  FormGroupOptions,
  FormGroupValid,
  FormGroupValue,
  RecordZod,
} from '$lib/form-group/form-group-types';
import { type Entries, objectEntries } from '$lib/object-entries';
import { objectKeys } from '$lib/object-keys';
import { toReadable } from '$lib/to-readable';
import { browser } from '$app/environment';

export function formGroup<T extends RecordZod>(
  options: FormGroupOptions<T>
): FormGroup<T> {
  return new FormGroup(options);
}

class FormGroup<T extends RecordZod> {
  constructor({ schema, initial, initialValidation }: FormGroupOptions<T>) {
    this.#schema = schema;
    this.#initial = initial;
    this.#initialValidation = !!initialValidation;
    this.#entries = objectEntries(this.#schema);
    this.#form = writable({ ...initial });
    this.#errors = writable(this.#getInitialErrors());
    this.f = this.#getForm();
    this.errors = toReadable(this.#errors);
    this.valid = this.#getValid();
    this.allValid = this.#getFormValid();
    this.constraints = this.#getConstraints();
    this.#isDirty = this.#getIsDirty();
  }
  readonly #initialValidation: boolean;
  readonly #initial: FormGroupInitialValue<T>;
  readonly #schema: T;
  readonly #entries: Entries<T>;
  readonly #form: Writable<FormGroupValue<T>>;
  readonly #errors: Writable<FormGroupErrors<T>>;

  readonly f: Writable<FormGroupValue<T>>;
  readonly errors: Readable<FormGroupErrors<T>>;
  readonly valid: Readable<FormGroupValid<T>>;
  readonly allValid: Readable<boolean>;
  readonly constraints: FormGroupConstraints<T>;

  readonly #isDirty: Record<keyof T, boolean>;

  #getIsDirty() {
    const dirty = {} as Record<keyof T, boolean>;
    for (const [key] of this.#entries) {
      dirty[key] = false;
    }
    return dirty;
  }

  #getValid(): Readable<FormGroupValid<T>> {
    if (!browser) {
      const object = {} as FormGroupValid<T>;
      for (const [key] of this.#entries) {
        object[key] = true;
      }
      return readable(object);
    }
    return derived(this.errors, (errors) => {
      const valid = {} as FormGroupValid<T>;
      for (const [key] of this.#entries) {
        const hasError = typeof errors[key] !== 'undefined';
        valid[key] = this.#initialValidation
          ? !hasError
          : !this.#isDirty[key] || !hasError;
      }
      return valid;
    });
  }

  #getFormValid(): Readable<boolean> {
    if (!browser) {
      return readable(true);
    }
    return derived(this.valid, (valid) => Object.values(valid).every(Boolean));
  }

  #getRealSchema(schema: ZodType): ZodType {
    if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
      return this.#getRealSchema(schema._def.innerType);
    }
    if (schema instanceof ZodEffects) {
      return this.#getRealSchema(schema._def.schema);
    }
    return schema;
  }

  #getRequiredFromSchema(schema: ZodType): boolean {
    if (schema instanceof ZodDefault) {
      return true;
    }
    if (schema instanceof ZodOptional) {
      return false;
    }
    if (schema instanceof ZodEffects) {
      return this.#getRequiredFromSchema(schema._def.schema);
    }
    return true;
  }

  #getConstraint(key: keyof T, schema: ZodType) {
    const realSchema = this.#getRealSchema(schema);
    const keyString = String(key);
    const object: FormConstraints = {
      name: keyString,
      id: keyString,
      required: !schema.isOptional() || this.#getRequiredFromSchema(schema),
    };
    if (realSchema instanceof ZodString) {
      object.maxlength = realSchema.maxLength ?? undefined;
      object.minlength = realSchema.minLength ?? undefined;
      for (const check of realSchema._def.checks) {
        if (check.kind === 'regex') {
          object.pattern = check.regex.source;
          break;
        }
      }
    }
    if (realSchema instanceof ZodNumber) {
      object.max = realSchema.maxValue ?? undefined;
      object.min = realSchema.minValue ?? undefined;
    }
    return object;
  }

  #getConstraints(): FormGroupConstraints<T> {
    const constraints = {} as FormGroupConstraints<T>;
    for (const [key, value] of this.#entries) {
      constraints[key] = this.#getConstraint(key, value);
    }
    return constraints;
  }

  #getInitialErrors(): FormGroupErrors<T> {
    if (!this.#initialValidation) {
      return {};
    }
    const errors: FormGroupErrors<T> = {};
    for (const [key, value] of this.#entries) {
      const result = value.safeParse(this.#initial[key]);
      errors[key] = result.success
        ? undefined
        : formatZodErrorString(result.error, { onlyFirstError: true });
    }
    return errors;
  }

  #getForm(): Writable<FormGroupValue<T>> {
    return {
      subscribe: (callback) => this.#form.subscribe((value) => callback({ ...value })),
      set: (value) => this.set(value),
      update: () => {
        throw new Error('Update is not allowed');
      },
    };
  }

  update = (updater: Updater<FormGroupValid<T>>): void => {
    this.#form.set(updater(get(this.#form)));
  };

  set = (newForm: FormGroupValue<T>): void => {
    const oldForm = get(this.#form);
    const newErrors = { ...get(this.#errors) };
    for (const key of objectKeys(newForm)) {
      const validator = this.#schema[key];
      if (oldForm[key] !== newForm[key]) {
        this.#isDirty[key] = true;
        const result = validator.safeParse(newForm[key]);
        newErrors[key] = result.success
          ? undefined
          : formatZodErrorString(result.error, { onlyFirstError: true });
      }
    }
    this.#errors.set(newErrors);
    this.#form.set({ ...newForm });
  };

  showAllErrors = (): void => {
    const form = get(this.#form);
    const newErrors = { ...get(this.#errors) };
    for (const [key, schema] of this.#entries) {
      const value = form[key];
      const result = schema.safeParse(value);
      newErrors[key] = result.success
        ? undefined
        : formatZodErrorString(result.error, { onlyFirstError: true });
    }
    this.#errors.set(newErrors);
  };
}
