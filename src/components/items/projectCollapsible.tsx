import type { SimpleProject } from "../forms";
import { CollapsibleItem } from "../collapsible";
import { useRouter } from "next/router";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuSeparator,
} from "../contextMenu";
import { List, Pencil, Trash2 } from "lucide-react";

export interface ProjectCollapsibleProps {
  onDelete: (id: string) => void;
  onEdit: (
    project: SimpleProject & {
      id: string;
    }
  ) => void;
  project: SimpleProject & { id: string };
  completedTaskCount: number;
  recentTimerCount: number;
}

function ProjectCollapsibleItem({
  onDelete,
  onEdit,
  project,
  completedTaskCount,
  recentTimerCount,
}: ProjectCollapsibleProps) {
  const router = useRouter();
  return (
    <ContextMenu
      trigger={
        <CollapsibleItem
          key={project.id}
          onClick={() =>
            !router.asPath.includes("/app/projects/") &&
            router.push(`/app/projects/${project.id}`)
          }
        >
          <div>
            <h5 className="font-semibold">{project.name}</h5>
            <h6 className="text-sm leading-none text-zinc-600">
              {completedTaskCount}
              &nbsp;Tasks /&nbsp;
              {recentTimerCount} Recent Timers
            </h6>
          </div>
        </CollapsibleItem>
      }
    >
      <>
        <ContextMenuItem
          disabled={router.asPath.includes("/app/projects/")}
          onClick={() =>
            !router.asPath.includes("/app/projects/") &&
            router.push(`/app/projects/${project.id}`)
          }
        >
          <>
            <List className="absolute left-5 w-4" />
            <span>View Details</span>
          </>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => void onEdit(project)}>
          <>
            <Pencil className="absolute left-5 w-4" />
            <span>Edit Details</span>
          </>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete(project.id)}>
          <>
            <Trash2 className="absolute left-5 w-4" />
            <span>Delete Entry</span>
          </>
        </ContextMenuItem>
      </>
    </ContextMenu>
  );
}

export default ProjectCollapsibleItem;
