import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

interface DropdownItemProps {
  children: JSX.Element;
}

export function DropdownItem({ children }: DropdownItemProps) {
  return (
    <RadixDropdown.Item
      className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-zinc-200 focus:outline-none"
      asChild
    >
      {children}
    </RadixDropdown.Item>
  );
}

interface DropdownProps {
  children: JSX.Element;
  trigger: JSX.Element;
}

function Dropdown({ children, trigger }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild className="focus:outline-none">
        {trigger}
      </RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content className="mr-4 min-w-[12rem] rounded-lg border bg-white p-2 shadow-lg animate-in fade-in">
          <>{children}</>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export default Dropdown;
