import { StatusCodes } from 'http-status-codes';
import type { HttpError } from './http-shared';

type Exception =
  | (() => HttpError)
  | ((args?: { error?: string; message?: string }) => HttpError);

export const Exceptions = {
  InvalidFormData: (args) => ({
    errorCode: 'FRONT-0001',
    error: args?.error ?? 'Invalid form data input',
    message: 'Invalid form data input',
    status: StatusCodes.BAD_REQUEST,
  }),
  InvalidBody: (args) => ({
    errorCode: 'FRONT-0002',
    error: args?.error ?? 'Invalid body input',
    message: 'Invalid body input',
    status: StatusCodes.BAD_REQUEST,
  }),
  FailedToValidateErrorResponseFromServer: () => ({
    errorCode: 'FRONT-0003',
    error: 'Failed to validate an error from the server',
    message: 'Failed to validate an error from the server',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  }),
  FailedToValidateResponseFromServer: () => ({
    errorCode: 'FRONT-0004',
    error: 'Failed to validate the response from the server',
    message: 'Failed to validate the response from the server',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  }),
  FormActionCustomBadRequest: (args) => ({
    errorCode: 'FRONT-0005',
    error: args?.error ?? 'Form action custom bad request error',
    message: args?.message ?? 'Form action custom bad request error',
    status: StatusCodes.BAD_REQUEST,
  }),
} satisfies Record<string, Exception>;
