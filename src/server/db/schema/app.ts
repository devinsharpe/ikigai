import type { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { boolean, integer, pgTable, smallint, timestamp, varchar } from "drizzle-orm/pg-core";
import { idConfig } from "../utils";

export const projects = pgTable("projects", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  organization: varchar("organization").notNull(),
  isActive: boolean("isActive").default(true)
});
export type Project = InferModel<typeof projects, "select">;
export type NewProject = InferModel<typeof projects, "insert">;

export const tasks = pgTable("tasks", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  priority: smallint("priority").default(0),
  dueDate: timestamp("dueDate", { withTimezone: true, mode: "string" }),
  completedAt: timestamp("completedAt", { withTimezone: true, mode: "string" }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  projectId: varchar("projectId", idConfig).notNull().references((): AnyPgColumn => projects.id),
  organization: varchar("organization").notNull(),
  assignedTo: varchar("assignedTo").notNull(),
  assignedBy: varchar("assignedBy").notNull(),
  assignedAt: timestamp("assignedAt", { withTimezone: true, mode: "string" }).notNull(),
})
export const taskRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
  })
}))
export type Task = InferModel<typeof tasks, "select">
export type NewTask = InferModel<typeof tasks, "insert">

export const timers = pgTable("timers", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name"),
  description: varchar("description"),
  startedAt: timestamp("startedAt", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  stoppedAt: timestamp("stoppedAt", { withTimezone: true, mode: "string" }),
  length: integer("length").default(-1),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  projectId: varchar("projectId", idConfig).notNull().references((): AnyPgColumn => projects.id),
  organization: varchar("organization").notNull(),
})
export const timerRelations = relations(timers, ({ one }) => ({
  project: one(projects, {
    fields: [timers.projectId],
    references: [projects.id]
  })
}))
export type Timer = InferModel<typeof timers, "select">
export type NewTimer = InferModel<typeof timers, "insert">

const schema = {
  projects,
  tasks,
  timers,
};
export const relationSchema = {
  taskRelations,
  timerRelations
};

export default schema;
