import type { SimpleOrganization, SimpleUser } from "..";
import Select, { SelectItem } from "~/components/select";
import Image from "next/image";
import { useMemo } from "react";

function SelectOrganizationValue({ org }: { org?: SimpleOrganization }) {
  if (org)
    return (
      <div className="flex w-full items-center gap-2">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={org.imageUrl}
            width={128}
            height={128}
            alt={`${org.name} image`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-left">{org.name}</p>
          <p className="text-left text-xs text-zinc-600">{org.slug}</p>
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
          <p className="text-left">Select organization</p>
        </div>
      </div>
    );
}

const PersonalWorkspace = {
  id: "",
  imageUrl: "",
  membersCount: 1,
  name: "Personal Workspace",
  slug: "",
};

interface OrganizationSelectProps {
  label?: string;
  onChange: (val: string) => void;
  organizations: SimpleOrganization[];
  user: SimpleUser;
  value: string;
}

function OrganizationSelect({
  label = "Current Organizations",
  onChange,
  organizations,
  user,
  value,
}: OrganizationSelectProps) {
  const organization = useMemo(() => {
    return (
      organizations.filter((o) => o.id === value)[0] ?? {
        ...PersonalWorkspace,
        imageUrl: user.profileImageUrl,
        name: "Personal Workspace",
      }
    );
  }, [value, organizations, user]);

  return (
    <Select
      isLoading={false}
      label={label}
      onChange={(val) => onChange(val)}
      placeholder="Select an organization"
      trigger={<SelectOrganizationValue org={organization} />}
      value={value}
    >
      <>
        <SelectItem value={""}>
          <div className="flex w-full items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={user.profileImageUrl}
                width={128}
                height={128}
                alt={`${user.fullName} image`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p>{PersonalWorkspace.name}</p>
              <p className="text-xs text-zinc-600">{user.fullName}</p>
            </div>
          </div>
        </SelectItem>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            <div className="flex w-full items-center gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={org.imageUrl}
                  width={128}
                  height={128}
                  alt={`${org.name} image`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p>{org.name}</p>
                <p className="text-xs text-zinc-600">{org.slug}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </>
    </Select>
  );
}

export default OrganizationSelect;
