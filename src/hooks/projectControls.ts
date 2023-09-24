import { useCallback, useState } from "react";
import type { SimpleProject } from "~/components/forms";
import { ProjectThemeOptions } from "~/server/db/schema/enums";
import { api } from "~/utils/api";

export function useProjectControls(
  org: string,
  config: {
    id?: string;
    list: boolean;
  }
) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState<
    SimpleProject & { id?: string }
  >({
    name: "",
    description: "",
    organization: org ?? "",
    themeColor: ProjectThemeOptions.Zinc,
  });
  const completedGraph = api.projects.listCompletionGraph.useQuery(
    {
      projectId: config.id ?? "",
    },
    {
      enabled: !!config.id,
    }
  );
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
  const updateProject = api.projects.update.useMutation();

  const handleProjectSubmit = useCallback(
    async (project: SimpleProject & { id?: string }) => {
      if (project.name) {
        if (project.id)
          await updateProject.mutateAsync({
            ...project,
            id: project.id,
          });
        else await createProject.mutateAsync(project);
        void projects.refetch();
        void currentProject.refetch();
        setIsProjectModalOpen(false);
        setProjectDetails({
          name: "",
          description: "",
          organization: org,
          themeColor: ProjectThemeOptions.Zinc,
        });
      } else console.log("missing name");
    },
    [createProject, org, projects, updateProject, currentProject]
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await deleteProject.mutateAsync({ id });
      void projects.refetch();
    },
    [deleteProject, projects]
  );

  return {
    isProjectModalOpen,
    setIsProjectModalOpen,
    projectDetails,
    setProjectDetails,
    completedGraph,
    currentProject,
    projects,
    createProject,
    deleteProject,
    updateProject,
    handleDeleteProject,
    handleProjectSubmit,
  };
}
