import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    const { sql } = await import("../src/lib/db");
    const orgName = "Krishalay";
    console.log(`Searching for organization: ${orgName}`);

    const orgs = await sql`SELECT * FROM organizations WHERE name ILIKE ${'%' + orgName + '%'}`;

    if (orgs.length === 0) {
        console.log("No organization found.");
        return;
    }

    const org = orgs[0];
    console.log("Organization found:", org);

    const creatorId = org.created_by;
    console.log(`Creator ID: ${creatorId}`);

    if (creatorId) {
        const creators = await sql`SELECT * FROM profiles WHERE id = ${creatorId}`;
        if (creators.length > 0) {
            console.log("Creator profile found:", creators[0]);
        } else {
            console.log("No profile found for creator ID.");

            // Check members
            console.log("Checking organization members...");
            const members = await sql`
                SELECT om.*, p.name, p.email, p.id as profile_id
                FROM organization_members om
                LEFT JOIN profiles p ON om.user_id = p.id
                WHERE om.org_id = ${org.id}
            `;
            console.log("Members:", members);

            // Check profile ID format
            console.log("Checking first 5 profiles to see ID format:");
            const profiles = await sql`SELECT id, email, name FROM profiles LIMIT 5`;
            console.log(profiles);
        }
    } else {
        console.log("created_by field is null or empty.");
    }
}

main().catch(console.error);
