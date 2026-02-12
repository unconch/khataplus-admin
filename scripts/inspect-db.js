const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log('--- SALES SCHEMA ---');
        const salesSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales'`;
        console.table(salesSchema);

        console.log('--- ORGANIZATIONS SCHEMA ---');
        const orgSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'organizations'`;
        console.table(orgSchema);

        console.log('--- PROFILES SCHEMA ---');
        const profileSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles'`;
        console.table(profileSchema);

        console.log('--- SAMPLE SALES DATA ---');
        const sampleSales = await sql`SELECT * FROM sales LIMIT 1`;
        console.log(sampleSales);

    } catch (err) {
        console.error(err);
    }
}

run();
