const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function deleteOrgs() {
    const slugs = [
        'gauhati-cooperative-88i4',
        'gauhati-cooperative'
    ];
    const namePattern = 'gauhati cooperative';

    console.log('--- SEARCHING FOR IDS ---');
    const orgs = await sql`
        SELECT id, name, slug 
        FROM organizations 
        WHERE slug = ANY(${slugs}) 
           OR LOWER(name) = LOWER(${namePattern})
    `;
    const orgIds = orgs.map(o => o.id);

    if (orgIds.length === 0) {
        console.log('No organizations found to delete.');
        return;
    }

    console.log(`Deleting ${orgIds.length} organizations: ${orgs.map(o => o.name + ' (' + o.slug + ')').join(', ')}`);

    try {
        console.log('Cleaning up organization-related data...');
        await sql`DELETE FROM sales WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM inventory WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM expenses WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM organization_invites WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM audit_logs WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM organization_members WHERE org_id = ANY(${orgIds})`;
        await sql`DELETE FROM organizations WHERE id = ANY(${orgIds})`;

        console.log('--- CLEANUP COMPLETE ---');
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

deleteOrgs().catch(console.error);
