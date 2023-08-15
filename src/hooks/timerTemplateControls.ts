import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { SimpleTimerTemplate } from "~/components/forms";

const initialTimerTemplateData = {
  name: "",
  description: "",
  projectId: "",
  organization: "",
};

export function useTimerTemplateControls(org: string) {
  const [isTimerTemplateModalOpen, setIsTimerTemplateModalOpen] =
    useState(false);
  const [timerTemplateDetails, setTimerTemplateDetails] =
    useState<SimpleTimerTemplate>(initialTimerTemplateData);
  const createTimerTemplate = api.timerTemplates.create.useMutation();
  const deleteTimerTemplate = api.timerTemplates.delete.useMutation();
  const updateTimerTemplate = api.timerTemplates.update.useMutation();
  const timerTemplates = api.timerTemplates.list.useQuery();

  useEffect(() => {
    if (!isTimerTemplateModalOpen)
      setTimerTemplateDetails({
        ...initialTimerTemplateData,
        organization: org,
      });
    else setTimerTemplateDetails((t) => ({ ...t, organization: org }));
  }, [isTimerTemplateModalOpen, setTimerTemplateDetails, org]);

  const handleTimerTemplateSubmit = useCallback(
    async (timerTemplate: SimpleTimerTemplate & { id?: string }) => {
      if (timerTemplate.name && timerTemplate.projectId) {
        if (timerTemplate.id)
          await updateTimerTemplate.mutateAsync({
            ...timerTemplate,
            id: timerTemplate.id,
            description: timerTemplate.description ?? "",
          });
        else
          await createTimerTemplate.mutateAsync({
            ...timerTemplate,
            description: timerTemplate.description ?? "",
          });
        void timerTemplates.refetch();
        setIsTimerTemplateModalOpen(false);
        setTimerTemplateDetails({
          ...initialTimerTemplateData,
          organization: org,
        });
      } else if (!timerTemplate.name) {
        console.log("missing name");
      } else if (!timerTemplate.projectId) {
        console.log("missing project");
      }
    },
    [
      timerTemplates,
      createTimerTemplate,
      updateTimerTemplate,
      setIsTimerTemplateModalOpen,
      setTimerTemplateDetails,
      org,
    ]
  );

  return {
    isTimerTemplateModalOpen,
    setIsTimerTemplateModalOpen,
    timerTemplateDetails,
    setTimerTemplateDetails,
    createTimerTemplate,
    deleteTimerTemplate,
    updateTimerTemplate,
    timerTemplates,
    handleTimerTemplateSubmit,
  };
}
