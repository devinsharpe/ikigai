import { useUser } from "@clerk/nextjs";
import { ListPlus, Loader2 } from "lucide-react";
import type { ProjectThemeOptions } from "~/server/db/schema/enums";
import type { SimpleOrganization, SimpleProject } from ".";
import ColorSelect from "./inputs/colorSelect";
import OrganizationSelect from "./inputs/organizationSelect";

interface ProjectFormProps {
  isLoading: boolean;
  project: SimpleProject & { id?: string };
  organizations: SimpleOrganization[];
  onChange: (data: SimpleProject) => void;
  onSubmit: (data: SimpleProject) => Promise<void>;
}

export const ProjectThemeColors: Record<
  ProjectThemeOptions,
  {
    light: {
      className: {
        bg: string;
        text: string;
      };
      hex: string;
    };
    dark: {
      className: {
        bg: string;
        text: string;
      };
      hex: string;
    };
  }
> = {
  Zinc: {
    light: {
      className: {
        bg: "bg-zinc-600",
        text: "text-zinc-600",
      },
      hex: "#52525b",
    },
    dark: {
      className: {
        bg: "bg-zinc-300",
        text: "text-zinc-300",
      },
      hex: "#d4d4d8",
    },
  },
  Red: {
    light: {
      className: {
        bg: "bg-red-600",
        text: "text-red-600",
      },
      hex: "#dc2626",
    },
    dark: {
      className: {
        bg: "bg-red-300",
        text: "text-red-300",
      },
      hex: "#fca5a5",
    },
  },
  Orange: {
    light: {
      className: {
        bg: "bg-orange-600",
        text: "text-orange-600",
      },
      hex: "#ea580c",
    },
    dark: {
      className: {
        bg: "bg-orange-300",
        text: "text-orange-300",
      },
      hex: "#fdba74",
    },
  },
  Amber: {
    light: {
      className: {
        bg: "bg-amber-600",
        text: "text-amber-600",
      },
      hex: "#d97706",
    },
    dark: {
      className: {
        bg: "bg-amber-300",
        text: "text-amber-300",
      },
      hex: "#fcd34d",
    },
  },
  Lime: {
    light: {
      className: {
        bg: "bg-lime-600",
        text: "text-lime-600",
      },
      hex: "#65a30d",
    },
    dark: {
      className: {
        bg: "bg-lime-300",
        text: "text-lime-300",
      },
      hex: "#bef264",
    },
  },
  Emerald: {
    light: {
      className: {
        bg: "bg-emerald-600",
        text: "text-emerald-600",
      },
      hex: "#059669",
    },
    dark: {
      className: {
        bg: "bg-emerald-300",
        text: "text-emerald-300",
      },
      hex: "#6ee7b7",
    },
  },
  Cyan: {
    light: {
      className: {
        bg: "bg-cyan-600",
        text: "text-cyan-600",
      },
      hex: "#0284c7",
    },
    dark: {
      className: {
        bg: "bg-cyan-300",
        text: "text-cyan-300",
      },
      hex: "#7dd3fc",
    },
  },
  Blue: {
    light: {
      className: {
        bg: "bg-blue-600",
        text: "text-blue-600",
      },
      hex: "#2563eb",
    },
    dark: {
      className: {
        bg: "bg-blue-300",
        text: "text-blue-300",
      },
      hex: "#93c5fd",
    },
  },
  Violet: {
    light: {
      className: {
        bg: "bg-violet-600",
        text: "text-violet-600",
      },
      hex: "#7c3aed",
    },
    dark: {
      className: {
        bg: "bg-violet-300",
        text: "text-violet-300",
      },
      hex: "#c4b5fd",
    },
  },
  Pink: {
    light: {
      className: {
        bg: "bg-pink-600",
        text: "text-pink-600",
      },
      hex: "#db2777",
    },
    dark: {
      className: {
        bg: "bg-pink-300",
        text: "text-pink-300",
      },
      hex: "#f9a8d4",
    },
  },
};

function ProjectForm({
  isLoading,
  project,
  organizations,
  onChange,
  onSubmit,
}: ProjectFormProps) {
  const { user } = useUser();
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
      <ColorSelect
        label="Theme Color"
        onChange={(val) => onChange({ ...project, themeColor: val })}
        value={project.themeColor}
      />
      {/* <Select
        isLoading={false}
        label="Theme Color"
        onChange={(val) =>
          onChange({ ...project, themeColor: val as ProjectThemeOptions })
        }
        value={project.themeColor}
        placeholder="Select a theme color"
        trigger={
          <div className="flex w-full items-center gap-2">
            <div
              className={cn(
                "rounded-full bg-opacity-50 p-1",
                ProjectThemeColors[project.themeColor]!.light.className.bg
              )}
            >
              <div
                className={cn(
                  "h-6 w-6 rounded-full bg-zinc-600",
                  project.themeColor
                    ? ProjectThemeColors[project.themeColor]!.light.className.bg
                    : ""
                )}
              />
            </div>
            <div>
              <p className="text-left">{project.themeColor}</p>
            </div>
          </div>
        }
      >
        <>
          {Object.keys(ProjectThemeColors).map((key) => (
            <SelectItem key={key} value={key}>
              <div className="flex w-full items-center gap-2">
                <div
                  className={cn(
                    "rounded-full bg-opacity-50 p-1",
                    ProjectThemeColors[key]!.light.className.bg
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full",
                      ProjectThemeColors[key]!.light.className.bg
                    )}
                  />
                </div>
                <div>
                  <p>{key}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </>
      </Select> */}
      {user && (
        <OrganizationSelect
          organizations={organizations}
          onChange={(val) =>
            onChange({
              ...project,
              organization: val,
            })
          }
          user={user}
          value={project.organization ?? ""}
        />
      )}
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
        <span>{project.id ? "Edit" : "Create"} Project</span>
      </button>
    </form>
  );
}

export default ProjectForm;
