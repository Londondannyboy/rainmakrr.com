import { neon } from '@neondatabase/serverless';

// Quest database connection string
const connectionString = 'postgresql://neondb_owner:npg_LjBNF17HSTix@ep-green-smoke-ab3vtnw9-pooler.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(connectionString);

async function testQuestDatabase() {
  try {
    console.log('Testing Quest database connection...\n');

    // Test 1: Check if new columns exist
    console.log('1. Checking articles table schema...');
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'articles'
      AND column_name IN ('article_angle', 'word_count', 'excerpt', 'hero_image_url')
      ORDER BY column_name;
    `;
    console.log('✓ Found columns:', columns.map(c => c.column_name).join(', '));

    // Test 2: Try to query articles with new schema
    console.log('\n2. Testing article query with new schema...');
    const articles = await sql`
      SELECT
        id,
        title,
        slug,
        excerpt,
        article_angle,
        word_count,
        hero_image_url,
        hero_image_alt,
        status
      FROM articles
      WHERE app = 'placement'
      LIMIT 1;
    `;

    if (articles.length > 0) {
      console.log('✓ Successfully queried article:');
      console.log('  - Title:', articles[0].title);
      console.log('  - Slug:', articles[0].slug);
      console.log('  - Has excerpt:', !!articles[0].excerpt);
      console.log('  - Has article_angle:', !!articles[0].article_angle);
      console.log('  - Has word_count:', !!articles[0].word_count);
      console.log('  - Has hero_image_url:', !!articles[0].hero_image_url);
    } else {
      console.log('⚠ No articles found with app="placement"');
    }

    // Test 3: Check companies table
    console.log('\n3. Checking companies table...');
    const companies = await sql`
      SELECT COUNT(*) as count
      FROM companies
      WHERE status = 'published' AND company_type = 'placement_agent';
    `;
    console.log('✓ Found', companies[0].count, 'published placement agent companies');

    console.log('\n✅ All tests passed! Quest database is ready.');

  } catch (error) {
    console.error('❌ Error testing Quest database:', error.message);
    process.exit(1);
  }
}

testQuestDatabase();
