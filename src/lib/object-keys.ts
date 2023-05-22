export type Keys<T, K extends keyof T = keyof T> = K[];

export function objectKeys<T extends Record<string, any>>(object: T): Keys<T> {
  return Object.keys(object);
}
