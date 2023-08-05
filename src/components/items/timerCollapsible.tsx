import { Disc3, PauseCircle } from "lucide-react";
import { useState } from "react";
import { CollapsibleItem } from "../collapsible";
import { useInterval } from "~/hooks/interval";
import { cn } from "~/lib/cn";

interface TimerCollapsibleItemProps {
  onStop: (id: string) => Promise<void>;
  timer: {
    id: string;
    name: string;
    description: string | null;
    startedAt: string;
    stoppedAt: string | null;
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

function TimerCollapsibleItem({ onStop, timer }: TimerCollapsibleItemProps) {
  const [length, setLength] = useState(
    timer.stoppedAt
      ? Math.floor(+new Date(timer.stoppedAt) / 1000) -
          Math.floor(+new Date(timer.startedAt) / 1000)
      : -1
  );

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
      <div className="flex w-full items-center gap-4">
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
            "ml-auto px-3 py-1 text-sm",
            timer.stoppedAt ? "rounded-lg bg-zinc-200 " : "font-semibold"
          )}
        >
          {length !== -1 && formatLength(length)}
        </span>
      </div>
    </CollapsibleItem>
  );
}

export default TimerCollapsibleItem;
