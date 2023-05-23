import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";

const runMigrations = async (db: VercelPgDatabase) => {
  await migrate(db, {
    migrationsFolder: "./src/server/db/migrations",
  });
};

export default runMigrations;
