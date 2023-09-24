import { pgEnum } from "drizzle-orm/pg-core";

// export enum ProjectVisibility {
//   Private = "PRIVATE",
//   PublicView = "PUBLIC_VIEW",
//   PublicEdit = "PUBLIC_EDIT",
// }
// export const ProjectVisibilityValues = [
//   ...Object.values(ProjectVisibility),
// ] as unknown as [ProjectVisibility, ...ProjectVisibility[]];
// export const projectVisibilityEnum = pgEnum(
//   "projectVisibility",
//   ProjectVisibilityValues
// );

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
