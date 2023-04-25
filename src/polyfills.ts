import { Subject } from 'rxjs';

declare module 'rxjs' {
  interface Subject<T> {
    set(value: T): void;
  }
}

Subject.prototype.set = function (value) {
  this.next(value);
};
Subject.prototype.lift = function (operator) {
  const result = new Subject<any>();
  result.operator = operator;
  result.source = this;
  return result;
};
