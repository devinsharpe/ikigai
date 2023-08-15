import {
  List,
  Loader2,
  // Copy,
  // Disc3,
  // MoreHorizontal,
  PlayCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { CollapsibleItem } from "../collapsible";
// import { cn } from "~/lib/cn";
import type { SimpleTimerTemplate } from "../forms";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuSeparater,
} from "../contextMenu";

interface TimerTemplateCollapsibleItemProps {
  onDelete: (id: string) => void;
  onEdit: (
    timerTemplate: SimpleTimerTemplate & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
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
  onDelete,
  onEdit,
  isLoading,
  onTimerStart,
  timerTemplate,
}: TimerTemplateCollapsibleItemProps) {
  return (
    <ContextMenu
      trigger={
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
      }
    >
      <>
        <ContextMenuItem
          onClick={() =>
            void onTimerStart({
              name: timerTemplate.name,
              description: timerTemplate.description ?? "",
              projectId: timerTemplate.projectId,
            })
          }
        >
          <>
            <PlayCircle className="absolute left-5 w-4" />
            <span>Start Timer</span>
          </>
        </ContextMenuItem>
        <ContextMenuItem>
          <>
            <List className="absolute left-5 w-4" />
            <span>View Project</span>
          </>
        </ContextMenuItem>
        <ContextMenuSeparater />
        <ContextMenuItem onClick={() => onEdit(timerTemplate)}>
          <>
            <Pencil className="absolute left-5 w-4" />
            <span>Edit Template</span>
          </>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete(timerTemplate.id)}>
          <>
            <Trash2 className="absolute left-5 w-4" />
            <span>Delete Template</span>
          </>
        </ContextMenuItem>
      </>
    </ContextMenu>
  );
}

export default TimerTemplateCollapsibleItem;
