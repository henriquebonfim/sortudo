export const STAT_CARD_VARIANTS = ['default', 'hot', 'cold', 'brand', 'gold'] as const;

export type StatCardVariant = (typeof STAT_CARD_VARIANTS)[number];

export const statCardVariantStyles = {
  default: 'text-foreground',
  hot: 'text-hot',
  cold: 'text-cold',
  brand: 'text-primary',
  gold: 'text-primary',
} as const satisfies Record<StatCardVariant, string>;
