import type { ComboBoxItem } from 'carbon-components-svelte/types/ComboBox/ComboBox.svelte';

function normalizeString(str: unknown): string {
  return String(str)
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function comboBoxDefaultFilter(): (item: ComboBoxItem, value: string) => boolean {
  return (item, value) =>
    normalizeString(item.text)
      .toLowerCase()
      .includes(normalizeString(value).toLowerCase());
}
