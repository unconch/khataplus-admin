import { sql } from '../db';

export async function getInfrastructureUsage() {
  const [dbSize, tableSizes, userStats] = await Promise.all([
    // Database size in MB
    sql`SELECT ROUND(pg_database_size(current_database()) / (1024.0 * 1024.0), 2) || ' MB' as size`,

    // Detailed table sizes in MB
    sql`
      SELECT 
        relname as table_name, 
        pg_total_relation_size(C.oid) as size_bytes,
        ROUND(pg_total_relation_size(C.oid) / (1024.0 * 1024.0), 3) || ' MB' as size_pretty
      FROM pg_class C 
      LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace) 
      WHERE nspname NOT IN ('pg_catalog', 'information_schema') 
        AND relkind='r' 
      ORDER BY pg_total_relation_size(C.oid) DESC
      LIMIT 10
    `,

    // Auth usage proxy (based on profiles table)
    sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(DISTINCT role) as unique_roles
      FROM profiles
    `
  ]);

  return {
    database: {
      totalSize: dbSize[0].size,
      tables: tableSizes,
    },
    authentication: {
      totalUsers: userStats[0].total_users,
      newUsers30d: userStats[0].new_users_30d,
      roles: userStats[0].unique_roles,
      provider: 'Descope'
    }
  };
}
