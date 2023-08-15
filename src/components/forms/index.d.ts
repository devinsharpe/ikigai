export interface SimpleOrganization {
  id: string;
  name: string;
}

export interface SimpleProject {
  name: string;
  description: string | null;
  organization: string | null;
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
