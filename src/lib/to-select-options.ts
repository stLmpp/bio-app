import type { SelectItem } from '@svelteuidev/core';

export function toSelectOptions<T>(
  data: T[],
  options: {
    label?: (item: T, index: number, array: T[]) => unknown;
    value: (item: T, index: number, array: T[]) => unknown;
    disabled?: (item: T, index: number, array: T[]) => unknown;
  }
): SelectItem[] {
  return data.map((item, index, array) => {
    const selectItem: SelectItem = {
      value: String(options.value(item, index, array)),
    };
    if (options.label) {
      selectItem.label = String(options.label(item, index, array));
    }
    if (options.disabled) {
      selectItem.disabled = !!options.disabled(item, index, array);
    }
    return selectItem;
  });
}
