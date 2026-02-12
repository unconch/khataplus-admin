'use server'

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addCity(formData: FormData) {
    const name = formData.get("name") as string
    const tier = formData.get("tier") as string || "2"

    if (!name) return;

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    try {
        await sql`
            INSERT INTO pseo_cities (name, slug, tier, enabled)
            VALUES (${name}, ${slug}, ${tier}, true)
        `
        revalidatePath("/pseo")
    } catch (e) {
        console.error("Failed to add city", e)
    }
}

export async function addCategory(formData: FormData) {
    const name = formData.get("name") as string

    if (!name) return;

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    try {
        await sql`
            INSERT INTO pseo_categories (name, slug, priority, enabled)
            VALUES (${name}, ${slug}, 0, true)
        `
        revalidatePath("/pseo")
    } catch (e) {
        console.error("Failed to add category", e)
    }
}

export async function toggleCity(id: number, currentState: boolean) {
    await sql`UPDATE pseo_cities SET enabled = ${!currentState} WHERE id = ${id}`
    revalidatePath("/pseo")
}

export async function toggleCategory(id: number, currentState: boolean) {
    await sql`UPDATE pseo_categories SET enabled = ${!currentState} WHERE id = ${id}`
    revalidatePath("/pseo")
}

export async function deleteCity(id: number) {
    await sql`DELETE FROM pseo_cities WHERE id = ${id}`
    revalidatePath("/pseo")
}

export async function deleteCategory(id: number) {
    await sql`DELETE FROM pseo_categories WHERE id = ${id}`
    revalidatePath("/pseo")
}
