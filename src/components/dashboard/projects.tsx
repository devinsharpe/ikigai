import { Plus } from "lucide-react";
import Collapsible, {
  CollapsibleActionButton,
  EmptyCollapsibleItem,
  CollapsibleItem,
} from "../collapsible";
import type { RouterOutputs } from "~/utils/api";

interface ProjectsProps {
  collapsibleControls: [boolean, (val: boolean) => void];
  modalControls: [boolean, (val: boolean) => void];
  projects: {
    isLoading: boolean;
    isRefetching: boolean;
    data?: RouterOutputs["projects"]["list"];
  };
  taskCounts: Record<string, number>;
  title: string;
  prefix: string;
}

function Projects({
  collapsibleControls,
  modalControls,
  projects,
  taskCounts,
  title,
  prefix,
}: ProjectsProps) {
  return (
    <Collapsible
      className="grid grid-cols-1 md:grid-cols-2"
      isLoading={projects.isLoading}
      isQuietLoading={projects.isRefetching}
      isOpen={collapsibleControls[0]}
      onOpenChange={() => collapsibleControls[1](!collapsibleControls[0])}
      previewCount={4}
      title={title}
      actions={[
        <CollapsibleActionButton
          key={`${prefix}-action-add`}
          title="Add Project"
          onClick={() => modalControls[1](!modalControls[0])}
        >
          <>
            <Plus />
            <span className="sr-only">Add Project</span>
          </>
        </CollapsibleActionButton>,
      ]}
      EmptyElement={() => (
        <EmptyCollapsibleItem className="justify-center md:col-span-2" />
      )}
      elements={
        projects.data
          ? projects.data.map((project) => (
              <CollapsibleItem key={`${prefix}-${project.id}`}>
                <div>
                  <h5 className="font-semibold">{project.name}</h5>
                  <h6 className="text-sm leading-none text-zinc-600">
                    {taskCounts[project.id] ?? 0}
                    &nbsp;Tasks / {taskCounts[project.id] ?? 0} Recent Timers
                  </h6>
                </div>
              </CollapsibleItem>
            ))
          : []
      }
    />
  );
}

export default Projects;
