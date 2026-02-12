const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function inspectSchema() {
    console.log('--- INSPECTING ORGANIZATION_MEMBERS SCHEMA ---');
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'organization_members'
        `;
        console.table(columns);
    } catch (error) {
        console.error('Failed to inspect schema:', error);
    }
}

inspectSchema().catch(console.error);
