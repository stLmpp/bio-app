import { StatusCodes } from 'http-status-codes';
import type { HttpError } from './http-shared';

export const Exceptions = {
  InvalidFormData: (error) => ({
    errorCode: 'FRONT-0001',
    error,
    message: 'Invalid form data input',
    status: StatusCodes.BAD_REQUEST,
  }),
  InvalidBody: (error) => ({
    errorCode: 'FRONT-0002',
    error,
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
} satisfies Record<string, (() => HttpError) | ((error: string) => HttpError)>;
