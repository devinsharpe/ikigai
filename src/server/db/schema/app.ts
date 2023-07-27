import { pgTable, varchar } from "drizzle-orm/pg-core";
import { idConfig } from "../utils";
import type { InferModel } from "drizzle-orm";

export const projects = pgTable("projects", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  createdBy: varchar("createdBy").notNull(),
  organization: varchar("organization").notNull(),
});
export type Project = InferModel<typeof projects, "select">;
export type NewProject = InferModel<typeof projects, "insert">;

const schema = {
  projects,
};

export const relations = {};

export default schema;
