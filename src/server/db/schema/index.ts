import appSchema from "./app";
import enumSchema from "./enums";

const schema = {
  ...appSchema,
};

export default schema;

// App Schema
export const projects = schema.projects;

// Enums
export const projectVisibilityEnum = enumSchema.projectVisibilityEnum;
