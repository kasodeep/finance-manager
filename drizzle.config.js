import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ".env.local" })

// this config is for the drizzle studio.
export default defineConfig({
   schema: "./db/schema.js",
   driver: "pg",
   dbCredentials: {
      connectionString: process.env.DRIZZLE_DATABASE_URL
   },
   verbose: true,
   strict: true
})