import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "~/lib/cn";

interface DropdownItemProps {
  children: JSX.Element;
  className?: string;
  onClick?: () => void;
}

export function DropdownItem({
  children,
  className,
  onClick,
}: DropdownItemProps) {
  return (
    <RadixDropdown.Item
      className={cn(
        "flex w-full cursor-pointer items-center gap-2  rounded p-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none md:text-base",
        className
      )}
      onClick={onClick}
    >
      {children}
    </RadixDropdown.Item>
  );
}

export function DropdownSeparator({ className }: { className?: string }) {
  return (
    <RadixDropdown.Separator
      className={cn("m-1 h-[1px] bg-zinc-300", className)}
    />
  );
}

interface DropdownProps {
  className?: string;
  children: JSX.Element;
  trigger: JSX.Element;
}

function Dropdown({ children, className, trigger }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild className="focus:outline-none">
        {trigger}
      </RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          className={cn(
            "mr-4 flex min-w-[14rem] flex-col gap-1 rounded-lg border bg-white p-2 shadow-lg animate-in fade-in md:min-w-[16rem]",
            className
          )}
        >
          <>{children}</>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export default Dropdown;
