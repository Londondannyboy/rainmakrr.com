import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const results = await sql`SELECT id, name, slug, payload::text FROM companies WHERE slug = 'evercore' LIMIT 1`;

if (results[0]) {
  const payload = JSON.parse(results[0].payload);
  console.log('Has payload:', !!payload);
  console.log('Has profile_sections:', !!payload.profile_sections);
  console.log('Section count:', Object.keys(payload.profile_sections || {}).length);
  console.log('Section keys:', Object.keys(payload.profile_sections || {}).join(', '));
  console.log('\nFirst section content length:', Object.values(payload.profile_sections || {})[0]?.content?.length || 0);
}
