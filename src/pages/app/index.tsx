import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import type { OrganizationMembershipPublicUserData } from "@clerk/nextjs/dist/types/server";
import { LayoutDashboard, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Collapsible, {
  CollapsibleActionButton,
  CollapsibleItem,
} from "~/components/collapsible";
import type { SimpleProject } from "~/components/forms";
import ProjectForm from "~/components/forms/project";
import TaskForm from "~/components/forms/task";
import TimerForm from "~/components/forms/timer";
import TimerTemplateForm from "~/components/forms/timerTemplate";
import CurrentTimerDropdown from "~/components/items/currentTimerDropdown";
import TaskCollapsible from "~/components/items/taskCollapsible";
import TaskPriorityCollapsible from "~/components/items/taskPriorityCollapsible";
import TimerDayGroupCollapsibleItem from "~/components/items/timerDayGroupCollapsible";
import TimerTemplateCollapsibleItem from "~/components/items/timerTemplateCollapsible";
import Modal from "~/components/modal";
import {
  dataTypeReadableNames,
  useDeleteControls,
} from "~/hooks/deleteControls";
import { useTaskControls } from "~/hooks/taskControls";
import { useTimerControls } from "~/hooks/timerControls";
import { useTimerTemplateControls } from "~/hooks/timerTemplateControls";
import { formatDatetimeString } from "~/lib/date";
import { api } from "~/utils/api";
import Alert from "../../components/alert";

function AppHomePage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [isSavedTimersOpen, setIsSavedTimersOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [newProjectDetails, setNewProjectDetails] = useState<SimpleProject>({
    name: "",
    description: "",
    organization: "",
  });
  const currentOrganization = useOrganization({
    membershipList: {},
  });
  const { organizationList, setActive } = useOrganizationList();
  const { user } = useUser();
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
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskDetails,
    setTaskDetails,
    tasksCompleted,
    tasksToday,
    tasksUpcoming,
    taskTodayPriorityGroups,
    taskUpcomingPriorityGroups,
    createTask,
    updateTask,
    handleTaskComplete,
    handleTaskSubmit,
    handleDeleteTask,
  } = useTaskControls(
    currentOrganization.organization ? currentOrganization.organization.id : "",
    user ? user.id : ""
  );

  const {
    timers,
    timerDayGroups,
    isTimerModalOpen,
    setIsTimerModalOpen,
    timerDetails,
    setTimerDetails,
    createTimer,
    updateTimer,
    handleDeleteTimer,
    handleTimerSubmit,
    handleStopTimer,
  } = useTimerControls(
    currentOrganization.organization ? currentOrganization.organization.id : ""
  );

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
    void tasksCompleted.refetch();
    void tasksToday.refetch();
    void tasksUpcoming.refetch();
    void timers.refetch();
    void timerTemplates.refetch();
    const organization = currentOrganization.organization
      ? currentOrganization.organization.id
      : "";
    setNewProjectDetails((p) => ({
      ...p,
      organization,
    }));
    setTaskDetails((t) => ({
      ...t,
      assignedTo: user ? user.id : "",
      organization,
    }));
    setTimerDetails((t) => ({
      ...t,
      organization,
    }));
    setTimerTemplateDetails((t) => ({
      ...t,
      organization,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization.organization]);

  return (
    <>
      <form className="sticky top-16 z-[1] w-full bg-white/75 backdrop-blur-lg p-2">
        <div className="container mx-auto flex gap-2">
          <CurrentTimerDropdown
            onEdit={(t) => {
              if (setActive) void setActive({ organization: t.organization });
              setTimerDetails({
                ...t,
                startedAt: formatDatetimeString(new Date(t.startedAt)),
                stoppedAt: formatDatetimeString(new Date(t.stoppedAt ?? "")),
              });
              setIsTimerModalOpen(true);
            }}
            onStart={() => setIsTimerModalOpen(true)}
            onStop={(id) => void handleStopTimer(id)}
            onOrgChangeRequest={(org) => {
              if (setActive)
                void setActive({
                  organization: org,
                });
            }}
          />
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
            isLoading={tasksToday.isLoading}
            isQuietLoading={tasksToday.isRefetching}
            isOpen={isTasksOpen}
            onOpenChange={() => setIsTasksOpen(!isTasksOpen)}
            previewCount={4}
            elements={taskTodayPriorityGroups.map((tasks, index) => (
              <TaskPriorityCollapsible
                key={`tasks-priority-today-${index}`}
                onCheckedChange={(id, completed) =>
                  void handleTaskComplete(id, completed)
                }
                priority={index}
                tasks={tasks}
                isLoading={updateTask.isLoading}
                onEdit={(t) => {
                  setTaskDetails({
                    ...t,
                    dueDate: formatDatetimeString(new Date(t.dueDate ?? "")),
                  });
                  setIsTaskModalOpen(true);
                }}
                onDelete={(id) => {
                  setDataId(id);
                  setDataType("task");
                  setIsDeleteAlertOpen(true);
                }}
              />
            ))}
            actions={[
              <CollapsibleActionButton
                key="task-today-edit"
                title="Edit task"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">Edit Task</span>
                </>
              </CollapsibleActionButton>,
            ]}
            title="Today"
          />
          <Collapsible
            isLoading={timers.isLoading}
            isQuietLoading={timers.isRefetching}
            isOpen={isTimersOpen}
            onOpenChange={() => setIsTimersOpen(!isTimersOpen)}
            previewCount={1}
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
            elements={Object.keys(timerDayGroups).map((day) => (
              <TimerDayGroupCollapsibleItem
                key={`timer-day-group-${day}`}
                day={day}
                timers={timerDayGroups[day]!}
                onEdit={(t) => {
                  setTimerDetails({
                    ...t,
                    startedAt: formatDatetimeString(new Date(t.startedAt)),
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
              />
            ))}
            title="Time Entries"
          />
          <Collapsible
            isLoading={tasksUpcoming.isLoading}
            isQuietLoading={tasksUpcoming.isRefetching}
            isOpen={isTasksOpen}
            onOpenChange={() => setIsTasksOpen(!isTasksOpen)}
            previewCount={2}
            elements={taskUpcomingPriorityGroups.map((tasks, index) => (
              <TaskPriorityCollapsible
                key={`tasks-priority-upcoming-${index}`}
                onCheckedChange={(id, completed) =>
                  void handleTaskComplete(id, completed)
                }
                priority={index}
                tasks={tasks}
                isLoading={updateTask.isLoading}
                onEdit={(t) => {
                  setTaskDetails({
                    ...t,
                    dueDate: formatDatetimeString(new Date(t.dueDate ?? "")),
                  });
                  setIsTaskModalOpen(true);
                }}
                onDelete={(id) => {
                  setDataId(id);
                  setDataType("task");
                  setIsDeleteAlertOpen(true);
                }}
              />
            ))}
            actions={[
              <CollapsibleActionButton
                key="task-upcoming-edit"
                title="Edit task"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">Edit Task</span>
                </>
              </CollapsibleActionButton>,
            ]}
            title="Upcoming"
          />
          <Collapsible
            isLoading={tasksCompleted.isLoading}
            isQuietLoading={tasksCompleted.isRefetching}
            isOpen={isTasksOpen}
            onOpenChange={() => setIsTasksOpen(!isTasksOpen)}
            previewCount={2}
            elements={
              tasksCompleted.data
                ? tasksCompleted.data.map((task) => (
                    <TaskCollapsible
                      key={task.id}
                      onCheckedChange={(id, completed) =>
                        void handleTaskComplete(id, completed)
                      }
                      task={task}
                      isLoading={updateTask.isLoading}
                      onEdit={(t) => {
                        setTaskDetails({
                          ...t,
                          dueDate: formatDatetimeString(
                            new Date(t.dueDate ?? "")
                          ),
                        });
                        setIsTaskModalOpen(true);
                      }}
                      onDelete={(id) => {
                        setDataId(id);
                        setDataType("task");
                        setIsDeleteAlertOpen(true);
                      }}
                    />
                  ))
                : []
            }
            actions={[]}
            title="Recently Completed"
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
        isOpen={isTaskModalOpen}
        onOpenChange={() => setIsTaskModalOpen(!isTaskModalOpen)}
        title={taskDetails.id ? "Edit Task" : "New Task"}
        description="Auth feature? Specific errand? Langauge lessons?"
      >
        <TaskForm
          isLoading={createTask.isLoading || updateTask.isLoading}
          isLoadingProjects={projects.isLoading || projects.isRefetching}
          task={taskDetails}
          projects={projects.data ?? []}
          onChange={(t) => setTaskDetails({ ...taskDetails, ...t })}
          onOrgChange={async (org) => {
            if (setActive) await setActive({ organization: org });
          }}
          members={
            currentOrganization.membershipList
              ? currentOrganization.membershipList
                  .filter((member) => !!member.publicUserData.userId)
                  .map(
                    (member) =>
                      member.publicUserData as OrganizationMembershipPublicUserData
                  )
              : []
          }
          organizations={
            organizationList
              ? organizationList.map((org) => org.organization)
              : []
          }
          onSubmit={handleTaskSubmit}
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
            if (dataType === "task") void handleDeleteTask(dataId);
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
