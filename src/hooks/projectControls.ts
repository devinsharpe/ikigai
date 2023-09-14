import { useState } from "react";
import type { SimpleProject } from "~/components/forms";
import { api } from "~/utils/api";

export function useProjectControls(
  org: string,
  config: {
    id?: string;
    list: boolean;
  }
) {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState<SimpleProject>({
    name: "",
    description: "",
    organization: org ?? "",
  });
  const currentProject = api.projects.get.useQuery(
    {
      id: config.id ?? "",
    },
    {
      enabled: !!config.id,
    }
  );
  const projects = api.projects.list.useQuery(undefined, {
    enabled: config.list,
  });
  const createProject = api.projects.create.useMutation();
  const deleteProject = api.projects.delete.useMutation();

  return {
    isNewProjectOpen,
    setIsNewProjectOpen,
    newProjectDetails,
    setNewProjectDetails,
    currentProject,
    projects,
    createProject,
    deleteProject,
  };
}
