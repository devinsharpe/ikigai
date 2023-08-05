import * as RadixToggle from "@radix-ui/react-toggle";
import type { RefAttributes } from "react";
import { cn } from "~/lib/cn";

function Toggle({
  children,
  className,
  pressed,
  onPressedChange,
  ...props
}: RadixToggle.ToggleProps &
  RefAttributes<HTMLButtonElement> & {
    className?: string;
    children: JSX.Element;
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
  }) {
  return (
    <RadixToggle.Root
      {...props}
      pressed={pressed}
      onPressedChange={onPressedChange}
      className={cn(
        "rounded-lg p-2 transition-colors duration-150 hover:bg-zinc-100 data-[state=on]:bg-zinc-700 data-[state=on]:text-white data-[state=on]:hover:bg-zinc-800",
        className
      )}
    >
      {children}
    </RadixToggle.Root>
  );
}

export default Toggle;
