import { z, ZodSchema, ZodVoid } from 'zod';
import { addErrorNotification } from './stores/error-notification';
import { Exceptions } from './exceptions';

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

function getNewUrl(url: string | URL, browser: boolean): URL {
  if (typeof url !== 'string') {
    return url;
  }
  if (/^https?/.test(url)) {
    return new URL(url);
  }
  if (!browser) {
    throw new Error(`Could not generate URL for ${url}`);
  }
  return new URL(url, window.location.origin);
}

export function _internalHttpFactory(browser: true): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<any, any>;
  }
) => Promise<HttpResponse<T>>;
export function _internalHttpFactory(browser: false): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    fetch: typeof fetch;
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<any, any>;
  }
) => Promise<HttpResponse<T>>;
export function _internalHttpFactory(browser: boolean): <T extends ZodSchema>(
  url: string | URL,
  options: Omit<RequestInit, 'body'> & {
    fetch?: typeof fetch;
    schema: T;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<any, any>;
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
      query?: Record<any, any>;
    }
  ): Promise<HttpResponse<T>> {
    if (browser) {
      _fetch = window.fetch;
    } else if (!_fetch) {
      return [Exceptions.MissingFetchParameterServer(), null];
    } else if (_fetch === globalThis.fetch) {
      return [Exceptions.InvalidFetchParameterServer(), null];
    }
    const requestOptions: RequestInit = { ...options };
    const headers = new Headers(requestOptions.headers);
    headers.append('Content-Type', 'application/json');
    if (typeof body !== 'undefined') {
      requestOptions.body = JSON.stringify(body);
    }
    const newUrl = getNewUrl(url, browser);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'undefined' || value === null) {
          continue;
        }
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
        const error = Exceptions.FailedToValidateErrorResponseFromServer();
        addErrorNotification(error);
        return [error, null];
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
      const error = Exceptions.FailedToValidateResponseFromServer();
      addErrorNotification(error);
      return [error, null];
    }
    return [null, validation.data];
  };
}
