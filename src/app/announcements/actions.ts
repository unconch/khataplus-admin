'use server'

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addAnnouncement(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string || "info";

    if (!title || !content) return;

    await sql`
        INSERT INTO announcements (title, content, type, enabled)
        VALUES (${title}, ${content}, ${type}, true)
    `;
    revalidatePath("/announcements");
}

export async function toggleAnnouncement(id: number, currentState: boolean) {
    await sql`UPDATE announcements SET enabled = ${!currentState} WHERE id = ${id}`;
    revalidatePath("/announcements");
}

export async function deleteAnnouncement(id: number) {
    await sql`DELETE FROM announcements WHERE id = ${id}`;
    revalidatePath("/announcements");
}
