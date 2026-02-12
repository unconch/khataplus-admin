import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    const { sql } = await import("../src/lib/db");
    const orgId = '773b8ef1-a10b-4b67-84c4-7776d6983f74';

    console.log(`Deleting organization with ID: ${orgId}`);

    // First check if it exists
    const orgs = await sql`SELECT * FROM organizations WHERE id = ${orgId}`;
    if (orgs.length === 0) {
        console.log("Organization not found.");
        return;
    }
    console.log(`Found organization: ${orgs[0].name}`);

    // Delete it
    await sql`DELETE FROM organizations WHERE id = ${orgId}`;
    console.log("Organization deleted successfully.");
}

main().catch(console.error);
