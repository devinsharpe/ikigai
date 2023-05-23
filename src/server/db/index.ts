import { drizzle } from "drizzle-orm/neon-serverless";
// import { sql } from "@vercel/postgres";
import runMigrations from "./migrate";
import chalk from "chalk";
import type { Logger } from "drizzle-orm";
import { env } from "~/env.mjs";
import { neonConfig, Pool } from "@neondatabase/serverless";

const logger: Logger = {
  logQuery: function (query, params) {
    console.log(
      `${chalk.bgGreen("        Query             \n")}${query
        .replace(/\s+/g, " ")
        .trim()}`
    );
    if (params.length) {
      const formattedParams = params.map(
        (param, index) =>
          `${index.toString().padStart(3, " ")} | ${param as string}`
      );
      console.log(
        `${chalk.bgGray("        Params            \n")}${formattedParams.join(
          "\n"
        )}`
      );
    }
  },
};

if (!process.env.VERCEL_ENV) {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const db = drizzle(new Pool({ connectionString: env.POSTGRES_URL }), {
  logger: env.POSTGRES_LOGGING === "true" ? logger : false,
});

void runMigrations(db);

// void runMigrations(db);

export default db;

export type DbClient = typeof db;
