import { pgEnum } from "drizzle-orm/pg-core";

export enum ProjectVisibility {
  Private = "PRIVATE",
  PublicView = "PUBLIC_VIEW",
  PublicEdit = "PUBLIC_EDIT",
}
export const ProjectVisibilityValues = [
  ...Object.values(ProjectVisibility),
] as unknown as [ProjectVisibility, ...ProjectVisibility[]];
export const projectVisibilityEnum = pgEnum(
  "projectVisibility",
  ProjectVisibilityValues
);

const schema = {
  projectVisibilityEnum,
};

export default schema;
