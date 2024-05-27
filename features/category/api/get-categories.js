import { client } from "@/lib/hono"

export async function getCategories() {
   const response = await client.api.categories.$get()

   if (!response.ok) {
      throw new Error("Failed to fetch categories!")
   }

   const { data } = await response.json()
   return data
}