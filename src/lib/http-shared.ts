import { z, ZodSchema, ZodVoid } from 'zod';
import { addErrorNotification } from './stores/error-notification';

export const HttpErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.string(),
  correlationId: z.string().optional(),
  errorCode: z.string(),
});
export type HttpError = z.infer<typeof HttpErrorSchema>;
export type HttpResponseError = [HttpError, null];
export type HttpResponseSuccess<T extends ZodSchema> = [null, z.infer<T>];
export type HttpResponse<T extends ZodSchema> =
  | HttpResponseError
  | HttpResponseSuccess<T>;

export const INTERNAL_SERVER_ERROR: HttpError = {
  status: 500,
  message: 'Internal server error',
  error: 'Internal server error',
  errorCode: 'FRONT-9999',
};

export function _internalHttpFactory(browser: true): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<string, unknown>;
  }
) => Promise<HttpResponse<T>>;
export function _internalHttpFactory(browser: false): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    fetch: typeof fetch;
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<string, unknown>;
  }
) => Promise<HttpResponse<T>>;
export function _internalHttpFactory(browser: boolean): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    fetch?: typeof fetch;
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<string, unknown>;
  }
) => Promise<HttpResponse<T>> {
  return async function http<T extends ZodSchema>(
    url: string | URL,
    {
      fetch: _fetch,
      schema,
      body,
      query,
      ...options
    }: Omit<RequestInit, 'body'> & {
      fetch?: typeof fetch;
      schema: T;
      body?: unknown;
      method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
      query?: Record<string, unknown>;
    }
  ): Promise<HttpResponse<T>> {
    if (browser) {
      _fetch = fetch;
    } else if (!_fetch) {
      throw new Error('Required fetch parameter not provided in the server');
    }
    const requestOptions: RequestInit = { ...options };
    const headers = new Headers(requestOptions.headers);
    headers.append('Content-Type', 'application/json');
    if (typeof body !== 'undefined') {
      requestOptions.body = JSON.stringify(body);
    }
    const newUrl = new URL(url);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        newUrl.searchParams.set(key, String(value));
      }
    }
    const response = await _fetch(newUrl, { ...requestOptions, headers });
    const responseJson = await response
      .json()
      .catch(() => response.text())
      .catch(() => null);
    if (!response.ok) {
      const errorValidation = HttpErrorSchema.safeParse(responseJson);
      if (!errorValidation.success) {
        console.error(
          'HttpError validation error\nValidation error:',
          errorValidation.error,
          '\nError:',
          responseJson
        );
        addErrorNotification({
          error: 'Failed to validate an error coming from the server',
          errorCode: 'FRONT-9999',
          message: 'Failed to validate an error coming from the server',
          status: 500,
        });
        return [INTERNAL_SERVER_ERROR, null];
      }
      addErrorNotification(errorValidation.data);
      return [errorValidation.data, null];
    }
    if (schema instanceof ZodVoid) {
      return [null, undefined];
    }
    const validation = await schema.safeParseAsync(responseJson);
    if (!validation.success) {
      console.error(
        'Response validation error\nValidation error:',
        validation.error,
        '\nResponse:',
        responseJson
      );
      addErrorNotification({
        error: 'Failed to parse the response from the server',
        errorCode: 'FRONT-9999', // TODO need to use an enum here too
        message: 'Failed to parse the response from the server',
        status: 500, // TODO use enum
      });
      return [INTERNAL_SERVER_ERROR, null];
    }
    return [null, validation.data];
  };
}
