import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import runMigrations from "./migrate";
import chalk from "chalk";
import type { Logger } from "drizzle-orm";
import { env } from "~/env.mjs";

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

const db = drizzle(sql, {
  logger: env.POSTGRES_LOGGING === "true" ? logger : false,
});

// void runMigrations(db);

export default db;

export type DbClient = typeof db;
  