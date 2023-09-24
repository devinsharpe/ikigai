import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import type { OrganizationMembershipPublicUserData } from "@clerk/nextjs/dist/types/server";
import {
  ChevronLeft,
  Cog,
  Download,
  ImageIcon,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Alert from "~/components/alert";
import CompletionGraph from "~/components/completionGraph";
import type { TaskViewOptions, TimerViewOptions } from "~/components/dashboard";
import Tasks from "~/components/dashboard/tasks";
import Templates from "~/components/dashboard/templates";
import Timers from "~/components/dashboard/timers";
import type { SimpleTask } from "~/components/forms";
import ProjectForm from "~/components/forms/project";
import TaskForm from "~/components/forms/task";
import TimerForm from "~/components/forms/timer";
import TimerTemplateForm from "~/components/forms/timerTemplate";
import Loader from "~/components/loader";
import Modal from "~/components/modal";
import SearchNav from "~/components/searchNav";
import {
  dataTypeReadableNames,
  useDeleteControls,
} from "~/hooks/deleteControls";
import { useProjectControls } from "~/hooks/projectControls";
import { useTaskControls } from "~/hooks/taskControls";
import { useTimerControls } from "~/hooks/timerControls";
import { useTimerTemplateControls } from "~/hooks/timerTemplateControls";
import { formatDatetimeString } from "~/lib/date";

function ProjectNotFoundPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-4 px-2 pb-6 pt-20">
      <h1 className="flex items-center gap-4 text-left text-3xl font-bold tracking-wide text-zinc-800">
        <Image
          src="/icons/icon.svg"
          alt="Ikigai logo"
          height="40"
          width="40"
          className="h-10 w-10"
        />
        <span>Project Not Found</span>
      </h1>
      <div className="flex flex-col items-center gap-2">
        <p className="text-zinc-600">
          We can&apos;t seem to find this project using your account. Please
          make sure you&apos;re...
        </p>
        <ol className="flex flex-col gap-2 text-zinc-600">
          <li>Logged into the correct account &</li>
          <li>Viewing the correct organization</li>
        </ol>
      </div>
      <Link
        href="/app"
        className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white animate-in fade-in duration-500 hover:bg-zinc-900"
      >
        <Smartphone />
        <span>Return to App</span>
      </Link>
      <p className="text-sm text-zinc-600">
        If you continue to face issues, please reach out to Ikigai support
      </p>
    </main>
  );
}

function ProjectPage() {
  const [taskCollapsibles, setTaskCollapsibles] = useState<
    Record<"today" | "upcoming" | "completed", boolean>
  >({
    today: true,
    upcoming: false,
    completed: false,
  });
  const [taskViews, setTaskViews] = useState<
    Record<"today" | "upcoming" | "completed", TaskViewOptions>
  >({
    today: "priority",
    upcoming: "priority",
    completed: "standard",
  });
  const [timerView, setTimerView] = useState<TimerViewOptions>("day");
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [isSavedTimersOpen, setIsSavedTimersOpen] = useState(false);

  const router = useRouter();
  const currentOrganization = useOrganization({
    membershipList: {},
  });
  const { organizationList, setActive } = useOrganizationList();
  const { user } = useUser();

  const {
    isProjectModalOpen,
    setIsProjectModalOpen,
    projectDetails,
    setProjectDetails,
    completedGraph,
    currentProject,
    projects,
    createProject,
    updateProject,
    handleProjectSubmit,
  } = useProjectControls(
    currentOrganization.organization ? currentOrganization.organization.id : "",
    {
      id: router.query.id ? (router.query.id as string) : "",
      list: true,
    }
  );

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
    createTask,
    updateTask,
    handleTaskComplete,
    handleTaskSubmit,
    handleDeleteTask,
  } = useTaskControls(
    currentOrganization.organization ? currentOrganization.organization.id : "",
    user ? user.id : "",
    router.query.id! as string
  );

  const taskHandlers = {
    onComplete: (id: string, completed: boolean) => {
      void handleTaskComplete(id, completed);
    },
    onDelete: (id: string) => {
      setDataId(id);
      setDataType("task");
      setIsDeleteAlertOpen(true);
    },
    onEdit: (
      task: SimpleTask & {
        id: string;
        project: {
          name: string;
        };
      }
    ) => {
      setTaskDetails({
        ...task,
        dueDate: formatDatetimeString(new Date(task.dueDate ?? "")),
      });
      setIsTaskModalOpen(true);
    },
  };

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
  } = useTimerControls(
    currentOrganization.organization ? currentOrganization.organization.id : "",
    router.query.id! as string
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
    currentOrganization.organization ? currentOrganization.organization.id : "",
    router.query.id! as string
  );

  useEffect(() => {
    if (currentProject.data)
      setProjectDetails({
        id: currentProject.data.id,
        name: currentProject.data.name,
        description: currentProject.data.description,
        themeColor: currentProject.data.themeColor,
        organization: currentProject.data.organization,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject.data]);

  useEffect(() => {
    void currentProject.refetch();
    void projects.refetch();
    void completedGraph.refetch();
    void tasksCompleted.refetch();
    void tasksToday.refetch();
    void tasksUpcoming.refetch();
    void timers.refetch();
    void timerTemplates.refetch();
    const organization = currentOrganization.organization
      ? currentOrganization.organization.id
      : "";
    setProjectDetails((p) => ({
      ...p,
      organization,
    }));
    setTaskDetails((t) => ({
      ...t,
      assignedTo: user ? user.id : "",
      organization,
      projectId: currentProject.data ? currentProject.data.id : "",
    }));
    setTimerDetails((t) => ({
      ...t,
      organization,
      projectId: currentProject.data ? currentProject.data.id : "",
    }));
    setTimerTemplateDetails((t) => ({
      ...t,
      organization,
      projectId: currentProject.data ? currentProject.data.id : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization.organization]);

  if (!currentProject.isLoading && !currentProject.data)
    return <ProjectNotFoundPage />;

  if (currentProject.data)
    return (
      <>
        <SearchNav
          currentTimerControls={{
            onEdit: (t) => {
              if (setActive) void setActive({ organization: t.organization });
              setTimerDetails({
                ...t,
                startedAt: formatDatetimeString(new Date(t.startedAt)),
                stoppedAt: formatDatetimeString(new Date(t.stoppedAt ?? "")),
              });
              setIsTimerModalOpen(true);
            },
            onStart: () => setIsTimerModalOpen(true),
            onStop: (id) => void handleStopTimer(id),
            onOrgChangeRequest: (org) => {
              if (setActive)
                void setActive({
                  organization: org,
                });
            },
          }}
        />
        <main className="container mx-auto flex min-h-screen flex-col gap-4 pb-6 pt-20">
          <div className="md:px-2">
            <div className="relative h-32 w-full overflow-hidden bg-zinc-200 md:h-48 md:rounded-lg">
              <Image
                alt="Project header image"
                height={1080}
                width={1920}
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              />
              <button
                type="button"
                className="absolute left-2 top-2 flex h-12 w-12 items-center justify-center rounded-lg bg-white/75 backdrop-blur-md transition-colors duration-150 hover:bg-white"
                onClick={() => router.back()}
              >
                <ChevronLeft />
              </button>
              <div className="absolute bottom-2 right-2 flex items-center">
                <span
                  className="flex h-8 items-center justify-center gap-2 rounded-l-md bg-white/75 px-2 backdrop-blur-md transition-colors duration-150 hover:bg-white"
                  onClick={() => router.back()}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="truncate text-sm">
                    Photo by Annie Spratt on Unsplash
                  </span>
                </span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-r-md bg-white/75 backdrop-blur-md transition-colors duration-150 hover:bg-white"
                  onClick={() => router.back()}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <section className="flex flex-col gap-4 px-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="overflow-ellipsis text-3xl font-bold tracking-wide md:text-6xl">
                {currentProject.data.name}
              </h2>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100"
                onClick={() => {
                  setIsProjectModalOpen(true);
                }}
              >
                <Cog />
                <span className="sr-only">Project Settings</span>
              </button>
            </div>
          </section>
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 1024: 2 }}>
            <Masonry gutter="1.5rem" className="px-2">
              <CompletionGraph
                completions={completedGraph.data ?? []}
                title="Task Completions"
              />
              <Templates
                areItemsLoading={createTimer.isLoading}
                collapsibleControls={[isSavedTimersOpen, setIsSavedTimersOpen]}
                modalControls={[
                  isTimerTemplateModalOpen,
                  setIsTimerTemplateModalOpen,
                ]}
                templates={timerTemplates}
                onDelete={(id) => {
                  setDataId(id);
                  setDataType("timerTemplate");
                  setIsDeleteAlertOpen(true);
                }}
                onEdit={(t) => {
                  setTimerTemplateDetails(t);
                  setIsTimerTemplateModalOpen(true);
                }}
                onStart={(timer) => {
                  void handleTimerSubmit({
                    ...timer,
                    startedAt: new Date().toISOString(),
                    stoppedAt: null,
                    organization: timerDetails.organization,
                  });
                }}
              />
              <Tasks
                areItemsLoading={updateTask.isLoading}
                collapsibleControls={[
                  taskCollapsibles.today,
                  (val) =>
                    setTaskCollapsibles({ ...taskCollapsibles, today: val }),
                ]}
                modalControls={[isTaskModalOpen, setIsTaskModalOpen]}
                tasks={tasksToday}
                title="Today"
                onComplete={taskHandlers.onComplete}
                onDelete={taskHandlers.onDelete}
                onEdit={taskHandlers.onEdit}
                prefix="tasks-today"
                viewControls={[
                  taskViews.today,
                  (val) => setTaskViews({ ...taskViews, today: val }),
                ]}
              />
              <Timers
                areItemsLoading={false}
                collapsibleControls={[isTimersOpen, setIsTimersOpen]}
                modalControls={[isTimerModalOpen, setIsTimerModalOpen]}
                timers={timers}
                title="Time Entries"
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
                prefix="timers"
                viewControls={[timerView, setTimerView]}
              />
              <Tasks
                areItemsLoading={updateTask.isLoading}
                collapsibleControls={[
                  taskCollapsibles.upcoming,
                  (val) =>
                    setTaskCollapsibles({ ...taskCollapsibles, upcoming: val }),
                ]}
                modalControls={[isTaskModalOpen, setIsTaskModalOpen]}
                tasks={tasksUpcoming}
                title="Upcoming"
                onComplete={taskHandlers.onComplete}
                onDelete={taskHandlers.onDelete}
                onEdit={taskHandlers.onEdit}
                prefix="tasks-upcoming"
                viewControls={[
                  taskViews.upcoming,
                  (val) => setTaskViews({ ...taskViews, upcoming: val }),
                ]}
              />
              <Tasks
                areItemsLoading={updateTask.isLoading}
                collapsibleControls={[
                  taskCollapsibles.completed,
                  (val) =>
                    setTaskCollapsibles({
                      ...taskCollapsibles,
                      completed: val,
                    }),
                ]}
                modalControls={[isTaskModalOpen, setIsTaskModalOpen]}
                tasks={tasksCompleted}
                title="Recently Completed"
                onComplete={taskHandlers.onComplete}
                onDelete={taskHandlers.onDelete}
                onEdit={taskHandlers.onEdit}
                prefix="tasks-completed"
                viewControls={[
                  taskViews.completed,
                  (val) => setTaskViews({ ...taskViews, completed: val }),
                ]}
              />
            </Masonry>
          </ResponsiveMasonry>
          <Modal
            isOpen={
              createProject.isLoading ||
              updateProject.isLoading ||
              isProjectModalOpen
            }
            onOpenChange={() => setIsProjectModalOpen(!isProjectModalOpen)}
            title={projectDetails.id ? "Edit Project" : "New Project"}
            description="Building a rocketship? Starting a new business? Renovating a home? Keeping up with your meds?"
          >
            <ProjectForm
              isLoading={createProject.isLoading || updateProject.isLoading}
              organizations={
                organizationList
                  ? organizationList.map((org) => org.organization)
                  : []
              }
              project={projectDetails}
              onChange={setProjectDetails}
              onSubmit={handleProjectSubmit}
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
            title={
              timerTemplateDetails.id ? "Edit Saved Timer" : "New Saved Timer"
            }
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
        </main>
      </>
    );
  else
    return (
      <main className="container mx-auto flex min-h-screen items-center justify-center gap-4 px-2 pb-6 pt-20">
        <Loader isLoading={true} />
      </main>
    );
}

export default ProjectPage;
