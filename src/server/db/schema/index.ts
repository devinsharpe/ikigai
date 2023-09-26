import appSchema, { relationSchema } from "./app";
import enumSchema from "./enums";

const schema = {
  ...appSchema,
  ...relationSchema,
};

export default schema;

// App Schema
export const projects = schema.projects;
export const tasks = schema.tasks;
export const timers = schema.timers;
export const timerTemplates = schema.timerTemplates;
export const images = schema.images;

// Enums
export const projectThemeEnum = enumSchema.projectThemeEnum;
