import type { ZodSchema } from 'zod';
import type { HttpError, HttpResponse } from './http';
import { formatZodErrorString } from '../zod-error-formatter';

export async function parseFormData<T extends ZodSchema>(
  schema: T,
  formData: FormData
): Promise<HttpResponse<T>> {
  const validation = await schema.safeParseAsync(formData);
  if (!validation.success) {
    const error: HttpError = {
      error: formatZodErrorString(validation.error),
      message: 'Invalid input',
      status: 400,
    };
    return [null, error];
  }
  return [validation.data, null];
}
