import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function completeCompanyData() {
  console.log('Checking companies with missing data...\n');

  // Get all placement agent companies
  const companies = await sql`
    SELECT
      id,
      name,
      slug,
      status,
      primary_country,
      primary_region,
      hero_image_url,
      featured_image_url,
      logo_url,
      payload
    FROM companies
    WHERE company_type = 'placement_agent'
    ORDER BY name
  `;

  console.log(`Found ${companies.length} placement agent companies\n`);

  // Country to region mapping
  const countryToRegion = {
    'United States': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'United Kingdom': 'Europe',
    'Germany': 'Europe',
    'France': 'Europe',
    'Switzerland': 'Europe',
    'Netherlands': 'Europe',
    'Spain': 'Europe',
    'Italy': 'Europe',
    'Sweden': 'Europe',
    'Denmark': 'Europe',
    'Norway': 'Europe',
    'Finland': 'Europe',
    'Belgium': 'Europe',
    'Austria': 'Europe',
    'Luxembourg': 'Europe',
    'Ireland': 'Europe',
    'Singapore': 'Asia Pacific',
    'Hong Kong': 'Asia Pacific',
    'China': 'Asia Pacific',
    'Japan': 'Asia Pacific',
    'South Korea': 'Asia Pacific',
    'Australia': 'Asia Pacific',
    'New Zealand': 'Asia Pacific',
    'India': 'Asia Pacific',
    'Brazil': 'Latin America',
    'Argentina': 'Latin America',
    'Chile': 'Latin America',
    'Colombia': 'Latin America',
    'Peru': 'Latin America',
    'South Africa': 'Africa',
    'Nigeria': 'Africa',
    'Kenya': 'Africa',
    'Egypt': 'Africa',
    'Morocco': 'Africa',
    'Ghana': 'Africa',
    'United Arab Emirates': 'Middle East',
    'Saudi Arabia': 'Middle East',
    'Qatar': 'Middle East',
    'Kuwait': 'Middle East',
    'Bahrain': 'Middle East',
    'Oman': 'Middle East',
    'Israel': 'Middle East',
  };

  let updateCount = 0;

  for (const company of companies) {
    const payload = company.payload || {};
    let needsUpdate = false;

    // Prepare update fields
    const updates = {};

    // Auto-publish
    if (company.status !== 'published') {
      updates.status = 'published';
      needsUpdate = true;
      console.log(`📝 ${company.name}: Setting status to published`);
    }

    // Set primary_country from payload if missing
    if (!company.primary_country && payload.headquarters_country) {
      updates.primary_country = payload.headquarters_country;
      needsUpdate = true;
      console.log(`🌍 ${company.name}: Setting primary_country to ${payload.headquarters_country}`);
    }

    // Set primary_region based on country
    if (!company.primary_region && (company.primary_country || updates.primary_country)) {
      const country = updates.primary_country || company.primary_country;
      const region = countryToRegion[country];
      if (region) {
        updates.primary_region = region;
        needsUpdate = true;
        console.log(`🗺️  ${company.name}: Setting primary_region to ${region}`);
      }
    }

    // Generate alt text for hero_image_url if missing
    if (company.hero_image_url && !payload.hero_image_alt) {
      payload.hero_image_alt = `${company.name} - Private Equity Placement Agent Profile`;
      updates.payload = payload;
      needsUpdate = true;
      console.log(`🖼️  ${company.name}: Adding hero_image_alt`);
    }

    // Generate alt text for featured_image_url if missing
    if (company.featured_image_url && !payload.featured_image_alt) {
      payload.featured_image_alt = `${company.name} - Leading Placement Agent`;
      updates.payload = payload;
      needsUpdate = true;
      console.log(`🖼️  ${company.name}: Adding featured_image_alt`);
    }

    // Generate alt text for logo_url if missing
    if (company.logo_url && !payload.logo_alt) {
      payload.logo_alt = `${company.name} logo`;
      updates.payload = payload;
      needsUpdate = true;
      console.log(`🏢 ${company.name}: Adding logo_alt`);
    }

    // Update if needed
    if (needsUpdate) {
      await sql`
        UPDATE companies
        SET
          status = COALESCE(${updates.status || null}, status),
          primary_country = COALESCE(${updates.primary_country || null}, primary_country),
          primary_region = COALESCE(${updates.primary_region || null}, primary_region),
          payload = COALESCE(${updates.payload ? JSON.stringify(updates.payload) : null}::jsonb, payload)
        WHERE id = ${company.id}
      `;

      updateCount++;
      console.log(`✅ ${company.name}: Updated\n`);
    }
  }

  console.log(`\n✨ Complete! Updated ${updateCount} companies.`);
}

completeCompanyData().catch(console.error).finally(() => process.exit());
