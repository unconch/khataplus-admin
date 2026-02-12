import { sql } from '../db';

export async function getAdminStats() {
    const start = Date.now();

    const [
        userCount,
        orgCount,
        salesSum,
        newUsers24h,
        newOrgs7d,
        activeOperators,
        recentGrowth
    ] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM profiles`,
        sql`SELECT COUNT(*) as count FROM organizations`,
        sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM sales`,
        sql`SELECT COUNT(*) as count FROM profiles WHERE created_at > NOW() - INTERVAL '24 hours'`,
        sql`SELECT COUNT(*) as count FROM organizations WHERE created_at > NOW() - INTERVAL '7 days'`,
        sql`SELECT COUNT(*) as count FROM profiles WHERE updated_at > NOW() - INTERVAL '15 minutes' AND role = 'admin'`,
        sql`SELECT COUNT(*) as count FROM sales WHERE created_at > NOW() - INTERVAL '30 days'`
    ]);

    const latency = Date.now() - start;

    return {
        users: {
            total: parseInt(userCount[0]?.count || '0'),
            trend: `+${newUsers24h[0]?.count || 0}`
        },
        organizations: {
            total: parseInt(orgCount[0]?.count || '0'),
            trend: `+${newOrgs7d[0]?.count || 0}`
        },
        sales: {
            total: parseFloat(salesSum[0]?.total || '0'),
            recentCount: parseInt(recentGrowth[0]?.count || '0'),
            trend: "Live"
        },
        system: {
            latency: `${latency}ms`,
            activeOperators: parseInt(activeOperators[0]?.count || '0').toString().padStart(2, '0')
        },
        pulse: {
            load: Math.min(Math.max(Math.floor(latency / 2), 10), 95),
            stability: 98 + (Math.random() > 0.5 ? 1 : -1) * 0.5,
            velocity: Math.floor((parseInt(newUsers24h[0]?.count || '0') / (parseInt(userCount[0]?.count || '1') + 1)) * 1000)
        }
    };
}

export async function getRecentUsers(limit = 10) {
    const users = await sql`
    SELECT * FROM profiles 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
    return users;
}

export async function getRecentOrgs(limit = 10) {
    const orgs = await sql`
    SELECT * FROM organizations 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
    return orgs;
}

export async function getRecentLogs(limit = 4) {
    const logs = await sql`
    SELECT 
      a.action, 
      a.created_at, 
      o.name as org_name
    FROM audit_logs a
    LEFT JOIN organizations o ON a.org_id = o.id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `;
    return logs;
}
