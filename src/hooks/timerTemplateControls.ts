import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { SimpleTimerTemplate } from "~/components/forms";

const initialTimerTemplateData = {
  name: "",
  description: "",
  projectId: "",
  organization: "",
};

export function useTimerTemplateControls(org: string, projectId?: string) {
  const [isTimerTemplateModalOpen, setIsTimerTemplateModalOpen] =
    useState(false);
  const [timerTemplateDetails, setTimerTemplateDetails] = useState<
    SimpleTimerTemplate & { id?: string }
  >({
    ...initialTimerTemplateData,
    organization: org,
    projectId: projectId ?? "",
  });
  const createTimerTemplate = api.timerTemplates.create.useMutation();
  const deleteTimerTemplate = api.timerTemplates.delete.useMutation();
  const updateTimerTemplate = api.timerTemplates.update.useMutation();
  const timerTemplates = api.timerTemplates.list.useQuery(
    projectId
      ? {
          projectId,
        }
      : undefined
  );
  useEffect(() => {
    if (!isTimerTemplateModalOpen)
      setTimerTemplateDetails({
        ...initialTimerTemplateData,
        organization: org,
        projectId: projectId ?? "",
      });
    else setTimerTemplateDetails((t) => ({ ...t, organization: org }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerTemplateModalOpen, projectId, org]);

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

  const handleDeleteTimerTemplate = useCallback(
    async (id: string) => {
      await deleteTimerTemplate.mutateAsync({ id });
      void timerTemplates.refetch();
    },
    [deleteTimerTemplate, timerTemplates]
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
    handleDeleteTimerTemplate,
    handleTimerTemplateSubmit,
  };
}
