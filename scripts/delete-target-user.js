const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function deleteSpecificUser() {
    const userId = 'U39L684fdEStPspq3OanhCbYDIl3'; // The targeted anonymous user

    console.log(`--- DELETING USER: ${userId} ---`);

    try {
        // 1. Delete memberships (using correct column: user_id)
        const members = await sql`DELETE FROM organization_members WHERE user_id = ${userId} RETURNING *`;
        console.log(`Deleted ${members.length} organization memberships.`);

        // 2. Delete audit logs referencing this user (if any)
        // We'll check if table has user_id or actor_id
        // For now, let's just try to delete the profile, it will fail if there are FK constraints
        const profile = await sql`DELETE FROM profiles WHERE id = ${userId} RETURNING *`;

        if (profile.length > 0) {
            console.log(`Successfully deleted profile: ${profile[0].email || 'Anonymous'} (${profile[0].id})`);
        } else {
            console.log('User not found or already deleted.');
        }

        console.log('--- CLEANUP COMPLETE ---');
    } catch (error) {
        console.error('Deletion failed:', error);
    }
}

deleteSpecificUser().catch(console.error);
