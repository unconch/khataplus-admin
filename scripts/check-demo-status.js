const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DEMO_DATABASE_URL || process.env.DATABASE_URL);

async function checkDemoData() {
    const demoOrgId = 'demo-org';
    console.log(`--- CHECKING DEMO DATA FOR: ${demoOrgId} ---`);

    const org = await sql`SELECT * FROM organizations WHERE id = ${demoOrgId}`;
    console.log('Organization:', org.length > 0 ? 'Exists' : 'MISSING');

    const inventory = await sql`SELECT count(*) FROM inventory WHERE org_id = ${demoOrgId}`;
    console.log('Inventory Count:', inventory[0].count);

    const sales = await sql`SELECT count(*) FROM sales WHERE org_id = ${demoOrgId}`;
    console.log('Sales Count:', sales[0].count);

    const reports = await sql`SELECT count(*) FROM daily_reports WHERE org_id = ${demoOrgId}`;
    console.log('Reports Count:', reports[0].count);

    const customers = await sql`SELECT count(*) FROM customers WHERE org_id = ${demoOrgId}`;
    console.log('Customers Count:', customers[0].count);

    const khata = await sql`SELECT count(*) FROM khata_transactions WHERE org_id = ${demoOrgId}`;
    console.log('Khata Count:', khata[0].count);

    console.log('--- CHECK COMPLETE ---');
}

checkDemoData().catch(console.error);
