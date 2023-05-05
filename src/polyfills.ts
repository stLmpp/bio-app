import { Subject } from 'rxjs';
import { ZodType } from 'zod';

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

declare module 'zod' {
  interface ZodType<Output = any> {
    parseOrFallback(data: unknown, fallback: Output): Output;
  }
}

ZodType.prototype.parseOrFallback = function (data, fallback) {
  const result = this.safeParse(data);
  return result.success ? result.data : fallback;
};
