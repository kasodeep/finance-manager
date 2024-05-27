import { client } from "@/lib/hono"

export async function getAccounts() {
   const response = await client.api.accounts.$get()

   if (!response.ok) {
      throw new Error("Failed to fetch accounts!")
   }

   const { data } = await response.json()
   return data
}