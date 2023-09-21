import { useEffect, useRef } from "react";
import { cn } from "~/lib/cn";
import type { RouterOutputs } from "~/utils/api";

interface CompletionGraphProps {
  title: string;
  completions: RouterOutputs["projects"]["listCompletionGraph"];
}

function CompletionGraph({ completions, title }: CompletionGraphProps) {
  const scrollableArea = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollableArea.current)
      scrollableArea.current.scrollLeft = scrollableArea.current.scrollWidth;
  }, [completions]);

  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-2xl font-bold tracking-wide text-zinc-800">
        {title}
      </h3>
      <section
        className="grid w-full shrink-0 grid-flow-col grid-rows-7 place-items-center gap-1 overflow-x-auto overflow-y-hidden pb-2"
        ref={scrollableArea}
      >
        <div />
        <div className="text-sm leading-none">Mon</div>
        <div />
        <div className="text-sm leading-none">Wed</div>
        <div />
        <div className="text-sm leading-none">Fri</div>
        <div />
        {completions.map(({ day, count }, index) => (
          <div
            key={`task-completion-${index}`}
            className={cn(
              "h-4 w-4 rounded",
              count === 0 ? "bg-zinc-100" : "",
              count > 0 ? "bg-amber-100/75" : "",
              count > 2 ? "bg-amber-200/75" : "",
              count > 4 ? "bg-amber-300/75" : "",
              count > 8 ? "bg-amber-400/75" : "",
              count > 12 ? "bg-amber-500/75" : "",
              count > 18 ? "bg-amber-600/75" : ""
            )}
            title={`${day}: ${count} task${count !== 1 ? "s" : ""} completed`}
          />
        ))}
      </section>
    </section>
  );
}

export default CompletionGraph;
