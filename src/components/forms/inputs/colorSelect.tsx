import Select, { SelectItem } from "~/components/select";
import { cn } from "~/lib/cn";
import { ProjectThemeColors } from "../project";
import type { ProjectThemeOptions } from "~/server/db/schema/enums";

function ColorPreview({ theme }: { theme: ProjectThemeOptions }) {
  return (
    <div
      className={cn(
        "rounded-full bg-opacity-50 p-1",
        ProjectThemeColors[theme]!.light.className.bg
      )}
    >
      <div
        className={cn(
          "h-6 w-6 rounded-full bg-zinc-600",
          ProjectThemeColors[theme]!.light.className.bg
        )}
      />
    </div>
  );
}

function AnyColorPreview() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full">
      <div className="absolute inset-0 h-4 w-4 bg-zinc-600" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[36deg] bg-red-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[72deg] bg-orange-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[108deg] bg-amber-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[144deg] bg-lime-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[180deg] bg-emerald-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[216deg] bg-cyan-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[252deg] bg-blue-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[288deg] bg-violet-500" />
      <div className="absolute inset-0 h-4 w-4 origin-bottom-right rotate-[324deg] bg-pink-500" />
      <div className="absolute inset-0 h-full w-full backdrop-blur-sm" />
    </div>
  );
}

interface ColorSelectProps {
  allowAny?: boolean;
  className?: string;
  isCompact?: boolean;
  label: string;
  onChange: (val: ProjectThemeOptions | null) => void;
  value: ProjectThemeOptions | null;
}

function ColorSelect({
  allowAny = false,
  className,
  isCompact = false,
  label,
  onChange,
  value,
}: ColorSelectProps) {
  return (
    <Select
      isLoading={false}
      label={label}
      onChange={(val) => onChange(val as ProjectThemeOptions | null)}
      value={value ?? ""}
      placeholder="Select a theme color"
      trigger={
        <div
          className={cn(
            "flex items-center gap-2",
            isCompact ? "w-12" : "w-full",
            className
          )}
        >
          {value ? <ColorPreview theme={value} /> : <AnyColorPreview />}

          <div className={isCompact ? "sr-only" : ""}>
            <p className="text-left">{value}</p>
          </div>
        </div>
      }
    >
      <>
        {allowAny && (
          <SelectItem value={null}>
            <div className="flex items-center gap-2">
              <AnyColorPreview />
              <div>
                <p>Any</p>
              </div>
            </div>
          </SelectItem>
        )}
        {Object.keys(ProjectThemeColors).map((key) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <ColorPreview theme={key as ProjectThemeOptions} />
              <div>
                <p>{key}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </>
    </Select>
  );
}

export default ColorSelect;
