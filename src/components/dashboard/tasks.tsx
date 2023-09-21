import Collapsible, { CollapsibleActionButton } from "../collapsible";
import type { RouterOutputs } from "~/utils/api";
import TaskPriorityCollapsible from "../items/taskPriorityCollapsible";
import { useMemo } from "react";
import type { SimpleTask } from "../forms";
import { splitTasksIntoPriorityGroups } from "~/hooks/taskControls";
import TaskCollapsible from "../items/taskCollapsible";
import { ListChecks, ListTree, Plus } from "lucide-react";
import type {
  DashboardCollapsibleProps,
  GenericQuery,
  TaskViewOptions,
  ViewControls,
} from ".";

interface TasksProps extends DashboardCollapsibleProps {
  tasks: GenericQuery<RouterOutputs["tasks"]["listToday"]>;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (
    task: SimpleTask & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
  viewControls: ViewControls<TaskViewOptions>;
}

function TodayTasks({
  areItemsLoading,
  collapsibleControls,
  modalControls,
  tasks,
  title,
  onComplete,
  onDelete,
  onEdit,
  prefix,
  viewControls,
}: TasksProps) {
  const priorityGroups = useMemo(() => {
    if (tasks.data && viewControls[0] === "priority")
      return splitTasksIntoPriorityGroups(tasks.data);
    else return [];
  }, [tasks.data, viewControls]);

  return (
    <Collapsible
      actions={[
        <CollapsibleActionButton
          key={`${prefix}-action-add`}
          title="Add task"
          onClick={() => modalControls[1](!modalControls[0])}
        >
          <>
            <Plus />
            <span className="sr-only">Add Task</span>
          </>
        </CollapsibleActionButton>,
        <CollapsibleActionButton
          key={`${prefix}-action-view-toggle`}
          title="Toggle View"
          onClick={() =>
            viewControls[1](
              viewControls[0] === "priority" ? "standard" : "priority"
            )
          }
        >
          <>
            {viewControls[0] === "priority" ? <ListTree /> : <ListChecks />}
            <span className="sr-only">Toggle Task View</span>
          </>
        </CollapsibleActionButton>,
      ]}
      isLoading={tasks.isLoading}
      isQuietLoading={tasks.isRefetching}
      isOpen={collapsibleControls[0]}
      onOpenChange={() => collapsibleControls[1](!collapsibleControls[0])}
      previewCount={4}
      title={title}
      elements={
        viewControls[0] === "priority"
          ? priorityGroups.map((tasks, index) => (
              <TaskPriorityCollapsible
                key={`${prefix}-group-${index}`}
                onCheckedChange={(id, completed) =>
                  void onComplete(id, completed)
                }
                priority={index}
                tasks={tasks}
                isLoading={areItemsLoading}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          : tasks.data
          ? tasks.data.map((task, index) => (
              <TaskCollapsible
                key={`${prefix}-${index}`}
                isLoading={areItemsLoading}
                task={task}
                onCheckedChange={(id, completed) =>
                  void onComplete(id, completed)
                }
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          : []
      }
    />
  );
}

export default TodayTasks;
