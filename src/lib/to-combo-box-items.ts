import type { ComboBoxItem } from 'carbon-components-svelte/types/ComboBox/ComboBox.svelte';

export function toComboBoxItems<T>(
  data: T[],
  options: {
    text: (item: T, index: number, array: T[]) => unknown;
    id: (item: T, index: number, array: T[]) => unknown;
    disabled?: (item: T, index: number, array: T[]) => unknown;
  }
): ComboBoxItem[] {
  return data.map((item, index, array) => {
    const comboBoxItem: ComboBoxItem = {
      id: String(options.id(item, index, array)),
      text: String(options.text(item, index, array)),
    };
    if (options.disabled) {
      comboBoxItem.disabled = !!options.disabled(item, index, array);
    }
    return comboBoxItem;
  });
}
