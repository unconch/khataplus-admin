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
    console.log('Starting migration...');

    try {
        console.log('Creating announcements table...');
        await sql`DROP TABLE IF EXISTS announcements;`;
        await sql`
            CREATE TABLE IF NOT EXISTS announcements (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                type TEXT DEFAULT 'info',
                enabled BOOLEAN DEFAULT true,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                created_by TEXT
            );
        `;
        console.log('Announcements table created/verified.');

        console.log('Creating audit_logs table...');
        await sql`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                action TEXT NOT NULL,
                org_id INTEGER,
                user_id TEXT,
                details JSONB,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('Audit_logs table created/verified.');

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
