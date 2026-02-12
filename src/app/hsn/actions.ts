'use server'

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addHSN(formData: FormData): Promise<void> {
    const code = formData.get("hsn_code") as string
    const description = formData.get("description") as string
    const rate = parseFloat(formData.get("igst") as string)
    const chapter = formData.get("chapter") as string || "00"

    if (!code || !description) return;

    await sql`
        INSERT INTO hsn_master (hsn_code, description, gst_rate, chapter)
        VALUES (${code}, ${description}, ${rate}, ${chapter})
        ON CONFLICT (hsn_code) DO UPDATE SET
            description = EXCLUDED.description,
            gst_rate = EXCLUDED.gst_rate,
            chapter = EXCLUDED.chapter
    `
    revalidatePath("/hsn")
}

export async function deleteHSN(id: number) {
    await sql`DELETE FROM hsn_master WHERE id = ${id}`
    revalidatePath("/hsn")
}

export async function toggleHSNPopularity(id: number, currentPopularity: boolean) {
    await sql`UPDATE hsn_master SET is_popular = ${!currentPopularity} WHERE id = ${id}`
    revalidatePath("/hsn")
}
