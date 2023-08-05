import {
  Building,
  Loader2,
  Clock,
  PlayCircle,
  PauseCircle,
  ListChecks,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { SimpleOrganization, SimpleTimer, SimpleProject } from ".";
import Toggle from "../toggle";

function formatDatetimeString(date: Date) {
  return date
    .toLocaleString("sv", { hourCycle: "h23" })
    .substring(0, 16)
    .replace(" ", "T");
}

interface TimerFormProps {
  isLoading: boolean;
  isLoadingProjects?: boolean;
  timer: SimpleTimer;
  projects: (SimpleProject & { id: string })[];
  organizations: SimpleOrganization[];
  onChange: (data: Partial<SimpleTimer>) => void;
  onSubmit: (data: SimpleTimer) => Promise<void>;
}

function TimerForm({
  isLoading,
  isLoadingProjects = false,
  timer,
  projects,
  organizations,
  onChange,
  onSubmit,
}: TimerFormProps) {
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isEndEnabled, setIsEndEnabled] = useState(false);

  useEffect(() => {
    console.log(formatDatetimeString(new Date()));
    onChange({
      startedAt: isStartEnabled ? formatDatetimeString(new Date()) : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartEnabled]);

  useEffect(() => {
    onChange({
      stoppedAt: isEndEnabled ? formatDatetimeString(new Date()) : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEndEnabled]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(timer);
      }}
    >
      <input
        className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Name your time entry"
        title="Time Entry Name"
        onChange={(e) =>
          onChange({
            ...timer,
            name: e.target.value,
          })
        }
        value={timer.name}
      />

      <fieldset className="flex items-center gap-2">
        <Toggle pressed={isStartEnabled} onPressedChange={setIsStartEnabled}>
          <PlayCircle className="h-7 w-7" />
        </Toggle>
        <input
          disabled={!isStartEnabled}
          className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
          placeholder="Time entry start"
          title="Time Entry Start"
          type="datetime-local"
          defaultValue={timer.startedAt}
          onChange={(e) => onChange({ startedAt: e.target.value })}
        />
      </fieldset>
      <fieldset className="flex items-center gap-2">
        <Toggle pressed={isEndEnabled} onPressedChange={setIsEndEnabled}>
          <PauseCircle className="h-7 w-7" />
        </Toggle>
        <input
          disabled={!isEndEnabled}
          className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
          placeholder="Time entry end"
          title="Time Entry End"
          type="datetime-local"
          defaultValue={timer.stoppedAt}
          onChange={(e) => onChange({ stoppedAt: e.target.value })}
        />
      </fieldset>
      <textarea
        className="h-32 w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Describe your time entry"
        title="Time Entry Description"
        onChange={(e) =>
          onChange({
            ...timer,
            description: e.target.value,
          })
        }
        value={timer.description ?? ""}
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
          value={timer.projectId}
          onChange={(e) =>
            onChange({
              ...timer,
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
          value={timer.organization ?? ""}
          onChange={(e) =>
            onChange({
              ...timer,
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
        <span>Create Time Entry</span>
      </button>
    </form>
  );
}

export default TimerForm;
