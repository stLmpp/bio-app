import { z, type ZodSchema } from 'zod';

const HttpErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.string(),
});

export type HttpError = z.infer<typeof HttpErrorSchema>;

type HttpResponseError = [null, HttpError];
type HttpResponseSuccess<T extends ZodSchema> = [z.infer<T>, null];
export type HttpResponse<T extends ZodSchema> = HttpResponseError | HttpResponseSuccess<T>;

export async function http<T extends ZodSchema>(
  url: string,
  {
    fetch: _fetch,
    schema,
    body,
    ...options
  }: Omit<RequestInit, 'body'> & {
    fetch: typeof fetch;
    schema: T;
    body?: unknown;
  }
): Promise<HttpResponse<T>> {
  const requestOptions: RequestInit = { ...options };
  const headers = new Headers(requestOptions.headers);
  headers.append('Content-Type', 'application/json');
  if (typeof body !== 'undefined') {
    requestOptions.body = JSON.stringify(body);
  }
  const response = await _fetch(url, { ...requestOptions, headers });
  const responseJson = await response.json();
  if (!response.ok) {
    const errorValidation = HttpErrorSchema.safeParse(responseJson);
    if (!errorValidation.success) {
      console.error(
        'HttpError validation error\nValidation error:',
        errorValidation.error,
        '\nError:',
        responseJson
      );
      return [
        null,
        { status: 500, message: 'Internal server error', error: 'Internal server error' },
      ];
    }
    return [null, errorValidation.data];
  }
  const validation = await schema.safeParseAsync(responseJson);
  if (!validation.success) {
    console.error(
      'Response validation error\nValidation error:',
      validation.error,
      '\nResponse:',
      responseJson
    );
    return [
      null,
      { status: 500, message: 'Internal server error', error: 'Internal server error' },
    ];
  }
  return [validation.data, null];
}
