import { Building, Loader2, Clock, ListChecks } from "lucide-react";
import type { SimpleOrganization, SimpleTimerTemplate, SimpleProject } from ".";

interface TimerTemplateFormProps {
  isLoading: boolean;
  isLoadingProjects?: boolean;
  timerTemplate: SimpleTimerTemplate & { id?: string };
  projects: (SimpleProject & { id: string })[];
  organizations: SimpleOrganization[];
  onChange: (data: Partial<SimpleTimerTemplate>) => void;
  onOrgChange: (org: string) => Promise<void>;
  onSubmit: (data: SimpleTimerTemplate) => Promise<void>;
}

function TimerTemplateForm({
  isLoading,
  isLoadingProjects = false,
  timerTemplate,
  projects,
  organizations,
  onChange,
  onOrgChange,
  onSubmit,
}: TimerTemplateFormProps) {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(timerTemplate);
      }}
    >
      <input
        className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Name your time entry template"
        title="Time Entry Template Name"
        onChange={(e) =>
          onChange({
            ...timerTemplate,
            name: e.target.value,
          })
        }
        value={timerTemplate.name}
      />

      <textarea
        className="h-32 w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Describe your time entry template"
        title="Time Entry Template Description"
        onChange={(e) =>
          onChange({
            ...timerTemplate,
            description: e.target.value,
          })
        }
        value={timerTemplate.description ?? ""}
      />
      <fieldset className="relative flex items-center">
        {isLoadingProjects ? (
          <Loader2 className="absolute left-3 animate-spin text-zinc-500" />
        ) : (
          <ListChecks className="absolute left-3 text-zinc-500" />
        )}
        <select
          title="Time Entry Project"
          className="w-full rounded-lg border border-zinc-300 p-3 pl-10 text-zinc-800"
          value={timerTemplate.projectId}
          onChange={(e) =>
            onChange({
              ...timerTemplate,
              projectId: e.target.value,
            })
          }
        >
          <option value="">No project selected</option>
          {projects.map((project) => (
            <option value={project.id} key={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="relative flex items-center">
        <Building className="absolute left-3 text-zinc-500" />
        <select
          title="Time Entry Organization"
          className="w-full rounded-lg border border-zinc-300 p-3 pl-10 text-zinc-800"
          value={timerTemplate.organization ?? ""}
          onChange={(e) => void onOrgChange(e.target.value)}
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
      </fieldset>
      <button
        disabled={isLoading}
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 p-3 text-white hover:bg-zinc-900"
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-zinc-500" />
        ) : (
          <Clock />
        )}
        <span>{timerTemplate.id ? "Edit" : "Create"} Saved Timer</span>
      </button>
    </form>
  );
}

export default TimerTemplateForm;
