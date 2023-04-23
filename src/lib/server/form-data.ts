import type { ZodSchema } from 'zod';
import { formatZodErrorString } from '../zod-error-formatter';
import type { HttpError, HttpResponse } from '$lib/http-shared';

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
      errorCode: 'FRONT-END-0002',
    };
    return [error, null];
  }
  return [null, validation.data];
}
