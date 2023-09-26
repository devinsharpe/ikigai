import { pgEnum } from "drizzle-orm/pg-core";

export enum ProjectThemeOptions {
  Zinc = "Zinc",
  Red = "Red",
  Orange = "Orange",
  Amber = "Amber",
  Lime = "Lime",
  Emerald = "Emerald",
  Cyan = "Cyan",
  Blue = "Blue",
  Violet = "Violet",
  Pink = "Pink",
}

export const ProjectThemeValues = [
  ...Object.values(ProjectThemeOptions),
] as unknown as [ProjectThemeOptions, ...ProjectThemeOptions[]];
export const projectThemeEnum = pgEnum("projectThemeColor", ProjectThemeValues);

const schema = {
  projectThemeEnum,
};

export default schema;
