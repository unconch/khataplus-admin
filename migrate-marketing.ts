import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
    console.log('Starting marketing migration...');

    try {
        console.log('Creating marketing_campaigns table...');
        await sql`
            CREATE TABLE IF NOT EXISTS marketing_campaigns (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                media_url TEXT,
                platforms TEXT[],
                scheduled_at TIMESTAMPTZ,
                status TEXT DEFAULT 'draft',
                metrics JSONB DEFAULT '{"clicks":0, "reach":0}'::jsonb,
                posted_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('marketing_campaigns table created/verified.');

        console.log('Creating pseo_cities table...');
        await sql`
            CREATE TABLE IF NOT EXISTS pseo_cities (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                slug TEXT NOT NULL UNIQUE,
                enabled BOOLEAN DEFAULT true,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('pseo_cities table created/verified.');

        console.log('Marketing migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
