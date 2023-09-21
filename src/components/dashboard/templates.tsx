import { Plus } from "lucide-react";
import type { RouterOutputs } from "~/utils/api";
import Collapsible, {
  CollapsibleActionButton,
  EmptyCollapsibleItem,
} from "../collapsible";
import type { SimpleTimerTemplate } from "../forms";
import TimerTemplateCollapsibleItem from "../items/timerTemplateCollapsible";

interface TemplatesProps {
  areItemsLoading: boolean;
  collapsibleControls: [boolean, (val: boolean) => void];
  modalControls: [boolean, (val: boolean) => void];
  templates: {
    isLoading: boolean;
    isRefetching: boolean;
    data?: RouterOutputs["timerTemplates"]["list"];
  };
  onDelete: (id: string) => void;
  onEdit: (
    timerTemplate: SimpleTimerTemplate & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
  onStart: (timer: {
    name: string;
    description: string;
    projectId: string;
  }) => void;
}

function Templates({
  areItemsLoading,
  collapsibleControls,
  modalControls,
  onEdit,
  onDelete,
  onStart,
  templates,
}: TemplatesProps) {
  return (
    <Collapsible
      className="grid grid-cols-1 md:grid-cols-2"
      isLoading={templates.isLoading}
      isQuietLoading={templates.isRefetching}
      isOpen={collapsibleControls[0]}
      onOpenChange={() => collapsibleControls[1](!collapsibleControls[0])}
      previewCount={4}
      actions={[
        <CollapsibleActionButton
          key="time-entry-template-edit"
          title="Edit time entry template"
          onClick={() => modalControls[1](!modalControls[0])}
        >
          <>
            <Plus />
            <span className="sr-only">Edit Time Entry Template</span>
          </>
        </CollapsibleActionButton>,
      ]}
      EmptyElement={() => (
        <EmptyCollapsibleItem className="justify-center md:col-span-2" />
      )}
      elements={
        templates.data
          ? templates.data.map((template) => (
              <TimerTemplateCollapsibleItem
                key={template.id}
                isLoading={areItemsLoading}
                onDelete={onDelete}
                onEdit={onEdit}
                onTimerStart={onStart}
                timerTemplate={template}
              />
            ))
          : []
      }
      title="Saved Timers"
    />
  );
}

export default Templates;
