const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkAnonymousUsers() {
    console.log('--- INSPECTING ANONYMOUS USERS ---');
    const users = await sql`
        SELECT id, name, email, role, status, created_at 
        FROM profiles 
        WHERE email IS NULL OR email = '' OR name IS NULL OR name = ''
        ORDER BY created_at DESC
        LIMIT 10
    `;

    console.table(users);
}

checkAnonymousUsers().catch(console.error);
