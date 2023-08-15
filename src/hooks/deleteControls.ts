import { useCallback, useState } from "react";

type dataType = "timer" | "timerTemplate" | "project";

export const dataTypeReadableNames: Record<dataType, string> = {
  timer: "Timer",
  timerTemplate: "Timer Template",
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
