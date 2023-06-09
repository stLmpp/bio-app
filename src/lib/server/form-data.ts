import type { HttpResponse } from '$lib/http-shared';
import type { ZodSchema } from 'zod';
import { Exceptions } from '../exceptions';
import { formatZodErrorString } from '../zod-error-formatter';

export async function parseFormData<T extends ZodSchema>(
  schema: T,
  formData: FormData
): Promise<HttpResponse<T>> {
  const validation = await schema.safeParseAsync(formData);
  if (!validation.success) {
    const message = formatZodErrorString(validation.error, {
      onlyFirstError: true,
      removeKeyFromMessage: true,
    });
    const error = Exceptions.InvalidFormData({
      error: message,
      message,
    });
    return [error, null];
  }
  return [null, validation.data];
}
