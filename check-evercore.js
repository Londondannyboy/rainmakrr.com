import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const results = await sql`SELECT id, name, slug, company_type, app FROM companies WHERE name ILIKE '%evercore%' LIMIT 5`;
console.log(JSON.stringify(results, null, 2));
