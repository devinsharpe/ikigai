import type { OrganizationMembershipPublicUserData } from "@clerk/nextjs/dist/types/server";
import {
  Building,
  Calendar,
  CheckCheck,
  Flag,
  ListChecks,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/cn";
import type { SimpleOrganization, SimpleProject, SimpleTask } from ".";
import SelectDemo, { SelectItem } from "../select";
import { useMemo } from "react";

function SelectMemberValue({
  member,
}: {
  member?: OrganizationMembershipPublicUserData;
}) {
  if (member)
    return (
      <div className="flex w-full items-center gap-2">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={member.imageUrl}
            width={128}
            height={128}
            alt={`${member.firstName} ${member.lastName} profile image`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-left">
            {member.firstName} {member.lastName}
          </p>
          <p className="text-left text-xs text-zinc-600">{member.identifier}</p>
        </div>
      </div>
    );
  else
    return (
      <div className="flex w-full items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
          <span>N/A</span>
        </div>
        <div className="flex flex-col">
          <p className="text-left">Assign Member to task</p>
          <p className="text-left text-xs text-zinc-600">member@company.com</p>
        </div>
      </div>
    );
}

interface TaskFormProps {
  isLoading: boolean;
  isLoadingProjects?: boolean;
  task: SimpleTask & { id?: string };
  projects: (SimpleProject & { id: string })[];
  organizations: SimpleOrganization[];
  members: OrganizationMembershipPublicUserData[];
  onChange: (data: Partial<SimpleTask>) => void;
  onOrgChange: (org: string) => Promise<void>;
  onSubmit: (data: SimpleTask) => Promise<void>;
}

function TaskForm({
  isLoading,
  isLoadingProjects = false,
  task,
  projects,
  members,
  organizations,
  onChange,
  onOrgChange,
  onSubmit,
}: TaskFormProps) {
  const currentMember = useMemo(
    () => members.find((member) => member.userId === task.assignedTo),
    [members, task.assignedTo]
  );

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(task);
      }}
    >
      <input
        className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Name your task"
        title="Task Name"
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
        value={task.name}
      />
      <fieldset className="relative flex items-center">
        <Calendar className="absolute left-3 text-zinc-600" />
        <input
          className="w-full rounded-lg border border-zinc-300 p-3 pl-10 text-zinc-800"
          placeholder="Task Due Date"
          title="Task Due Date"
          type="datetime-local"
          defaultValue={task.dueDate ?? ""}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </fieldset>

      {task.organization && (
        <SelectDemo
          isLoading={false}
          label="Assigned Member"
          onChange={(val) => onChange({ assignedTo: val })}
          placeholder="Assign a member to this task"
          trigger={<SelectMemberValue member={currentMember} />}
          value={task.assignedTo ?? ""}
        >
          <>
            {members.map((member) => (
              <SelectItem key={member.userId} value={member.userId}>
                <div className="flex w-full items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={member.imageUrl}
                      width={128}
                      height={128}
                      alt={`${member.firstName} ${member.lastName} profile image`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p>
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-zinc-600">{member.identifier}</p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </>
        </SelectDemo>
      )}

      <textarea
        className="h-32 w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
        placeholder="Describe your task"
        title="Task Description"
        onChange={(e) =>
          onChange({
            description: e.target.value,
          })
        }
        value={task.description ?? ""}
      />
      <fieldset className="flex w-full items-center">
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center rounded-l-md border py-1 hover:bg-zinc-100",
            task.priority && task.priority >= 1
              ? "border-zinc-600 bg-zinc-600 text-white hover:bg-zinc-700"
              : ""
          )}
          onClick={() => onChange({ priority: 1 })}
        >
          <Flag className="w-5" />
        </button>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center border py-1 hover:bg-zinc-100",
            task.priority && task.priority >= 2
              ? "border-zinc-600 bg-zinc-600 text-white hover:bg-zinc-700"
              : ""
          )}
          onClick={() => onChange({ priority: 2 })}
        >
          <Flag className="w-5" />
        </button>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center border py-1 hover:bg-zinc-100",
            task.priority && task.priority >= 3
              ? "border-zinc-600 bg-zinc-600 text-white hover:bg-zinc-700"
              : ""
          )}
          onClick={() => onChange({ priority: 3 })}
        >
          <Flag className="w-5" />
        </button>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center rounded-r-md border py-1 hover:bg-zinc-100",
            task.priority && task.priority >= 4
              ? " border-zinc-600 bg-zinc-600 text-white hover:bg-zinc-700"
              : ""
          )}
          onClick={() => onChange({ priority: 4 })}
        >
          <Flag className="w-5" />
        </button>
      </fieldset>
      <fieldset className="relative flex items-center">
        {isLoadingProjects ? (
          <Loader2 className="absolute left-3 animate-spin text-zinc-500" />
        ) : (
          <ListChecks className="absolute left-3 text-zinc-500" />
        )}
        <select
          title="Task Project"
          className="w-full rounded-lg border border-zinc-300 p-3 pl-10 text-zinc-800"
          value={task.projectId}
          onChange={(e) =>
            onChange({
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
          title="Task Organization"
          className="w-full rounded-lg border border-zinc-300 p-3 pl-10 text-zinc-800"
          value={task.organization ?? ""}
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
          <CheckCheck />
        )}
        <span>{task.id ? "Edit" : "Create"} Task</span>
      </button>
    </form>
  );
}

export default TaskForm;
