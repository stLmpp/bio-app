import { BehaviorSubject, map } from 'rxjs';

const isRequestingStore$ = new BehaviorSubject(0);

export const isRequesting = isRequestingStore$.pipe(map(Boolean));
export function addRequest(): void {
  isRequestingStore$.next(isRequestingStore$.value + 1);
}
export function removeRequest(): void {
  isRequestingStore$.next(Math.max(isRequestingStore$.value - 1, 0));
}
