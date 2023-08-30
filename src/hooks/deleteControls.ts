import { useCallback, useState } from "react";

type dataType = "task" | "timer" | "timerTemplate" | "project";

export const dataTypeReadableNames: Record<dataType, string> = {
  task: "Task",
  timer: "Timer",
  timerTemplate: "Saved Timer",
  project: "Project",
};

export function useDeleteControls() {
  const [dataType, setDataType] = useState<dataType | null>(null);
  const [dataId, setDataId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const resetDeleteControls = useCallback(() => {
    setDataType(null);
    setDataId(null);
    setIsDeleteAlertOpen(false);
  }, []);

  return {
    dataType,
    setDataType,
    dataId,
    setDataId,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    resetDeleteControls,
  };
}
