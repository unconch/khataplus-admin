const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkUsers() {
    const emails = [
        'kongest111@gmail.com',
        'unizames@gmail.com',
        'howow34@gmail.com',
        'baishyaunmesh@gmail.com'
    ];

    console.log('--- TARGET USERS ---');
    const users = await sql`SELECT id, email, name FROM profiles WHERE email = ANY(${emails})`;
    console.table(users);

    if (users.length === 0) {
        console.log('No users found.');
        return;
    }

    const userIds = users.map(u => u.id);

    console.log('\n--- ASSOCIATED ORGANIZATIONS (Created By) ---');
    const createdOrgs = await sql`SELECT id, name, slug, created_by FROM organizations WHERE created_by = ANY(${userIds})`;
    console.table(createdOrgs);

    console.log('\n--- ORGANIZATION MEMBERSHIPS ---');
    const memberships = await sql`
        SELECT om.org_id, o.name as org_name, om.user_id, p.email as user_email, om.role
        FROM organization_members om
        JOIN organizations o ON om.org_id = o.id
        JOIN profiles p ON om.user_id = p.id
        WHERE p.email = ANY(${emails})
    `;
    console.table(memberships);
}

checkUsers().catch(console.error);
