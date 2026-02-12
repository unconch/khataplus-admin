const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkOrgs() {
    const slugs = [
        'gauhati-cooperative-88i4',
        'gauhati-cooperative'
    ];
    const namePattern = 'gauhati cooperative';

    console.log('--- TARGET ORGANIZATIONS ---');
    const orgs = await sql`
        SELECT id, name, slug, created_at 
        FROM organizations 
        WHERE slug = ANY(${slugs}) 
           OR LOWER(name) = LOWER(${namePattern})
    `;
    console.table(orgs);
}

checkOrgs().catch(console.error);
