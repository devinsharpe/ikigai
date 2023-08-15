import {
  Loader2,
  // Copy,
  // Disc3,
  // MoreHorizontal,
  PlayCircle,
  // Pencil,
  // Trash2,
} from "lucide-react";
import { CollapsibleItem } from "../collapsible";
// import { cn } from "~/lib/cn";
import type { SimpleTimerTemplate } from "../forms";

interface TimerTemplateCollapsibleItemProps {
  // onEdit: (
  //   timerTemplate: SimpleTimerTemplate & {
  //     id: string;
  //     project: {
  //       name: string;
  //     };
  //   }
  // ) => void;
  isLoading: boolean;
  onTimerStart: (timer: {
    name: string;
    description: string;
    projectId: string;
  }) => Promise<void>;
  timerTemplate: SimpleTimerTemplate & {
    id: string;
    project: {
      name: string;
    };
  };
}

function TimerTemplateCollapsibleItem({
  // onEdit,
  isLoading,
  onTimerStart,
  timerTemplate,
}: TimerTemplateCollapsibleItemProps) {
  return (
    <CollapsibleItem className="group">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-full flex-col">
          <h5 className="w-full truncate font-semibold leading-tight">
            {timerTemplate.name}
          </h5>
          <h6 className="text-sm leading-none text-zinc-600">
            {timerTemplate.project.name}
          </h6>
        </div>
        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-2 hover:bg-zinc-200"
          onClick={() =>
            void onTimerStart({
              name: timerTemplate.name,
              description: timerTemplate.description ?? "",
              projectId: timerTemplate.projectId,
            })
          }
        >
          {isLoading ? (
            <Loader2 className="animate-spin text-zinc-500" />
          ) : (
            <PlayCircle className="text-zinc-800" />
          )}
        </button>
      </div>
    </CollapsibleItem>
  );
}

export default TimerTemplateCollapsibleItem;
