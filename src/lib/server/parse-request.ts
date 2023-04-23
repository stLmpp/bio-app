import type { ZodType } from 'zod';
import { formatZodErrorString } from '../zod-error-formatter';

import type { HttpError, HttpResponse } from '$lib/http-shared';
export async function parseBody<T extends ZodType>(
  schema: T,
  body: unknown
): Promise<HttpResponse<T>> {
  const jsonParsed = await schema.safeParseAsync(body);
  if (!jsonParsed.success) {
    const error: HttpError = {
      error: formatZodErrorString(jsonParsed.error),
      message: 'Invalid body',
      status: 400,
      errorCode: 'FRONT-END-0003',
    };
    return [error, null];
  }
  return [null, jsonParsed.data];
}
