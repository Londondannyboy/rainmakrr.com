/**
 * Batch convert currencies in article content to include USD
 * Run with: npx ts-node scripts/convert-article-currencies.ts
 */

import { sql } from '../src/lib/db';

const API_KEY = '04a70949baa5efdd987cd84f';

// Fetch exchange rates
async function getExchangeRates(): Promise<Record<string, number>> {
  const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
  const data = await response.json();
  if (data.result === 'success') {
    return data.conversion_rates;
  }
  throw new Error('Failed to fetch exchange rates');
}

// Currency symbols to codes
const currencySymbols: Record<string, string> = {
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  'A$': 'AUD',
  'C$': 'CAD',
  'HK$': 'HKD',
  'S$': 'SGD',
  '₹': 'INR',
};

// Convert amount to USD
function convertToUSD(amount: number, fromCurrency: string, rates: Record<string, number>): number {
  if (fromCurrency === 'USD') return amount;
  if (!rates[fromCurrency]) return amount;
  return amount / rates[fromCurrency];
}

// Format USD amount
function formatUSD(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)} billion`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)} million`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return `$${amount.toFixed(0)}`;
}

// Process article content - add USD after non-USD amounts
function processContent(content: string, rates: Record<string, number>): string {
  let result = content;

  // Pattern: £375 million, €1.5 billion, ¥21.29 billion, etc.
  // But NOT already converted (don't match if followed by " (£" or similar)
  const pattern = /(£|€|¥|A\$|C\$|HK\$|S\$|₹)([\d,.]+)\s*(million|billion|mn|bn|m|b)?(?!\s*\()/gi;

  result = result.replace(pattern, (match, symbol, numStr, multiplier) => {
    const currency = currencySymbols[symbol];
    if (!currency) return match;

    let amount = parseFloat(numStr.replace(/,/g, ''));

    // Apply multiplier
    if (/billion|bn|b/i.test(multiplier || '')) {
      amount *= 1_000_000_000;
    } else if (/million|mn|m/i.test(multiplier || '')) {
      amount *= 1_000_000;
    }

    const usdAmount = convertToUSD(amount, currency, rates);
    const usdFormatted = formatUSD(usdAmount);

    // Return: $470 million (£375 million)
    return `${usdFormatted} (${match.trim()})`;
  });

  return result;
}

// Process article title - add USD in brackets
function processTitle(title: string, rates: Record<string, number>): string {
  let result = title;

  const pattern = /(£|€|¥)([\d,.]+)\s*(million|billion|mn|bn|m|b)?(?!\s*\()/gi;

  result = result.replace(pattern, (match, symbol, numStr, multiplier) => {
    const currency = currencySymbols[symbol];
    if (!currency) return match;

    let amount = parseFloat(numStr.replace(/,/g, ''));

    if (/billion|bn|b/i.test(multiplier || '')) {
      amount *= 1_000_000_000;
    } else if (/million|mn|m/i.test(multiplier || '')) {
      amount *= 1_000_000;
    }

    const usdAmount = convertToUSD(amount, currency, rates);
    const usdFormatted = formatUSD(usdAmount);

    return `${usdFormatted} (${match.trim()})`;
  });

  return result;
}

async function main() {
  console.log('Fetching exchange rates...');
  const rates = await getExchangeRates();
  console.log('GBP rate:', rates.GBP);
  console.log('EUR rate:', rates.EUR);
  console.log('JPY rate:', rates.JPY);

  console.log('\nFetching articles...');
  const articles = await sql`
    SELECT id, title, content, excerpt
    FROM articles
    WHERE app = 'placement'
      AND status = 'published'
  `;

  console.log(`Found ${articles.length} articles\n`);

  let updated = 0;
  for (const article of articles) {
    const newTitle = processTitle(article.title, rates);
    const newContent = processContent(article.content, rates);
    const newExcerpt = article.excerpt ? processContent(article.excerpt, rates) : null;

    // Check if anything changed
    if (newTitle !== article.title || newContent !== article.content || newExcerpt !== article.excerpt) {
      console.log(`Updating: ${article.title.slice(0, 60)}...`);

      await sql`
        UPDATE articles
        SET
          title = ${newTitle},
          content = ${newContent},
          excerpt = ${newExcerpt}
        WHERE id = ${article.id}
      `;

      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} articles with USD conversions`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
