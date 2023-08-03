import { useCallback, useEffect } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Home, LayoutDashboard, Plus, Search } from "lucide-react";
import { useState } from "react";
import Collapsible, {
  CollapsibleActionButton,
  CollapsibleItem,
} from "~/components/collapsible";
import Modal from "~/components/modal";
import { api } from "~/utils/api";
import ProjectForm from "~/components/forms/project";

function AppHomePage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState({
    name: "",
    description: "",
    organization: "",
  });
  const currentOrganization = useOrganization();
  const { organizationList, setActive } = useOrganizationList();
  const projects = api.projects.list.useQuery();
  const createProject = api.projects.create.useMutation();

  const handleNewProject = useCallback(
    async (project: {
      name: string;
      description: string;
      organization: string;
    }) => {
      if (project.name) {
        if (setActive) await setActive({ organization: project.organization });
        const newProject = await createProject.mutateAsync({
          name: project.name,
          description: project.description,
        });
        console.log(newProject);
        void projects.refetch();
        setIsNewProjectOpen(false);
        setNewProjectDetails({
          name: "",
          description: "",
          organization: "",
        });
      } else {
        console.log("missing name");
      }
    },
    [
      projects,
      setActive,
      createProject,
      setIsNewProjectOpen,
      setNewProjectDetails,
    ]
  );

  useEffect(() => {
    void projects.refetch();
    setNewProjectDetails((n) => ({
      ...n,
      organization: currentOrganization.organization
        ? currentOrganization.organization.id
        : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization.organization]);

  return (
    <>
      <form className="sticky top-16 w-full bg-white p-2">
        <div className="container mx-auto flex gap-2">
          <button
            type="button"
            className="flex w-16 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
          >
            <Home />
          </button>
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-lg border border-zinc-300 bg-white p-3 pl-10 text-zinc-800"
              placeholder="Search Projects, Tasks, Notes, etc."
            />
            <span className="absolute bottom-0 left-2 top-0 flex h-full items-center justify-center pl-2">
              <Search className="h-4 w-4" />
            </span>
          </div>
          <button
            type="button"
            className="flex w-16 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
            onClick={console.log}
          >
            <LayoutDashboard />
            <span className="sr-only">Edit Dashboard</span>
          </button>
        </div>
      </form>
      <main className="container mx-auto flex min-h-screen flex-col flex-col gap-4 px-2 pt-20">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <Collapsible
            isLoading={projects.isLoading}
            isOpen={isProjectsOpen}
            onOpenChange={() => setIsProjectsOpen(!isProjectsOpen)}
            previewCount={3}
            actions={[
              <CollapsibleActionButton
                key="project-new"
                title="New Project"
                onClick={() => setIsNewProjectOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">New Project</span>
                </>
              </CollapsibleActionButton>,
            ]}
            elements={
              projects.data
                ? projects.data.map((project) => (
                    <CollapsibleItem key={project.id}>
                      <>
                        <span className="font-semibold">{project.name}</span>
                        <span className="ml-auto rounded-lg bg-zinc-200 px-3 py-1 text-sm">
                          7
                        </span>
                      </>
                    </CollapsibleItem>
                  ))
                : []
            }
            title="Projects"
          />
        </div>
      </main>
      <Modal
        isOpen={createProject.isLoading || isNewProjectOpen}
        onOpenChange={() => setIsNewProjectOpen(!isNewProjectOpen)}
        title="New Project"
        description="Building a rocketship? Starting a new business? Renovating a home? Keeping up with your meds?"
      >
        <ProjectForm
          isLoading={createProject.isLoading}
          organizations={
            organizationList
              ? organizationList.map((org) => org.organization)
              : []
          }
          project={newProjectDetails}
          onChange={setNewProjectDetails}
          onSubmit={handleNewProject}
        />
      </Modal>
    </>
  );
}

export default AppHomePage;
