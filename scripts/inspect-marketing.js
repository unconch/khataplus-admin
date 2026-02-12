const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log('--- MARKETING CAMPAIGNS SCHEMA ---');
        const campaignSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'marketing_campaigns'`;
        console.table(campaignSchema);

        console.log('--- PSEO CITIES SCHEMA ---');
        const citiesSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pseo_cities'`;
        console.table(citiesSchema);

        console.log('--- PSEO CATEGORIES SCHEMA ---');
        const categoriesSchema = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pseo_categories'`;
        console.table(categoriesSchema);

        console.log('--- SAMPLE DATA COUNTS ---');
        const counts = await Promise.all([
            sql`SELECT COUNT(*) FROM marketing_campaigns`,
            sql`SELECT COUNT(*) FROM pseo_cities`,
            sql`SELECT COUNT(*) FROM pseo_categories`
        ]);
        console.log({
            campaigns: counts[0][0].count,
            cities: counts[1][0].count,
            categories: counts[2][0].count
        });

    } catch (err) {
        console.error(err);
    }
}

run();
