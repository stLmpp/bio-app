import type { ZodType } from 'zod';
import { formatZodErrorString } from '../zod-error-formatter';

import type { HttpResponse } from '$lib/http-shared';
import { Exceptions } from '../exceptions';
export async function parseBody<T extends ZodType>(
  schema: T,
  body: unknown
): Promise<HttpResponse<T>> {
  const jsonParsed = await schema.safeParseAsync(body);
  if (!jsonParsed.success) {
    const error = Exceptions.InvalidBody({
      error: formatZodErrorString(jsonParsed.error),
    });
    return [error, null];
  }
  return [null, jsonParsed.data];
}
