import type { ProjectThemeOptions } from "~/server/db/schema/enums";

export interface SimpleOrganization {
  id: string;
  imageUrl: string;
  membersCount: number;
  name: string;
  slug: string;
}

export interface SimpleUser {
  firstName: string | null;
  fullName: string | null;
  id: string;
  imageUrl: string;
  profileImageUrl: string;
}

export interface SimpleProject {
  name: string;
  description: string | null;
  themeColor: ProjectThemeOptions;
  organization: string | null;
}

export interface SimpleTask {
  name: string;
  description: string | null;
  priority: number;
  dueDate: string | null;
  projectId: string;
  organization: string | null;
  assignedTo: string;
}

export interface SimpleTimer {
  name: string;
  description: string | null;
  startedAt: string;
  stoppedAt: string | null;
  projectId: string;
  organization: string | null;
}

export interface SimpleTimerTemplate {
  name: string;
  description: string | null;
  projectId: string;
  organization: string | null;
}
