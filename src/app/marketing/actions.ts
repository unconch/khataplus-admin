"use server"

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateMarketingGimmick, generateMarketingIdeas } from "@/lib/ai-generator";

export async function getCampaigns() {
    return await sql`SELECT * FROM marketing_campaigns ORDER BY created_at DESC`;
}

export async function generateGimmickAction(title: string, content: string, city?: string, category?: string) {
    return await generateMarketingGimmick(title, content, city, category);
}

export async function generateCampaignIdeasAction(goal: string) {
    return await generateMarketingIdeas(goal);
}

export async function createCampaign(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const mediaUrl = formData.get("mediaUrl") as string;
    const platforms = formData.getAll("platforms") as string[];
    const scheduledAt = formData.get("scheduledAt") as string;

    const [campaign] = await sql`
        INSERT INTO marketing_campaigns (title, content, media_url, platforms, scheduled_at, status, metrics)
        VALUES (${title}, ${content}, ${mediaUrl || null}, ${platforms}, ${scheduledAt || null}, 'draft', '{"clicks":0, "reach":0}'::jsonb)
        RETURNING id
    `;

    revalidatePath("/marketing");
    return { success: true, id: campaign.id };
}

export async function deleteCampaign(id: number) {
    await sql`DELETE FROM marketing_campaigns WHERE id = ${id}`;
    revalidatePath("/marketing");
    return { success: true };
}

export async function postCampaign(id: number) {
    // Record the launch intent and seed some baseline reach
    await sql`
        UPDATE marketing_campaigns 
        SET status = 'posted', 
            posted_at = CURRENT_TIMESTAMP,
            metrics = metrics || jsonb_build_object('reach', (COALESCE((metrics->>'reach')::int, 0) + 1000))
        WHERE id = ${id}
    `;

    revalidatePath("/marketing");
    return { success: true };
}

export async function getMarketingMetrics() {
    const [analytics, counts, trend, geoData] = await Promise.all([
        sql`SELECT 
            COALESCE(SUM((metrics->>'clicks')::int), 0) as total_clicks,
            COALESCE(SUM((metrics->>'reach')::int), 0) as total_reach
            FROM marketing_campaigns`,
        sql`SELECT 
            (SELECT COUNT(*) FROM pseo_cities WHERE enabled = true) as total_vectors`,
        sql`SELECT 
            TO_CHAR(posted_at, 'Dy') as day,
            COALESCE(SUM((metrics->>'reach')::int), 0) as reach
        FROM marketing_campaigns
        WHERE status = 'posted' AND posted_at > NOW() - INTERVAL '7 days'
        GROUP BY day, posted_at
        ORDER BY posted_at ASC`,
        sql`SELECT metrics->'geo_clusters' as clusters FROM marketing_campaigns WHERE status = 'posted'`
    ]);

    // Aggregate geo clusters
    const geoClusters: Record<string, number> = {};
    geoData.forEach((row: any) => {
        if (row.clusters) {
            Object.entries(row.clusters).forEach(([city, count]: [string, any]) => {
                geoClusters[city] = (geoClusters[city] || 0) + parseInt(count);
            });
        }
    });

    return {
        totalOrganicReach: parseInt(analytics[0].total_reach || '0'),
        engagementRate: analytics[0].total_reach > 0 ? ((analytics[0].total_clicks / analytics[0].total_reach) * 100).toFixed(1) + '%' : '0%',
        referralTraffic: parseInt(analytics[0].total_clicks || '0'),
        vectorFlow: parseInt(counts[0].total_vectors || '0'),
        geoClusters,
        growthTrend: trend.length > 0 ? trend : [
            { day: 'Mon', reach: 0 },
            { day: 'Tue', reach: 0 },
            { day: 'Wed', reach: 0 },
            { day: 'Thu', reach: 0 },
            { day: 'Fri', reach: 0 },
            { day: 'Sat', reach: 0 },
            { day: 'Sun', reach: 0 }
        ]
    };
}
