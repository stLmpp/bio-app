export type PluralMap = Partial<Record<`=${number}` | 'other', string | null>>;

export function plural(value: number, pluralMap: PluralMap): string | null {
  return pluralMap[`=${value}`] ?? pluralMap.other ?? null;
}
