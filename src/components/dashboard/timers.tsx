import { useMemo } from "react";
import { splitTimersIntoDayGroups } from "~/hooks/timerControls";
import type { RouterOutputs } from "~/utils/api";
import type {
  DashboardCollapsibleProps,
  GenericQuery,
  TimerViewOptions,
  ViewControls,
} from ".";
import type { SimpleTimer } from "../forms";
import { Plus, ListTree, ListVideo } from "lucide-react";
import Collapsible, { CollapsibleActionButton } from "../collapsible";
import TimerDayGroupCollapsibleItem from "../items/timerDayGroupCollapsible";
import TimerCollapsibleItem from "../items/timerCollapsible";

interface TimersProps extends DashboardCollapsibleProps {
  timers: GenericQuery<RouterOutputs["timers"]["list"]>;
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
  viewControls: ViewControls<TimerViewOptions>;
}

function Timers({
  collapsibleControls,
  modalControls,
  timers,
  title,
  onDelete,
  onEdit,
  onStop,
  onTemplateSave,
  prefix,
  viewControls,
}: TimersProps) {
  const dayGroups = useMemo(() => {
    if (timers.data && viewControls[0] === "day")
      return splitTimersIntoDayGroups(timers.data);
    return {} as Record<
      string,
      (SimpleTimer & {
        id: string;
        project: {
          id: string;
          name: string;
        };
      })[]
    >;
  }, [timers.data, viewControls]);

  return (
    <Collapsible
      isLoading={timers.isLoading}
      isQuietLoading={timers.isRefetching}
      isOpen={collapsibleControls[0]}
      onOpenChange={() => collapsibleControls[1](!collapsibleControls[0])}
      previewCount={2}
      title={title}
      actions={[
        <CollapsibleActionButton
          key={`${prefix}-action-add`}
          title="Add time entry"
          onClick={() => modalControls[1](!modalControls[0])}
        >
          <>
            <Plus />
            <span className="sr-only">Add Time Entry</span>
          </>
        </CollapsibleActionButton>,
        <CollapsibleActionButton
          key={`${prefix}-action-view-toggle`}
          title="Toggle View"
          onClick={() =>
            viewControls[1](viewControls[0] === "day" ? "standard" : "day")
          }
        >
          <>
            {viewControls[0] === "day" ? <ListTree /> : <ListVideo />}
            <span className="sr-only">Toggle Task View</span>
          </>
        </CollapsibleActionButton>,
      ]}
      elements={
        viewControls[0] === "day"
          ? Object.keys(dayGroups).map((day) => (
              <TimerDayGroupCollapsibleItem
                key={`${prefix}-day-${day}`}
                day={day}
                timers={dayGroups[day]!}
                onDelete={onDelete}
                onEdit={onEdit}
                onStop={onStop}
                onTemplateSave={onTemplateSave}
              />
            ))
          : timers.data
          ? timers.data.map((timer) => (
              <TimerCollapsibleItem
                key={`${prefix}-${timer.id}`}
                timer={timer}
                onDelete={onDelete}
                onEdit={onEdit}
                onStop={onStop}
                onTemplateSave={onTemplateSave}
              />
            ))
          : []
      }
    />
  );
}

export default Timers;
