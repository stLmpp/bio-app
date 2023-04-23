export function arrayUniqBy<T>(
  array: readonly T[],
  callback: (item: T, index: number, array: readonly T[]) => unknown
): T[] {
  const map = new Map<unknown, T>();
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    const key = callback(item, index, array);
    if (map.has(key)) {
      continue;
    }
    map.set(key, item);
  }
  return [...map.values()];
}
