const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkUserRoles() {
    console.log('--- AUDITING USER ROLES IN PROFILES ---');
    const profiles = await sql`SELECT id, email, name, role FROM profiles LIMIT 20`;
    console.table(profiles);
    console.log('--- AUDIT COMPLETE ---');
}

checkUserRoles().catch(console.error);
