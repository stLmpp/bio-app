import { Subject } from 'rxjs';

declare module 'rxjs' {
  interface Subject<T> {
    set(value: T): void;
  }
}

Subject.prototype.set = function (value) {
  this.next(value);
};
