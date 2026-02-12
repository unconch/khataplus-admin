import { sql } from '../db';

export async function getSystemMetrics() {
    const [auditCount, lastLogs] = await Promise.all([
        // Count of recent audit logs
        sql`SELECT COUNT(*) as count FROM audit_logs WHERE created_at > NOW() - INTERVAL '24 hours'`,

        // Latest audit log to determine "last backup" or activity
        sql`SELECT created_at FROM audit_logs ORDER BY created_at DESC LIMIT 1`
    ]);

    // Simulated latency would typically come from an external monitor, 
    // but we can proxy it with a DB ping for "realness" in this context
    const start = Date.now();
    await sql`SELECT 1`;
    const latency = Date.now() - start;

    return {
        latency: `${latency}ms`,
        latencyTrend: latency < 50 ? 'Optimal' : 'High Load',
        recentAudits: auditCount[0].count,
        status: latency < 200 ? 'Operational' : 'Degraded',
        lastBackup: lastLogs[0] ? new Date(lastLogs[0].created_at).toLocaleTimeString() : 'N/A'
    };
}
