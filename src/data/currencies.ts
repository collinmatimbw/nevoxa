export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateToUsd: number;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToUsd: 1 },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿', rateToUsd: 2500 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', rateToUsd: 130 },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬', rateToUsd: 3700 },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling', flag: '🇬🇧', rateToUsd: 0.79 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToUsd: 0.92 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rateToUsd: 7.24 },
];

export function getCurrency(code?: string): Currency {
  return currencies.find(c => c.code === code) || currencies[0];
}

export function formatCurrency(amount: number, code: string): string {
  const c = getCurrency(code);
  return `${c.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
