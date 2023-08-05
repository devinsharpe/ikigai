import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Home, LayoutDashboard, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Collapsible, {
  CollapsibleActionButton,
  CollapsibleItem,
} from "~/components/collapsible";
import type { SimpleProject, SimpleTimer } from "~/components/forms";
import ProjectForm from "~/components/forms/project";
import TimerForm from "~/components/forms/timer";
import TimerCollapsibleItem from "~/components/items/timerCollapsible";
import Modal from "~/components/modal";
import { api } from "~/utils/api";

function toTZISOString(date: Date) {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num: number) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

function AppHomePage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTimerOpen, setIsNewTimerOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState<SimpleProject>({
    name: "",
    description: "",
    organization: "",
  });
  const [newTimerDetails, setNewTimerDetails] = useState<SimpleTimer>({
    name: "",
    description: "",
    organization: "",
    projectId: "",
    startedAt: "",
    stoppedAt: "",
  });
  const currentOrganization = useOrganization();
  const { organizationList, setActive } = useOrganizationList();
  const projects = api.projects.list.useQuery();
  const timers = api.timers.list.useQuery();
  const createProject = api.projects.create.useMutation();
  const createTimer = api.timers.create.useMutation();
  const stopTimer = api.timers.stop.useMutation();

  const handleNewProject = useCallback(
    async (project: SimpleProject) => {
      if (project.name) {
        if (setActive) await setActive({ organization: project.organization });
        await createProject.mutateAsync({
          name: project.name,
          description: project.description ?? "",
        });
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

  const handleNewTimer = useCallback(
    async (timer: SimpleTimer) => {
      if (timer.name && timer.projectId && timer.startedAt) {
        await createTimer.mutateAsync({
          ...timer,
          description: timer.description ?? "",
          startedAt: timer.startedAt
            ? toTZISOString(new Date(timer.startedAt))
            : undefined,
          stoppedAt: timer.stoppedAt
            ? toTZISOString(new Date(timer.stoppedAt))
            : undefined,
        });
        void timers.refetch();
        setIsNewTimerOpen(false);
        setNewTimerDetails({
          name: "",
          description: "",
          organization: "",
          projectId: "",
          startedAt: "",
          stoppedAt: "",
        });
      } else if (!timer.name) {
        console.log("missing name");
      } else if (!timer.projectId) {
        console.log("missing project");
      }
    },
    [timers, createTimer, setIsNewTimerOpen, setNewTimerDetails]
  );

  const handleStopTimer = useCallback(
    async (id: string) => {
      await stopTimer.mutateAsync({ id });
      void timers.refetch();
    },
    [timers, stopTimer]
  );

  useEffect(() => {
    void projects.refetch();
    void timers.refetch();
    setNewProjectDetails((p) => ({
      ...p,
      organization: currentOrganization.organization
        ? currentOrganization.organization.id
        : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization.organization]);

  useEffect(() => {
    const orgId = currentOrganization.organization
      ? currentOrganization.organization.id
      : "";
    if (setActive && orgId !== newTimerDetails.organization) {
      if (isNewTimerOpen)
        void setActive({ organization: newTimerDetails.organization });
      else setNewTimerDetails((t) => ({ ...t, organization: orgId }));
    }
  }, [
    isNewTimerOpen,
    setActive,
    currentOrganization.organization,
    newTimerDetails.organization,
  ]);

  return (
    <>
      <form className="sticky top-16 z-[1] w-full bg-white p-2">
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
      <main className="container mx-auto flex min-h-screen flex-col flex-col gap-4 px-2 pb-6 pt-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Collapsible
            isLoading={timers.isLoading}
            isQuietLoading={timers.isRefetching}
            isOpen={isTimersOpen}
            onOpenChange={() => setIsTimersOpen(!isTimersOpen)}
            previewCount={3}
            actions={[
              <CollapsibleActionButton
                key="time-entry-new"
                title="New Time Entry"
                onClick={() => setIsNewTimerOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">New Time Entry</span>
                </>
              </CollapsibleActionButton>,
            ]}
            elements={
              timers.data
                ? timers.data.map((timer) => (
                    <TimerCollapsibleItem
                      onStop={handleStopTimer}
                      timer={timer}
                      key={timer.id}
                    />
                  ))
                : []
            }
            title="Time Entries"
          />
          <Collapsible
            isLoading={projects.isLoading}
            isQuietLoading={projects.isRefetching}
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
      <Modal
        isOpen={isNewTimerOpen}
        onOpenChange={() => setIsNewTimerOpen(!isNewTimerOpen)}
        title="New Time Entry"
        description="Front end work? Back end work? Date night? Accounting affairs?"
      >
        <TimerForm
          isLoading={createTimer.isLoading}
          isLoadingProjects={projects.isLoading || projects.isRefetching}
          organizations={
            organizationList
              ? organizationList.map((org) => org.organization)
              : []
          }
          onChange={(t) => {
            console.log(t);
            setNewTimerDetails({ ...newTimerDetails, ...t });
          }}
          onSubmit={handleNewTimer}
          projects={projects.data ?? []}
          timer={newTimerDetails}
        />
      </Modal>
    </>
  );
}

export default AppHomePage;
