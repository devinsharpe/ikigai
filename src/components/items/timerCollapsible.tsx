import {
  Copy,
  Disc3,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CollapsibleItem } from "../collapsible";
import { useInterval } from "~/hooks/interval";
import { cn } from "~/lib/cn";
import Dropdown, { DropdownItem } from "../dropdown";
import type { SimpleTimer } from "../forms";

interface TimerCollapsibleItemProps {
  onDelete: (id: string) => void;
  onEdit: (
    timer: SimpleTimer & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
  onStop: (id: string) => Promise<void>;
  onTemplateSave: (templateDraft: {
    name: string;
    description: string;
    projectId: string;
  }) => void;
  timer: SimpleTimer & {
    id: string;
    project: {
      name: string;
    };
  };
}

function formatLength(len: number) {
  return `${Math.floor(len / 3600).toString()}:${Math.floor((len % 3600) / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(len % 60)
    .toString()
    .padStart(2, "0")}`;
}

function TimerCollapsibleItem({
  onDelete,
  onEdit,
  onStop,
  onTemplateSave,
  timer,
}: TimerCollapsibleItemProps) {
  const [length, setLength] = useState(-1);

  useEffect(() => {
    timer.stoppedAt
      ? Math.floor(+new Date(timer.stoppedAt) / 1000) -
        Math.floor(+new Date(timer.startedAt) / 1000)
      : -1;
    if (timer.stoppedAt)
      setLength(
        Math.floor(+new Date(timer.stoppedAt) / 1000) -
          Math.floor(+new Date(timer.startedAt) / 1000)
      );
    else setLength(-1);
  }, [timer.stoppedAt, timer.startedAt, setLength]);

  useInterval(
    () => {
      setLength(
        Math.floor(+new Date() / 1000) -
          Math.floor(+new Date(timer.startedAt) / 1000)
      );
    },
    timer.stoppedAt ? null : 1000
  );

  return (
    <CollapsibleItem className="group">
      <div className="flex w-full items-center gap-2">
        {!timer.stoppedAt && (
          <button
            type="button"
            className="flex items-center justify-center rounded-lg p-2 hover:bg-zinc-200"
            onClick={() => void onStop(timer.id)}
          >
            <Disc3 className="shrink-0 animate-spin text-zinc-600 group-hover:hidden" />
            <PauseCircle className="hidden text-zinc-800 group-hover:block" />
          </button>
        )}
        <div className="flex flex-col">
          <span className="font-semibold leading-tight">{timer.name}</span>
          <span className="text-sm leading-none text-zinc-600">
            {timer.project.name}
          </span>
        </div>
        <span
          className={cn(
            "ml-auto px-3 py-1",
            timer.stoppedAt ? "rounded-lg bg-zinc-200" : "font-semibold"
          )}
          key={`${timer.id}-${timer.stoppedAt ?? "current"}`}
        >
          {length !== -1 && formatLength(length)}
        </span>
        <Dropdown
          trigger={
            <button
              type="button"
              className="items-center justify-center rounded-lg px-2 py-1 hover:bg-zinc-200 group-hover:flex"
            >
              <MoreHorizontal className="text-zinc-600" />
            </button>
          }
        >
          <>
            <DropdownItem>
              <button type="button" onClick={() => void onEdit(timer)}>
                <Pencil className="h-5 w-5" />
                <span>Edit Details</span>
              </button>
            </DropdownItem>
            <DropdownItem>
              <button
                type="button"
                onClick={() =>
                  onTemplateSave({
                    name: timer.name,
                    description: timer.description ?? "",
                    projectId: timer.projectId,
                  })
                }
              >
                <Copy className="h-5 w-5" />
                <span>Save as Template</span>
              </button>
            </DropdownItem>
            <DropdownItem>
              <button type="button" onClick={() => onDelete(timer.id)}>
                <Trash2 className="h-5 w-5" />
                <span>Delete Entry</span>
              </button>
            </DropdownItem>
          </>
        </Dropdown>
      </div>
    </CollapsibleItem>
  );
}

export default TimerCollapsibleItem;
