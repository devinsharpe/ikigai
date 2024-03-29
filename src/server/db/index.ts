import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env.mjs";
import schema from "./schema";

const db = drizzle(neon(env.DB_URL), {
  schema,
});

export default db;

export type DbClient = typeof db;
