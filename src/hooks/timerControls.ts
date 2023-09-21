import { useCallback, useMemo, useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { SimpleTimer } from "~/components/forms";
import { toTZISOString } from "~/lib/date";

const initialTimerData = {
  name: "",
  description: "",
  organization: "",
  projectId: "",
  startedAt: "",
  stoppedAt: "",
};

export function splitTimersIntoDayGroups(
  timers: (SimpleTimer & {
    id: string;
    project: {
      id: string;
      name: string;
    };
  })[]
) {
  const groups: Record<
    string,
    (SimpleTimer & {
      id: string;
      project: {
        id: string;
        name: string;
      };
    })[]
  > = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  timers.forEach((timer) => {
    let date = new Date(timer.startedAt).toLocaleDateString();
    if (date === today.toLocaleDateString()) date = "Today";
    if (date === yesterday.toLocaleDateString()) date = "Yesterday";
    if (groups[date]) groups[date]!.push(timer);
    else groups[date] = [timer];
  });
  return groups;
}

export function useTimerControls(org: string, projectId?: string) {
  const utils = api.useContext();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerDetails, setTimerDetails] = useState<
    SimpleTimer & { id?: string }
  >({ ...initialTimerData, organization: org, projectId: projectId ?? "" });
  const timers = api.timers.list.useQuery(
    projectId ? { projectId } : undefined
  );
  const mutationProps = {
    onSuccess: () => utils.timers.current.invalidate(),
  };
  const createTimer = api.timers.create.useMutation(mutationProps);
  const updateTimer = api.timers.update.useMutation(mutationProps);
  const deleteTimer = api.timers.delete.useMutation(mutationProps);
  const stopTimer = api.timers.stop.useMutation(mutationProps);

  useEffect(() => {
    if (!isTimerModalOpen)
      setTimerDetails({ ...initialTimerData, organization: org });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerModalOpen]);

  const handleTimerSubmit = useCallback(
    async (timer: SimpleTimer & { id?: string }) => {
      if (timer.name && timer.projectId && timer.startedAt) {
        if (timer.id)
          await updateTimer.mutateAsync({
            ...timer,
            id: timer.id,
            description: timer.description ?? "",
            startedAt: timer.startedAt
              ? toTZISOString(new Date(timer.startedAt))
              : undefined,
            stoppedAt: timer.stoppedAt
              ? toTZISOString(new Date(timer.stoppedAt))
              : undefined,
          });
        else
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
        setIsTimerModalOpen(false);
        setTimerDetails(initialTimerData);
      } else if (!timer.name) {
        console.log("missing name");
      } else if (!timer.projectId) {
        console.log("missing project");
      }
    },
    [timers, createTimer, updateTimer, setIsTimerModalOpen, setTimerDetails]
  );

  const handleStopTimer = useCallback(
    async (id: string) => {
      await stopTimer.mutateAsync({ id });
      void timers.refetch();
    },
    [timers, stopTimer]
  );

  const handleDeleteTimer = useCallback(
    async (id: string) => {
      await deleteTimer.mutateAsync({ id });
      void timers.refetch();
    },
    [timers, deleteTimer]
  );

  const timerDayGroups = useMemo(() => {
    if (timers.data) return splitTimersIntoDayGroups(timers.data);
    return {};
  }, [timers]);

  const timerProjectGroupCount = useMemo(() => {
    const counts: Record<string, number> = {};
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - 7);
    if (timers.data) {
      timers.data
        .filter(
          (timer) =>
            toTZISOString(new Date(timer.stoppedAt!)) >
            toTZISOString(filterDate)
        )
        .forEach((timer) => {
          if (counts[timer.project.id]) counts[timer.project.id] += 1;
          else counts[timer.project.id] = 1;
        });
    }
    return counts;
  }, [timers]);

  return {
    isTimerModalOpen,
    setIsTimerModalOpen,
    timers,
    timerDayGroups,
    timerProjectGroupCount,
    timerDetails,
    setTimerDetails,
    createTimer,
    deleteTimer,
    updateTimer,
    stopTimer,
    handleDeleteTimer,
    handleTimerSubmit,
    handleStopTimer,
  };
}
