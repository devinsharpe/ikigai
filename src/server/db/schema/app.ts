import type { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  boolean,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { idConfig } from "../utils";
import { ProjectThemeOptions, projectThemeEnum } from "./enums";

export const projects = pgTable("projects", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  themeColor: projectThemeEnum("themeColor")
    .default(ProjectThemeOptions.Zinc)
    .notNull(),
  imageId: varchar("imageId").references((): AnyPgColumn => images.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  organization: varchar("organization"),
  isActive: boolean("isActive").default(true),
});
export const projectRelations = relations(projects, ({ one, many }) => ({
  headerImage: one(images, {
    fields: [projects.imageId],
    references: [images.id],
  }),
  tasks: many(tasks),
  timers: many(timers),
  timerTemplates: many(timerTemplates),
}));
export type Project = InferModel<typeof projects, "select">;
export type NewProject = InferModel<typeof projects, "insert">;

export const tasks = pgTable("tasks", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  priority: smallint("priority").notNull().default(0),
  dueDate: timestamp("dueDate", {
    withTimezone: true,
    mode: "string",
    precision: 6,
  }),
  completedAt: timestamp("completedAt", {
    withTimezone: true,
    mode: "string",
    precision: 6,
  }),
  completedBy: varchar("completedBy"),
  activeAt: timestamp("activeAt", {
    withTimezone: true,
    mode: "string",
    precision: 6,
  }).defaultNow(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  projectId: varchar("projectId", idConfig)
    .notNull()
    .references((): AnyPgColumn => projects.id),
  organization: varchar("organization"),
  assignedTo: varchar("assignedTo").notNull(),
  assignedBy: varchar("assignedBy").notNull(),
  assignedAt: timestamp("assignedAt", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
});
export const taskRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));
export type Task = InferModel<typeof tasks, "select">;
export type NewTask = InferModel<typeof tasks, "insert">;

export const timers = pgTable("timers", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  startedAt: timestamp("startedAt", {
    withTimezone: true,
    mode: "string",
    precision: 6,
  })
    .notNull()
    .defaultNow(),
  stoppedAt: timestamp("stoppedAt", {
    withTimezone: true,
    mode: "string",
    precision: 6,
  }),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  createdBy: varchar("createdBy").notNull(),
  projectId: varchar("projectId", idConfig)
    .notNull()
    .references((): AnyPgColumn => projects.id),
  templateId: varchar("templateId").references(
    (): AnyPgColumn => timerTemplates.id,
    {
      onDelete: "set null",
    }
  ),
  organization: varchar("organization"),
});
export const timerRelations = relations(timers, ({ one }) => ({
  project: one(projects, {
    fields: [timers.projectId],
    references: [projects.id],
  }),
  template: one(timerTemplates, {
    fields: [timers.templateId],
    references: [timerTemplates.id],
  }),
}));
export type Timer = InferModel<typeof timers, "select">;
export type NewTimer = InferModel<typeof timers, "insert">;

export const timerTemplates = pgTable("timerTemplates", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description"),
  createdBy: varchar("createdBy").notNull(),
  projectId: varchar("projectId", idConfig)
    .notNull()
    .references((): AnyPgColumn => projects.id, { onDelete: "cascade" }),
  organization: varchar("organization"),
});
export const timerTemplateRelations = relations(
  timerTemplates,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [timerTemplates.projectId],
      references: [projects.id],
    }),
    timers: many(timers),
  })
);
export type TimerTemplate = InferModel<typeof timerTemplates, "select">;
export type NewTimerTemplate = InferModel<typeof timerTemplates, "insert">;

export const images = pgTable("images", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").notNull(),
  userFullName: varchar("userFullName").notNull(),
  userUrl: varchar("userUrl").notNull(),
  description: varchar("description").notNull(),
  downloadUrl: varchar("downloadUrl").notNull(),
  htmlUrl: varchar("htmlUrl").notNull(),
});
export const imagesRelations = relations(images, ({ many }) => ({
  projects: many(projects),
}));
export type Image = InferModel<typeof images, "select">;
export type NewImage = InferModel<typeof images, "insert">;

const schema = {
  projects,
  tasks,
  timers,
  timerTemplates,
  images,
};
export const relationSchema = {
  projectRelations,
  taskRelations,
  timerRelations,
  timerTemplateRelations,
  imagesRelations,
};

export default schema;
