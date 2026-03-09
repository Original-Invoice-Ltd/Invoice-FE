
export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyFormatOptions {
  currency?: CurrencyCode;
  locale?: string;
  showSymbol?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
};


export function formatCurrency(
  amount: number | string,
  options: CurrencyFormatOptions = {}
): string {
  const {
    currency = 'NGN',
    locale,
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return showSymbol ? `${CURRENCY_SYMBOLS[currency]}0.00` : '0.00';
  }

  const formatLocale = locale || CURRENCY_LOCALES[currency];

  const formattedNumber = numericAmount.toLocaleString(formatLocale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return showSymbol ? `${CURRENCY_SYMBOLS[currency]}${formattedNumber}` : formattedNumber;
}

export function formatCurrencyCompact(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  const { currency = 'NGN', showSymbol = true } = options;
  const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : '';

  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }

  return formatCurrency(amount, { ...options, maximumFractionDigits: 0 });
}

export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[₦$£€,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

export function formatInvoicePrice(amount: number | string): string {
  return formatCurrency(amount, {
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatChartPrice(amount: number): string {
  return formatCurrencyCompact(amount, { currency: 'NGN' });
}
