import { useState, useEffect, useMemo, useCallback } from "react";
import type { SimpleTask } from "~/components/forms";
import { toTZISOString } from "~/lib/date";
import type { Task } from "~/server/db/schema/app";
import { api } from "~/utils/api";

const initialTaskData = {
  name: "",
  description: "",
  priority: 1,
  dueDate: "",
  projectId: "",
  organization: "",
  assignedTo: "",
};

function splitTasksIntoPriorityGroups(
  tasks: (Task & {
    project: {
      id: string;
      name: string;
    };
  })[]
) {
  const groups: (Task & {
    id: string;
    project: {
      id: string;
      name: string;
    };
  })[][] = [];
  tasks.forEach((task) => {
    if (groups[task.priority!]) groups[task.priority!]!.push(task);
    else {
      groups[task.priority!] = [task];
    }
  });
  return groups;
}

export function useTaskControls(org: string, userId: string) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<SimpleTask & { id?: string }>({
    ...initialTaskData,
    organization: org,
    assignedTo: userId,
  });
  const tasksCompleted = api.tasks.listCompleted.useQuery({
    timezoneOffset: new Date().getTimezoneOffset(),
  });
  const tasksToday = api.tasks.listToday.useQuery({
    timezoneOffset: new Date().getTimezoneOffset(),
  });
  const tasksUpcoming = api.tasks.listUpcoming.useQuery({
    timezoneOffset: new Date().getTimezoneOffset(),
  });
  const createTask = api.tasks.create.useMutation();
  const deleteTask = api.tasks.delete.useMutation();
  const updateTask = api.tasks.update.useMutation();

  useEffect(() => {
    if (!isTaskModalOpen)
      setTaskDetails({
        ...initialTaskData,
        organization: org,
        assignedTo: userId,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTaskModalOpen]);

  const taskTodayPriorityGroups = useMemo(() => {
    if (tasksToday.data) return splitTasksIntoPriorityGroups(tasksToday.data);
    else return [];
  }, [tasksToday]);

  const taskUpcomingPriorityGroups = useMemo(() => {
    if (tasksUpcoming.data)
      return splitTasksIntoPriorityGroups(tasksUpcoming.data);
    else return [];
  }, [tasksUpcoming]);

  const handleTaskComplete = useCallback(
    async (id: string, completed: boolean) => {
      await updateTask.mutateAsync({
        id,
        completedAt: completed ? new Date().toISOString() : null,
        completedBy: completed ? userId : null,
      });
      void tasksCompleted.refetch();
      void tasksToday.refetch();
      void tasksUpcoming.refetch();
      setIsTaskModalOpen(false);
      setTaskDetails({
        ...initialTaskData,
        organization: org,
        assignedTo: userId,
      });
    },

    [updateTask, org, userId, tasksCompleted, tasksToday, tasksUpcoming]
  );

  const handleTaskSubmit = useCallback(
    async (task: SimpleTask & { id?: string }) => {
      if (task.name && task.projectId) {
        if (task.id)
          await updateTask.mutateAsync({
            ...task,
            id: task.id,
            dueDate: task.dueDate
              ? toTZISOString(new Date(task.dueDate))
              : undefined,
          });
        else
          await createTask.mutateAsync({
            ...task,
            dueDate: task.dueDate
              ? toTZISOString(new Date(task.dueDate))
              : null,
          });
        void tasksCompleted.refetch();
        void tasksToday.refetch();
        void tasksUpcoming.refetch();
        setIsTaskModalOpen(false);
        setTaskDetails({
          ...initialTaskData,
          organization: org,
          assignedTo: userId,
        });
      } else if (!task.name) {
        console.log("missing name");
      } else if (!task.projectId) {
        console.log("missing project");
      }
    },
    [
      createTask,
      tasksToday,
      tasksUpcoming,
      tasksCompleted,
      org,
      userId,
      updateTask,
    ]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      await deleteTask.mutateAsync({ id });
      void tasksToday.refetch();
      void tasksUpcoming.refetch();
    },
    [tasksToday, tasksUpcoming, deleteTask]
  );

  return {
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskDetails,
    taskTodayPriorityGroups,
    taskUpcomingPriorityGroups,
    setTaskDetails,
    tasksCompleted,
    tasksToday,
    tasksUpcoming,
    createTask,
    deleteTask,
    updateTask,
    handleTaskComplete,
    handleTaskSubmit,
    handleDeleteTask,
  };
}
