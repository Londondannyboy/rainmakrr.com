/**
 * Currency conversion utility using Exchange Rate API
 * API Key: 04a70949baa5efdd987cd84f
 */

const API_KEY = '04a70949baa5efdd987cd84f';
const API_BASE = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Cache exchange rates (refresh every hour)
let ratesCache: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Currency symbols to codes
export const currencySymbols: Record<string, string> = {
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  'A$': 'AUD',
  'C$': 'CAD',
  'HK$': 'HKD',
  'S$': 'SGD',
  '₹': 'INR',
  'CHF': 'CHF',
  'kr': 'SEK',
};

// Country code to preferred currency
export const countryToCurrency: Record<string, string> = {
  'US': 'USD',
  'GB': 'GBP',
  'UK': 'GBP',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'BE': 'EUR',
  'AT': 'EUR',
  'IE': 'EUR',
  'PT': 'EUR',
  'FI': 'EUR',
  'LU': 'EUR',
  'JP': 'JPY',
  'CN': 'CNY',
  'AU': 'AUD',
  'CA': 'CAD',
  'HK': 'HKD',
  'SG': 'SGD',
  'IN': 'INR',
  'CH': 'CHF',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',
  'NZ': 'NZD',
  'AE': 'AED',
  'SA': 'SAR',
};

// Currency display info
export const currencyInfo: Record<string, { symbol: string; name: string; position: 'before' | 'after' }> = {
  'USD': { symbol: '$', name: 'US Dollar', position: 'before' },
  'GBP': { symbol: '£', name: 'British Pound', position: 'before' },
  'EUR': { symbol: '€', name: 'Euro', position: 'before' },
  'JPY': { symbol: '¥', name: 'Japanese Yen', position: 'before' },
  'AUD': { symbol: 'A$', name: 'Australian Dollar', position: 'before' },
  'CAD': { symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
  'HKD': { symbol: 'HK$', name: 'Hong Kong Dollar', position: 'before' },
  'SGD': { symbol: 'S$', name: 'Singapore Dollar', position: 'before' },
  'CHF': { symbol: 'CHF ', name: 'Swiss Franc', position: 'before' },
  'CNY': { symbol: '¥', name: 'Chinese Yuan', position: 'before' },
  'INR': { symbol: '₹', name: 'Indian Rupee', position: 'before' },
  'SEK': { symbol: ' kr', name: 'Swedish Krona', position: 'after' },
  'NOK': { symbol: ' kr', name: 'Norwegian Krone', position: 'after' },
  'DKK': { symbol: ' kr', name: 'Danish Krone', position: 'after' },
  'NZD': { symbol: 'NZ$', name: 'New Zealand Dollar', position: 'before' },
  'AED': { symbol: 'AED ', name: 'UAE Dirham', position: 'before' },
  'SAR': { symbol: 'SAR ', name: 'Saudi Riyal', position: 'before' },
};

/**
 * Fetch exchange rates from API
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  // Return cached rates if still valid
  if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_TTL) {
    return ratesCache.rates;
  }

  try {
    const response = await fetch(`${API_BASE}/latest/USD`);
    const data = await response.json();

    if (data.result === 'success') {
      ratesCache = {
        rates: data.conversion_rates,
        timestamp: Date.now(),
      };
      return data.conversion_rates;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
  }

  // Return empty object if API fails
  return {};
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  const rates = await getExchangeRates();
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return amount; // Return original if conversion not possible
  }

  // Convert to USD first, then to target currency
  const inUSD = amount / rates[fromCurrency];
  return inUSD * rates[toCurrency];
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const info = currencyInfo[currencyCode] || { symbol: currencyCode + ' ', position: 'before' };

  // Format number with appropriate decimal places
  const decimals = ['JPY', 'KRW', 'VND'].includes(currencyCode) ? 0 : 2;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return info.position === 'before'
    ? `${info.symbol}${formatted}`
    : `${formatted}${info.symbol}`;
}

/**
 * Parse currency amounts from text
 * Returns array of { original, amount, currency } objects
 */
export function parseCurrencyAmounts(text: string): Array<{
  original: string;
  amount: number;
  currency: string;
}> {
  const results: Array<{ original: string; amount: number; currency: string }> = [];

  // Pattern to match currency amounts like "$500 million", "£375m", "€1.5bn"
  const patterns = [
    // $500 million, $1.5 billion, etc.
    /(\$|£|€|¥|A\$|C\$|HK\$|S\$|₹)\s*([\d,.]+)\s*(million|billion|mn|bn|m|b)?/gi,
    // 500 million USD, 375m GBP, etc.
    /([\d,.]+)\s*(million|billion|mn|bn|m|b)?\s*(USD|GBP|EUR|JPY|AUD|CAD|HKD|SGD|CHF|CNY|INR)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const original = match[0];
      let amount: number;
      let currency: string;

      if (match[1] in currencySymbols) {
        // Symbol-first format
        currency = currencySymbols[match[1] as keyof typeof currencySymbols];
        amount = parseFloat(match[2].replace(/,/g, ''));
      } else {
        // Currency code format
        amount = parseFloat(match[1].replace(/,/g, ''));
        currency = match[3].toUpperCase();
      }

      // Apply multiplier
      const multiplier = match[3] || match[2] || '';
      if (/billion|bn|b/i.test(multiplier)) {
        amount *= 1_000_000_000;
      } else if (/million|mn|m/i.test(multiplier)) {
        amount *= 1_000_000;
      }

      results.push({ original, amount, currency });
    }
  }

  return results;
}

/**
 * Convert all currency amounts in text to target currency
 */
export async function convertTextCurrencies(
  text: string,
  targetCurrency: string
): Promise<string> {
  const amounts = parseCurrencyAmounts(text);
  let result = text;

  for (const { original, amount, currency } of amounts) {
    if (currency === targetCurrency) continue;

    const converted = await convertCurrency(amount, currency, targetCurrency);

    // Format the converted amount
    let convertedStr: string;
    if (converted >= 1_000_000_000) {
      convertedStr = formatCurrency(converted / 1_000_000_000, targetCurrency) + ' billion';
    } else if (converted >= 1_000_000) {
      convertedStr = formatCurrency(converted / 1_000_000, targetCurrency) + ' million';
    } else {
      convertedStr = formatCurrency(converted, targetCurrency);
    }

    // Replace with converted amount + original in parentheses
    result = result.replace(original, `${convertedStr} (${original})`);
  }

  return result;
}

/**
 * Get visitor's preferred currency from country code
 */
export function getCurrencyForCountry(countryCode: string | null): string {
  if (!countryCode) return 'USD';
  return countryToCurrency[countryCode.toUpperCase()] || 'USD';
}
