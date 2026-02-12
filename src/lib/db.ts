import { neon } from '@neondatabase/serverless';

// Prevent build-time crash if env vars are missing
const connectionString = process.env.DATABASE_URL;

export const sql = connectionString
    ? neon(connectionString)
    : ((...args: any[]) => { throw new Error('DATABASE_URL is not defined in environment variables.'); }) as any;

export const demoSql = process.env.DEMO_DATABASE_URL
    ? neon(process.env.DEMO_DATABASE_URL)
    : null;
