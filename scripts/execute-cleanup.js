const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function performCleanup() {
    const emails = [
        'kongest111@gmail.com',
        'unizames@gmail.com',
        'howow34@gmail.com',
        'baishyaunmesh@gmail.com'
    ];

    console.log('--- STARTING CLEANUP ---');

    // 1. Get User IDs
    const users = await sql`SELECT id FROM profiles WHERE email = ANY(${emails})`;
    const userIds = users.map(u => u.id);

    if (userIds.length === 0) {
        console.log('No users found. Nothing to delete.');
        return;
    }

    // 2. Get Organization IDs created by these users
    const orgs = await sql`SELECT id FROM organizations WHERE created_by = ANY(${userIds})`;
    const orgIds = orgs.map(o => o.id);

    console.log(`Deleting ${userIds.length} users and ${orgIds.length} organizations...`);

    try {
        // We use a manual sequence to handle dependencies

        if (orgIds.length > 0) {
            console.log('Cleaning up organization-related data...');
            await sql`DELETE FROM sales WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM inventory WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM expenses WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM organization_invites WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM audit_logs WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM organization_members WHERE org_id = ANY(${orgIds})`;
            await sql`DELETE FROM organizations WHERE id = ANY(${orgIds})`;
        }

        console.log('Cleaning up user-related data...');
        // Memberships for other orgs
        await sql`DELETE FROM organization_members WHERE user_id = ANY(${userIds})`;
        // Audit logs for these users
        await sql`DELETE FROM audit_logs WHERE user_id = ANY(${userIds})`;
        // Finally the profiles
        await sql`DELETE FROM profiles WHERE id = ANY(${userIds})`;

        console.log('--- CLEANUP COMPLETE ---');
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

performCleanup().catch(console.error);
