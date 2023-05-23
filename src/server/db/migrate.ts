import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";

const runMigrations = async (db: NeonDatabase) => {
  await migrate(db, {
    migrationsFolder: "./src/server/db/migrations",
  });
};

export default runMigrations;
