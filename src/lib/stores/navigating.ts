import { BehaviorSubject } from 'rxjs';

const isNavigatingStore$ = new BehaviorSubject(false);

export const isNavigating = isNavigatingStore$.asObservable();

export function setIsNavigating(navigating: boolean): void {
  isNavigatingStore$.next(navigating);
}
