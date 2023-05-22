export type Entries<T, K extends keyof T = keyof T> = [K, T[K]][];

export function objectEntries<T extends Record<string, any>>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}
