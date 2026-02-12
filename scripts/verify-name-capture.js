const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function verifyLogic() {
    const testEmail = 'himonchad@gmail.com';

    console.log(`--- VERIFYING NAME CAPTURE LOGIC FOR: ${testEmail} ---`);

    // 1. Check current state
    const users = await sql`SELECT id, name, email FROM profiles WHERE email = ${testEmail}`;
    if (users.length === 0) {
        console.log('Test user not found.');
        return;
    }

    const testUser = users[0];
    console.log(`Current Name: "${testUser.name}"`);

    // 2. Simulate API Update Logic
    const newName = "Himon Chad";
    console.log(`Simulating update to: "${newName}"`);

    // This mimics the logic in e:\ai stuff\KhataPlus\app\api\organizations\route.ts
    if (newName && newName.trim().length >= 2) {
        await sql`
            UPDATE profiles 
            SET name = ${newName.trim()}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ${testUser.id}
        `;
        console.log('Update successful.');
    }

    // 3. Verify Update
    const updatedUsers = await sql`SELECT name FROM profiles WHERE id = ${testUser.id}`;
    console.log(`Verified Name in DB: "${updatedUsers[0].name}"`);

    console.log('--- VERIFICATION COMPLETE ---');
}

verifyLogic().catch(console.error);
