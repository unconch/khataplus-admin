'use server';

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function checkSystemHealth() {
    try {
        // 1. Check for orphaned organizations (created_by ID not in profiles)
        // AND no members in organization_members
        const orphanedOrgs = await sql`
            SELECT o.id, o.name, o.created_by 
            FROM organizations o
            LEFT JOIN profiles p ON o.created_by = p.id
            LEFT JOIN organization_members om ON o.id = om.org_id
            WHERE p.id IS NULL 
            AND om.id IS NULL
        `;

        // 2. Check for users without any organization affiliation
        const orphanedUsers = await sql`
            SELECT p.id, p.email, p.name
            FROM profiles p
            LEFT JOIN organization_members om ON p.id = om.user_id
            WHERE om.id IS NULL
            AND p.role != 'main admin' --Exclude main admins from check
        `;

        // 3. Check for active inventory with 0 stock
        // This is just a warning, not necessarily an error
        const zeroStockItems = await sql`
            SELECT count(*) as count FROM inventory 
            WHERE stock <= 0
        `;

        return {
            orphanedOrgs: orphanedOrgs.length,
            orphanedUsers: orphanedUsers.length,
            zeroStockItems: Number(zeroStockItems[0].count),
            status: 'success'
        };
    } catch (error) {
        console.error('Health check failed:', error);
        return { status: 'error', message: 'Failed to run health checks' };
    }
}

export async function cleanupOrphanedOrgs() {
    try {
        await sql`
            DELETE FROM organizations 
            WHERE id IN (
                SELECT o.id 
                FROM organizations o
                LEFT JOIN profiles p ON o.created_by = p.id
                LEFT JOIN organization_members om ON o.id = om.org_id
                WHERE p.id IS NULL 
                AND om.id IS NULL
            )
        `;
        revalidatePath('/system');
        return { success: true, message: 'Orphaned organizations deleted' };
    } catch (error) {
        console.error('Cleanup failed:', error);
        return { success: false, message: 'Failed to delete orphaned organizations' };
    }
}

export async function cleanupOrphanedUsers() {
    try {
        await sql`
            DELETE FROM profiles 
            WHERE id IN (
                SELECT p.id
                FROM profiles p
                LEFT JOIN organization_members om ON p.id = om.user_id
                WHERE om.id IS NULL
                AND p.role != 'main admin'
            )
        `;
        revalidatePath('/system');
        return { success: true, message: 'Orphaned users deleted' };
    } catch (error) {
        console.error('Cleanup failed:', error);
        return { success: false, message: 'Failed to delete orphaned users' };
    }
}
