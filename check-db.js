import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

async function check() {
  console.log('Checking companies in database...\n');
  
  const all = await sql`SELECT slug, name, company_type, status FROM companies LIMIT 10`;
  console.log('All companies:');
  console.table(all);
  
  const specific = await sql`SELECT slug, name, company_type, status FROM companies WHERE slug IN ('evercore', 'campbell-lutyens', 'secs-in-the-city', 'bain-and-gray')`;
  console.log('\nSpecific companies:');
  console.table(specific);
  
  const detailQuery = await sql`SELECT slug, name, company_type, status FROM companies WHERE slug = 'evercore' AND company_type IN ('placement_agent', 'executive_assistant_recruiters') AND status = 'published'`;
  console.log('\nDetail query for evercore:');
  console.table(detailQuery);
  
  await sql.end();
}

check().catch(console.error);
