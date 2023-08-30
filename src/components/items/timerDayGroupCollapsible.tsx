import type { SimpleTimer } from "../forms";
import type { TimerCollapsibleItemProps } from "./timerCollapsible";
import TimerCollapsibleItem from "./timerCollapsible";

interface TimerDayGroupCollapsibleItemProps {
  day: string;
  timers: (SimpleTimer & {
    id: string;
    project: {
      name: string;
    };
  })[];
}

function TimerDayGroupCollapsibleItem({
  day,
  timers,
  ...props
}: TimerDayGroupCollapsibleItemProps &
  Omit<TimerCollapsibleItemProps, "timer">) {
  return (
    <>
      <div className="flex items-center gap-4 p-2 text-sm font-semibold">
        <div className="h-[1px] w-10 bg-zinc-300" />
        <h5 className="shrink-0">
          {new Date().toLocaleDateString() === day ? "Today" : day}
        </h5>
        <div className="h-[1px] w-full bg-zinc-300" />
      </div>
      {timers.map((timer) => (
        <TimerCollapsibleItem {...props} key={timer.id} timer={timer} />
      ))}
    </>
  );
}

export default TimerDayGroupCollapsibleItem;
