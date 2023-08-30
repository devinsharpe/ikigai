import type { Task } from "~/server/db/schema/app";
import TaskCollapsible, { type TaskCollapsibleProps } from "./taskCollapsible";

interface TaskPriorityCollapsibleProps {
  priority: number;
  tasks: (Task & {
    id: string;
    project: {
      id: string;
      name: string;
    };
  })[];
}

function TaskPriorityCollapsible({
  priority,
  tasks,
  ...props
}: TaskPriorityCollapsibleProps & Omit<TaskCollapsibleProps, "task">) {
  if (tasks.length)
    return (
      <>
        <div
          className="flex items-center gap-4 p-2 text-sm font-semibold"
          key="testing-priority-1"
        >
          <div className="h-[1px] w-10 bg-zinc-300" />
          <h5 className="shrink-0">Priority {priority}</h5>
          <div className="h-[1px] w-full bg-zinc-300" />
        </div>
        {tasks.map((task) => (
          <TaskCollapsible {...props} key={task.id} task={task} />
        ))}
      </>
    );
  else return <></>;
}

export default TaskPriorityCollapsible;
