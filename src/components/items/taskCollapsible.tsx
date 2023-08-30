import {
  Calendar,
  CalendarClock,
  Check,
  List,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "~/lib/cn";
import type { Task } from "~/server/db/schema/app";
import { CollapsibleItem } from "../collapsible";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuSeparater,
} from "../contextMenu";
import type { SimpleTask } from "../forms";
import Loader from "../loader";

export interface TaskCollapsibleProps {
  isLoading: boolean;
  onCheckedChange: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  task: Task & {
    id: string;
    project: {
      id: string;
      name: string;
    };
  };
  onEdit: (
    timer: SimpleTask & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
}

function normalizeDate(date: Date) {
  date.setDate(date.getDate() + 1);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function TaskCollapsible({
  isLoading,
  task,
  onCheckedChange,
  onDelete,
  onEdit,
}: TaskCollapsibleProps) {
  const datePreview = useMemo(() => {
    if (!task.completedAt && !task.dueDate) return "";
    const date = new Date(task.completedAt ?? task.dueDate!);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [task.dueDate, task.completedAt]);

  const isTaskLate = useMemo(() => {
    if (task.completedAt) return false;
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      return normalizeDate(date) < normalizeDate(new Date());
    }
    return false;
  }, [task.dueDate, task.completedAt]);

  return (
    <ContextMenu
      trigger={
        <CollapsibleItem className="gap-4">
          <>
            <Loader isLoading={isLoading} className="h-8 w-8">
              <input
                disabled={isLoading}
                type="checkbox"
                className="h-8 w-8 cursor-pointer rounded-full border-2 border-zinc-400 text-zinc-700"
                defaultChecked={!!task.completedAt}
                onChange={(e) => onCheckedChange(task.id, e.target.checked)}
              />
            </Loader>
            <div className="w-full">
              <h6
                className={cn(
                  "font-medium leading-none",
                  !!task.completedAt ? "line-through" : ""
                )}
              >
                {task.name}
              </h6>
              <div className="flex items-center justify-between text-sm">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isTaskLate ? "text-rose-600" : ""
                  )}
                >
                  <Calendar className="w-4" />
                  <span>{datePreview}</span>
                </div>
                <p className="text-zinc-600">{task.project.name}</p>
              </div>
            </div>
          </>
        </CollapsibleItem>
      }
    >
      <>
        {!task.completedAt && (
          <ContextMenuItem onClick={() => onCheckedChange(task.id, true)}>
            <>
              <Check className="absolute left-5 w-4" />
              <span>Complete Task</span>
            </>
          </ContextMenuItem>
        )}
        <ContextMenuItem>
          <>
            <List className="absolute left-5 w-4" />
            <span>View Project</span>
          </>
        </ContextMenuItem>
        <ContextMenuSeparater />
        <ContextMenuItem
          onClick={() =>
            onEdit({
              id: task.id,
              name: task.name,
              description: task.description,
              priority: task.priority,
              dueDate: task.dueDate,
              projectId: task.projectId,
              organization: task.organization,
              assignedTo: task.assignedTo,
              project: task.project,
            })
          }
        >
          <>
            <Pencil className="absolute left-5 w-4" />
            <span>Edit Details</span>
          </>
        </ContextMenuItem>
        <ContextMenuItem onClick={console.log}>
          <>
            <CalendarClock className="absolute left-5 w-4" />
            <span>Edit Schedule</span>
          </>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete(task.id)}>
          <>
            <Trash2 className="absolute left-5 w-4" />
            <span>Delete Task</span>
          </>
        </ContextMenuItem>
      </>
    </ContextMenu>
  );
}

export default TaskCollapsible;
