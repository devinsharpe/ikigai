// import { neonConfig } from "@neondatabase/serverless";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env.mjs";
import schema from "./schema";

// if (!process.env.VERCEL_ENV) {
//   neonConfig.wsProxy = (host) => `${host}:5433/v1`;
//   neonConfig.useSecureWebSocket = false;
//   neonConfig.pipelineTLS = false;
//   neonConfig.pipelineConnect = false;
// }

console.log("DB_URL: ", env.MIGRATE_URL);
const db = drizzle(neon(env.MIGRATE_URL), {
  schema,
});

export default db;

export type DbClient = typeof db;
