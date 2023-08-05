import { Loader2, ListPlus } from "lucide-react";
import type { SimpleOrganization, SimpleProject } from ".";

interface ProjectFormProps {
  isLoading: boolean;
  project: SimpleProject;
  organizations: SimpleOrganization[];
  onChange: (data: SimpleProject) => void;
  onSubmit: (data: SimpleProject) => Promise<void>;
}

function ProjectForm({
  isLoading,
  project,
  organizations,
  onChange,
  onSubmit,
}: ProjectFormProps) {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(project);
      }}
    >
      <input
        className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Name your project"
        title="Project Name"
        onChange={(e) =>
          onChange({
            ...project,
            name: e.target.value,
          })
        }
        value={project.name}
      />
      <textarea
        className="h-32 w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Describe your project"
        title="Project Description"
        onChange={(e) =>
          onChange({
            ...project,
            description: e.target.value,
          })
        }
        value={project.description ?? ""}
      />
      <select
        title="Project Organization"
        className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        value={project.organization ?? ""}
        onChange={(e) =>
          onChange({
            ...project,
            organization: e.target.value,
          })
        }
      >
        <option value="">Personal Workspace</option>
        {organizations ? (
          organizations.map((org) => (
            <option value={org.id} key={org.id}>
              {org.name}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
      <button
        disabled={isLoading}
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 p-3 text-white hover:bg-zinc-900"
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-zinc-500" />
        ) : (
          <ListPlus />
        )}
        <span>Create Project</span>
      </button>
    </form>
  );
}

export default ProjectForm;
