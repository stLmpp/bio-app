import { Subject } from 'rxjs';
import type { HttpError } from '../http-shared';

const _errorNotification$ = new Subject<HttpError>();

export const errorNotification$ = _errorNotification$.asObservable();

export function addErrorNotification(error: HttpError): void {
  _errorNotification$.next(error);
}
