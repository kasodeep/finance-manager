const { config } = require('dotenv');
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { migrate } = require('drizzle-orm/neon-http/migrator');

config({ path: '.env.local' });

const sql = neon(process.env.DRIZZLE_DATABASE_URL);
const db = drizzle(sql);

// this function is used to migrate the database.
const main = async () => {
   try {
      await migrate(db, { migrationsFolder: 'drizzle' });
   } catch (error) {
      console.error('Error during migration:', error);
      process.exit(1);
   }
};

main();