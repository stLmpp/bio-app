import { type ZodError, type ZodIssue, ZodIssueCode } from 'zod';

function isArray(array: unknown): array is readonly unknown[] {
  return Array.isArray(array);
}

function coerceArray<T>(possibleArray: T | T[] | readonly T[]): T[] {
  return isArray(possibleArray) ? [...possibleArray] : [possibleArray];
}

function uniqWith<T>(
  array: readonly T[],
  comparator: (valueA: T, valueB: T) => boolean
): T[] {
  const set = new Set<number>();
  const len = array.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const value_a = array[i];
      const value_b = array[j];
      if (comparator(value_a, value_b)) {
        set.add(i);
        break;
      }
    }
  }
  return array.filter((_, index) => !set.has(index));
}

function groupToMap<T, R>(
  array: readonly T[],
  callback: (item: T, index: number, array: readonly T[]) => R
): Map<R, T[]> {
  if (
    'groupToMap' in Array.prototype &&
    typeof Array.prototype.groupToMap === 'function'
  ) {
    return Array.prototype.groupToMap.call(array, callback);
  }
  const map = new Map<R, T[]>();
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    const key = callback(item, index, array);
    (map.get(key) ?? map.set(key, []).get(key))?.push(item);
  }
  return map;
}

export interface ZodErrorFormatted {
  path: string;
  message: string;
}

export function formatZodErrorString(
  zodErrorOrErrors: ZodError | ZodError[],
  options: {
    onlyFirstError?: boolean;
  } = {}
): string {
  const errors = formatZodError(zodErrorOrErrors);
  const newErrors = errors.map(
    (error) => `${error.path ? `${error.path}: ` : ''}${error.message}`
  );
  if (options.onlyFirstError) {
    return newErrors[0];
  }
  return newErrors.join(', ');
}

/**
 * @description Flatten one or multiple {@link ZodError} into an array of objects
 */
export function formatZodError(
  zodErrorOrErrors: ZodError | ZodError[]
): ZodErrorFormatted[] {
  // Get all errors in an array of objects
  const errors = formatZodErrorInternal(zodErrorOrErrors);
  // Filter only unique errors
  const uniqueErrors = uniqWith(
    errors,
    (errorA, errorB) => errorA.path === errorB.path && errorA.message === errorB.message
  );
  // Group errors by the path
  // const groupedErrors = groupToMap(uniqueErrors, (item) => item.path);
  // const finalErrors: ZodErrorFormatted[] = [];
  // for (const [key, value] of groupedErrors) {
  //   finalErrors.push(...value.map((item) => ({ path: key, message: item.message })));
  // }
  return uniqueErrors;
}

function formatZodErrorInternal(
  zodErrorOrErrors: ZodError | ZodError[]
): ZodErrorFormatted[] {
  const zodErrors = coerceArray(zodErrorOrErrors);
  const getInitial = (): ZodErrorFormatted[] => [];
  return zodErrors.reduce(
    (errorsLevel1, error) => [
      ...errorsLevel1,
      ...error.issues.reduce(
        (errorsLevel2, issue) => [...errorsLevel2, ...formatZodIssue(issue)],
        getInitial()
      ),
    ],
    getInitial()
  );
}

/**
 * @description Flatten a {@link ZodIssue} into an array of objects
 */
export function formatZodIssue(issue: ZodIssue): ZodErrorFormatted[] {
  const errors: ZodErrorFormatted[] = [
    {
      message: issue.message,
      path: formatZodIssuePath(issue.path),
    },
  ];
  switch (issue.code) {
    case ZodIssueCode.invalid_union: {
      errors.push(...formatZodErrorInternal(issue.unionErrors));
      break;
    }
    case ZodIssueCode.invalid_arguments: {
      errors.push(...formatZodErrorInternal(issue.argumentsError));
      break;
    }
    case ZodIssueCode.invalid_return_type: {
      errors.push(...formatZodErrorInternal(issue.returnTypeError));
      break;
    }
  }
  return errors;
}

/**
 * @description Transform a path array into a string
 * Example: ["config", "requests", 0, "name"] --> "config.requests[0].name"
 */
export function formatZodIssuePath(path: (string | number)[]): string {
  return path.reduce((acc: string, item: string | number) => {
    if (typeof item === 'number') {
      return `${acc}[${item}]`;
    }
    return `${acc && acc + '.'}${item}`;
  }, '');
}
