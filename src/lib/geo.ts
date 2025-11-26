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

/**
 * Detect visitor's country from request headers
 * Supports Cloudflare, Vercel, AWS CloudFront, and fallbacks
 */
export function getVisitorCountry(request: Request): string | null {
  const headers = request.headers;

  // Cloudflare (most common for Railway)
  const cfCountry = headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') return cfCountry.toUpperCase();

  // Vercel
  const vercelCountry = headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry.toUpperCase();

  // AWS CloudFront
  const awsCountry = headers.get('cloudfront-viewer-country');
  if (awsCountry) return awsCountry.toUpperCase();

  // Fastly
  const fastlyCountry = headers.get('x-country-code');
  if (fastlyCountry) return fastlyCountry.toUpperCase();

  // Generic geo header
  const geoCountry = headers.get('x-geo-country');
  if (geoCountry) return geoCountry.toUpperCase();

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
