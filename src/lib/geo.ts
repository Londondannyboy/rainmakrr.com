/**
 * Geo-targeting utility for visitor location detection
 * Works with Cloudflare, Vercel, and other CDN headers
 */

// Country to region mapping for placement agents
export const countryToRegion: Record<string, string> = {
  // North America
  'US': 'North America',
  'CA': 'North America',
  'MX': 'North America',

  // Europe
  'GB': 'Europe',
  'UK': 'Europe',
  'DE': 'Europe',
  'FR': 'Europe',
  'IT': 'Europe',
  'ES': 'Europe',
  'NL': 'Europe',
  'CH': 'Europe',
  'SE': 'Europe',
  'NO': 'Europe',
  'DK': 'Europe',
  'FI': 'Europe',
  'IE': 'Europe',
  'BE': 'Europe',
  'AT': 'Europe',
  'PL': 'Europe',
  'PT': 'Europe',
  'LU': 'Europe',

  // Asia Pacific
  'SG': 'Asia Pacific',
  'HK': 'Asia Pacific',
  'JP': 'Asia Pacific',
  'CN': 'Asia Pacific',
  'KR': 'Asia Pacific',
  'AU': 'Asia Pacific',
  'NZ': 'Asia Pacific',
  'IN': 'Asia Pacific',
  'TW': 'Asia Pacific',
  'MY': 'Asia Pacific',
  'TH': 'Asia Pacific',
  'ID': 'Asia Pacific',
  'PH': 'Asia Pacific',
  'VN': 'Asia Pacific',

  // Middle East
  'AE': 'Middle East',
  'SA': 'Middle East',
  'QA': 'Middle East',
  'KW': 'Middle East',
  'BH': 'Middle East',
  'OM': 'Middle East',
  'IL': 'Middle East',

  // Latin America
  'BR': 'Latin America',
  'AR': 'Latin America',
  'CL': 'Latin America',
  'CO': 'Latin America',
  'PE': 'Latin America',
  'MX': 'Latin America',

  // Africa
  'ZA': 'Africa',
  'NG': 'Africa',
  'KE': 'Africa',
  'EG': 'Africa',
  'MA': 'Africa',
};

// Country code to full name
export const countryNames: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'UK': 'United Kingdom',
  'CA': 'Canada',
  'DE': 'Germany',
  'FR': 'France',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'JP': 'Japan',
  'AU': 'Australia',
  'CH': 'Switzerland',
  'NL': 'Netherlands',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
};

// Browser language to country mapping
const languageToCountry: Record<string, string> = {
  'en-US': 'US',
  'en-GB': 'GB',
  'en-AU': 'AU',
  'en-CA': 'CA',
  'en-NZ': 'NZ',
  'en-IE': 'IE',
  'en-ZA': 'ZA',
  'en-SG': 'SG',
  'en-HK': 'HK',
  'de-DE': 'DE',
  'de-AT': 'AT',
  'de-CH': 'CH',
  'fr-FR': 'FR',
  'fr-CA': 'CA',
  'fr-BE': 'BE',
  'fr-CH': 'CH',
  'es-ES': 'ES',
  'es-MX': 'MX',
  'it-IT': 'IT',
  'nl-NL': 'NL',
  'nl-BE': 'BE',
  'pt-BR': 'BR',
  'pt-PT': 'PT',
  'ja-JP': 'JP',
  'zh-CN': 'CN',
  'zh-HK': 'HK',
  'zh-TW': 'TW',
  'ko-KR': 'KR',
};

/**
 * Parse Accept-Language header to get country
 */
function getCountryFromLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  // Parse Accept-Language: en-US,en;q=0.9,de;q=0.8
  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';');
    return code;
  });

  // Try exact matches first (en-US, en-GB)
  for (const lang of languages) {
    if (languageToCountry[lang]) {
      return languageToCountry[lang];
    }
  }

  // Try partial matches (en -> US as default for English)
  for (const lang of languages) {
    const base = lang.split('-')[0];
    if (base === 'en') return 'US';
    if (base === 'de') return 'DE';
    if (base === 'fr') return 'FR';
    if (base === 'es') return 'ES';
    if (base === 'it') return 'IT';
    if (base === 'ja') return 'JP';
    if (base === 'zh') return 'CN';
    if (base === 'ko') return 'KR';
    if (base === 'pt') return 'PT';
    if (base === 'nl') return 'NL';
  }

  return null;
}

/**
 * Detect visitor's country from request headers
 * Priority: CDN geo headers > Browser language fallback
 */
export function getVisitorCountry(request: Request): string | null {
  const headers = request.headers;

  // 1. Cloudflare (most common for Railway)
  const cfCountry = headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') return cfCountry.toUpperCase();

  // 2. Vercel
  const vercelCountry = headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry.toUpperCase();

  // 3. AWS CloudFront
  const awsCountry = headers.get('cloudfront-viewer-country');
  if (awsCountry) return awsCountry.toUpperCase();

  // 4. Fastly
  const fastlyCountry = headers.get('x-country-code');
  if (fastlyCountry) return fastlyCountry.toUpperCase();

  // 5. Generic geo header
  const geoCountry = headers.get('x-geo-country');
  if (geoCountry) return geoCountry.toUpperCase();

  // 6. FALLBACK: Browser language (Accept-Language header)
  const acceptLanguage = headers.get('accept-language');
  const langCountry = getCountryFromLanguage(acceptLanguage);
  if (langCountry) return langCountry;

  return null;
}

/**
 * Get the region for a country code
 */
export function getRegionForCountry(countryCode: string | null): string | null {
  if (!countryCode) return null;
  return countryToRegion[countryCode.toUpperCase()] || null;
}

/**
 * Get display name for a country code
 */
export function getCountryName(countryCode: string | null): string | null {
  if (!countryCode) return null;
  return countryNames[countryCode.toUpperCase()] || null;
}

/**
 * Sort agents array to prioritize visitor's country/region
 */
export function sortAgentsByGeo<T extends { primary_country?: string; primary_region?: string }>(
  agents: T[],
  visitorCountry: string | null
): T[] {
  if (!visitorCountry) return agents;

  const visitorRegion = getRegionForCountry(visitorCountry);
  const visitorCountryName = getCountryName(visitorCountry);

  return [...agents].sort((a, b) => {
    // Exact country match comes first
    const aCountryMatch = a.primary_country === visitorCountryName ? 1 : 0;
    const bCountryMatch = b.primary_country === visitorCountryName ? 1 : 0;
    if (aCountryMatch !== bCountryMatch) return bCountryMatch - aCountryMatch;

    // Then region match
    const aRegionMatch = a.primary_region === visitorRegion ? 1 : 0;
    const bRegionMatch = b.primary_region === visitorRegion ? 1 : 0;
    if (aRegionMatch !== bRegionMatch) return bRegionMatch - aRegionMatch;

    // Keep original order for non-matches
    return 0;
  });
}
