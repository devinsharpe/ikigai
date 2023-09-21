import React from "react";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { Dot, Check } from "lucide-react";
import { cn } from "~/lib/cn";

interface ContextMenuProps {
  children: JSX.Element;
  trigger: JSX.Element;
}

interface ContextMenuCheckboxProps {
  children: JSX.Element;
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ContextMenuCheckbox({
  children,
  className,
  checked,
  onCheckedChange,
}: ContextMenuCheckboxProps) {
  return (
    <RadixContextMenu.CheckboxItem
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 pl-8 text-sm font-medium hover:bg-zinc-100 focus:outline-none md:text-base",
        className
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <RadixContextMenu.ItemIndicator className="absolute left-4 inline-flex w-4 items-center justify-center">
        <Check />
      </RadixContextMenu.ItemIndicator>
      {children}
    </RadixContextMenu.CheckboxItem>
  );
}

export function ContextMenuItem({
  children,
  className,
  ...props
}: {
  children: JSX.Element;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <RadixContextMenu.Item
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 pl-10 text-sm font-medium hover:bg-zinc-100 focus:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:text-zinc-400 md:text-base",
        className
      )}
      {...props}
    >
      {children}
    </RadixContextMenu.Item>
  );
}

export function ContextMenuLabel({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  return (
    <RadixContextMenu.Label
      className={cn("leading-wide px-3 text-sm text-zinc-600", className)}
    >
      {text}
    </RadixContextMenu.Label>
  );
}

export function ContextMenuRadioItem({
  children,
  className,
  value,
}: {
  children: JSX.Element;
  className?: string;
  value: string;
}) {
  return (
    <RadixContextMenu.RadioItem
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 pl-8 text-sm font-medium hover:bg-zinc-100 focus:outline-none md:text-base",
        className
      )}
      value={value}
    >
      <RadixContextMenu.ItemIndicator className="absolute left-3 inline-flex w-6 items-center justify-center">
        <Dot />
      </RadixContextMenu.ItemIndicator>
      {children}
    </RadixContextMenu.RadioItem>
  );
}

export function ContextMenuRadioGroup({
  children,
  value,
  onValueChange,
}: {
  children: JSX.Element;
  value: string;
  onValueChange: (val: string) => void;
}) {
  return (
    <RadixContextMenu.RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </RadixContextMenu.RadioGroup>
  );
}

export function ContextMenuSeparator({ className }: { className?: string }) {
  return (
    <RadixContextMenu.Separator
      className={cn("m-1 h-[1px] bg-zinc-300", className)}
    />
  );
}

function ContextMenu({ children, trigger }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild className="select-none">
        {trigger}
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className="mr-4 flex min-w-[12rem] flex-col gap-1 rounded-lg border bg-white p-2 shadow-lg animate-in fade-in md:min-w-[16rem]">
          {children}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}

export default ContextMenu;
