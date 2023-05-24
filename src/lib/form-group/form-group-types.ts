import type { z, ZodType } from 'zod';
import type { Readable, Updater, Writable } from 'svelte/store';

export interface FormConstraints {
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

export type RecordZod = Record<string, ZodType>;
export type FormGroupInitialValue<T extends RecordZod> = {
  [K in keyof T]: z.input<T[K]>;
};
export type FormGroupValue<T extends RecordZod> = {
  [K in keyof T]: z.infer<T[K]>;
};
export type FormGroupConstraints<T extends RecordZod> = {
  [K in keyof T]: FormConstraints;
};
export type FormGroupErrors<T extends RecordZod> = {
  [K in keyof T]?: string;
};
export type FormGroupValid<T extends RecordZod> = {
  [K in keyof T]: boolean;
};

export type FormGroupOptions<T extends RecordZod> = {
  schema: T;
  initial: FormGroupInitialValue<T>;
  initialValidation?: boolean;
};

export type FormGroup<T extends RecordZod> = {
  form: Writable<FormGroupValue<T>>;
  errors: Readable<FormGroupErrors<T>>;
  valid: Readable<FormGroupValid<T>>;
  formValid: Readable<boolean>;
  constraints: FormGroupConstraints<T>;
  update: (updater: Updater<FormGroupValue<T>>) => void;
};
