import { Disc3, Building, List, PlayCircle, Pause, Pencil } from "lucide-react";
import Dropdown, { DropdownItem, DropdownSeparator } from "../dropdown";
import { api } from "~/utils/api";
import { useOrganizationList } from "@clerk/nextjs";
import { useMemo } from "react";
import type { SimpleTimer } from "../forms";

export interface CurrentTimerDropdownProps {
  onEdit: (
    timer: SimpleTimer & {
      id: string;
      project: {
        name: string;
      };
    }
  ) => void;
  onStart: () => void;
  onStop: (id: string) => void;
  onOrgChangeRequest: (orgId: string) => void;
}

function CurrentTimerDropdown({
  onEdit,
  onStart,
  onStop,
  onOrgChangeRequest,
}: CurrentTimerDropdownProps) {
  const currentTimer = api.timers.current.useQuery();
  const { organizationList } = useOrganizationList();

  const currentTimerOrg = useMemo(() => {
    if (currentTimer.data) {
      if (currentTimer.data?.organization && organizationList) {
        const org = organizationList.filter(
          (o) => o.organization.id === currentTimer.data?.organization
        );
        if (org[0]) return org[0].organization;
      }
    }
    return null;
  }, [currentTimer, organizationList]);

  if (currentTimer.data)
    return (
      <Dropdown
        className="z-[2] ml-2 mt-2 md:ml-8"
        trigger={
          <button
            type="button"
            className="flex w-16 shrink-0 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
          >
            <Disc3 className="shrink-0 animate-spin text-zinc-600" />
          </button>
        }
      >
        <>
          <div className="p-2">
            <h5 className="font-semibold">{currentTimer.data.name}</h5>
            <p className="truncate text-sm text-zinc-600">
              {currentTimer.data.project.name} &ndash;
              <span className="italic">
                &nbsp;
                {currentTimerOrg ? currentTimerOrg.name : "Personal Workspace"}
              </span>
            </p>
          </div>
          <DropdownSeparator />
          <DropdownItem
            onClick={() => {
              if (currentTimer.data) onStop(currentTimer.data.id);
            }}
          >
            <>
              <Pause className="w-5" />
              <span>Stop Timer</span>
            </>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              if (currentTimer.data) onEdit(currentTimer.data);
            }}
          >
            <>
              <Pencil className="w-5" />
              <span>Edit Details</span>
            </>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem>
            <>
              <List className="w-5" />
              <span>View Project</span>
            </>
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              onOrgChangeRequest(currentTimerOrg ? currentTimerOrg.id : "")
            }
          >
            <>
              <Building className="w-5" />
              <span>View Organization</span>
            </>
          </DropdownItem>
        </>
      </Dropdown>
    );
  else
    return (
      <button
        type="button"
        className="flex w-16 shrink-0 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
        onClick={onStart}
      >
        <PlayCircle className="text-zinc-600" />
      </button>
    );
}

export default CurrentTimerDropdown;
