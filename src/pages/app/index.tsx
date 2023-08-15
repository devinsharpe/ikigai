import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Home, LayoutDashboard, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Collapsible, {
  CollapsibleActionButton,
  CollapsibleItem,
} from "~/components/collapsible";
import type { SimpleProject } from "~/components/forms";
import ProjectForm from "~/components/forms/project";
import TimerForm from "~/components/forms/timer";
import TimerTemplateForm from "~/components/forms/timerTemplate";
import TimerCollapsibleItem from "~/components/items/timerCollapsible";
import TimerTemplateCollapsibleItem from "~/components/items/timerTemplateCollapsible";
import Modal from "~/components/modal";
import {
  dataTypeReadableNames,
  useDeleteControls,
} from "~/hooks/deleteControls";
import { useTimerControls } from "~/hooks/timerControls";
import { useTimerTemplateControls } from "~/hooks/timerTemplateControls";
import { formatDatetimeString } from "~/lib/date";
import { api } from "~/utils/api";
import Alert from "../../components/alert";
import ContextMenu from "~/components/contextMenu";

function AppHomePage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [isSavedTimersOpen, setIsSavedTimersOpen] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState<SimpleProject>({
    name: "",
    description: "",
    organization: "",
  });
  const currentOrganization = useOrganization();
  const { organizationList, setActive } = useOrganizationList();
  const projects = api.projects.list.useQuery();
  const createProject = api.projects.create.useMutation();

  const {
    dataId,
    setDataId,
    dataType,
    setDataType,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    resetDeleteControls,
  } = useDeleteControls();

  const {
    timers,
    isTimerModalOpen,
    setIsTimerModalOpen,
    timerDetails,
    setTimerDetails,
    createTimer,
    updateTimer,
    handleDeleteTimer,
    handleTimerSubmit,
    handleStopTimer,
  } = useTimerControls();

  const {
    timerTemplates,
    isTimerTemplateModalOpen,
    setIsTimerTemplateModalOpen,
    timerTemplateDetails,
    setTimerTemplateDetails,
    handleDeleteTimerTemplate,
    handleTimerTemplateSubmit,
    createTimerTemplate,
    updateTimerTemplate,
  } = useTimerTemplateControls(
    currentOrganization.organization ? currentOrganization.organization.id : ""
  );

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

  useEffect(() => {
    void projects.refetch();
    void timers.refetch();
    void timerTemplates.refetch();
    setNewProjectDetails((p) => ({
      ...p,
      organization: currentOrganization.organization
        ? currentOrganization.organization.id
        : "",
    }));
    setTimerDetails((t) => ({
      ...t,
      organization: currentOrganization.organization
        ? currentOrganization.organization.id
        : "",
    }));
    setTimerTemplateDetails((t) => ({
      ...t,
      organization: currentOrganization.organization
        ? currentOrganization.organization.id
        : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization.organization]);

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
            className="grid grid-cols-1 md:grid-cols-2"
            isLoading={timerTemplates.isLoading}
            isQuietLoading={timerTemplates.isRefetching}
            isOpen={isSavedTimersOpen}
            onOpenChange={setIsSavedTimersOpen}
            previewCount={4}
            actions={[
              <CollapsibleActionButton
                key="time-entry-template-edit"
                title="Edit time entry template"
                onClick={() => setIsTimerTemplateModalOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">Edit Time Entry Template</span>
                </>
              </CollapsibleActionButton>,
            ]}
            elements={
              timerTemplates.data
                ? timerTemplates.data.map((timerTemplate) => (
                    <TimerTemplateCollapsibleItem
                      key={timerTemplate.id}
                      isLoading={createTimer.isLoading}
                      onDelete={(id) => {
                        setDataId(id);
                        setDataType("timerTemplate");
                        setIsDeleteAlertOpen(true);
                      }}
                      onEdit={(t) => {
                        setTimerTemplateDetails(t);
                        setIsTimerTemplateModalOpen(true);
                      }}
                      onTimerStart={async (timer) =>
                        await handleTimerSubmit({
                          ...timer,
                          startedAt: new Date().toISOString(),
                          stoppedAt: null,
                          organization: timerDetails.organization,
                        })
                      }
                      timerTemplate={timerTemplate}
                    />
                  ))
                : []
            }
            title="Saved Timers"
          />
          <Collapsible
            isLoading={timers.isLoading}
            isQuietLoading={timers.isRefetching}
            isOpen={isTimersOpen}
            onOpenChange={() => setIsTimersOpen(!isTimersOpen)}
            previewCount={3}
            actions={[
              <CollapsibleActionButton
                key="time-entry-edit"
                title="Edit time entry"
                onClick={() => setIsTimerModalOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">Edit Time Entry</span>
                </>
              </CollapsibleActionButton>,
            ]}
            elements={
              timers.data
                ? timers.data.map((timer) => (
                    <TimerCollapsibleItem
                      onEdit={(t) => {
                        setTimerDetails({
                          ...t,
                          startedAt: formatDatetimeString(
                            new Date(t.startedAt)
                          ),
                          stoppedAt: formatDatetimeString(
                            new Date(t.stoppedAt ?? "")
                          ),
                        });
                        setIsTimerModalOpen(true);
                      }}
                      onDelete={(id) => {
                        setDataId(id);
                        setDataType("timer");
                        setIsDeleteAlertOpen(true);
                      }}
                      onStop={handleStopTimer}
                      onTemplateSave={(templateDraft) => {
                        setTimerTemplateDetails((t) => ({
                          ...t,
                          ...templateDraft,
                        }));
                        setIsTimerTemplateModalOpen(true);
                      }}
                      timer={timer}
                      key={timer.id}
                    />
                  ))
                : []
            }
            title="Time Entries"
          />
          <Collapsible
            className="grid grid-cols-1 md:grid-cols-2"
            isLoading={projects.isLoading}
            isQuietLoading={projects.isRefetching}
            isOpen={isProjectsOpen}
            onOpenChange={() => setIsProjectsOpen(!isProjectsOpen)}
            previewCount={4}
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
                      <div>
                        <h5 className="font-semibold">{project.name}</h5>
                        <h6 className="text-sm leading-none text-zinc-600">
                          7 Tasks / 3 Recent Timers
                        </h6>
                      </div>
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
        isOpen={isTimerModalOpen}
        onOpenChange={() => setIsTimerModalOpen(!isTimerModalOpen)}
        title={timerDetails.id ? "Edit Time Entry" : "New Time Entry"}
        description="Front end work? Back end work? Date night? Accounting affairs?"
      >
        <TimerForm
          isLoading={createTimer.isLoading || updateTimer.isLoading}
          isLoadingProjects={projects.isLoading || projects.isRefetching}
          organizations={
            organizationList
              ? organizationList.map((org) => org.organization)
              : []
          }
          onChange={(t) => setTimerDetails({ ...timerDetails, ...t })}
          onOrgChange={async (org) => {
            if (setActive) await setActive({ organization: org });
          }}
          onSubmit={handleTimerSubmit}
          projects={projects.data ?? []}
          timer={timerDetails}
        />
      </Modal>
      <Modal
        isOpen={isTimerTemplateModalOpen}
        onOpenChange={() =>
          setIsTimerTemplateModalOpen(!isTimerTemplateModalOpen)
        }
        title={timerTemplateDetails.id ? "Edit Saved Timer" : "New Saved Timer"}
        description="Personal project? Working out? New video game?"
      >
        <TimerTemplateForm
          isLoading={
            createTimerTemplate.isLoading || updateTimerTemplate.isLoading
          }
          isLoadingProjects={projects.isLoading || projects.isRefetching}
          organizations={
            organizationList
              ? organizationList.map((org) => org.organization)
              : []
          }
          onChange={(t) =>
            setTimerTemplateDetails({ ...timerTemplateDetails, ...t })
          }
          onOrgChange={async (org) => {
            if (setActive) await setActive({ organization: org });
          }}
          onSubmit={handleTimerTemplateSubmit}
          projects={projects.data ?? []}
          timerTemplate={timerTemplateDetails}
        />
      </Modal>
      <Alert
        title={`Delete ${dataType ? dataTypeReadableNames[dataType] : ""}?`}
        description="This action cannot be undone. This will permanently remove the data from our servers."
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        actionText="Yes, delete"
        cancelText="Cancel"
        onAction={() => {
          if (dataId) {
            if (dataType === "timer") void handleDeleteTimer(dataId);
            if (dataType === "timerTemplate")
              void handleDeleteTimerTemplate(dataId);
          }

          resetDeleteControls();
        }}
        onCancel={resetDeleteControls}
      />
    </>
  );
}

export default AppHomePage;
