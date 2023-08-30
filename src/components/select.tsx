import React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2,
} from "lucide-react";
import { cn } from "~/lib/cn";

interface SelectLabelProps {
  children: JSX.Element | string;
}

export function SelectLabel({ children }: SelectLabelProps) {
  return (
    <Select.Label className="py-1 pl-2 text-sm text-zinc-600">
      {children}
    </Select.Label>
  );
}

export function SelectSeparator() {
  return <Select.Separator className="m-1 h-[1px] bg-zinc-300" />;
}

interface SelectProps {
  children: JSX.Element | string;
  isLoading: boolean;
  label: string;
  onChange: (val: string) => void;
  placeholder: string;
  trigger: JSX.Element | string;
  value: string;
}

function SelectDemo({
  children,
  isLoading,
  label,
  onChange,
  placeholder,
  trigger,
  value,
}: SelectProps) {
  return (
    <Select.Root onValueChange={onChange} value={value}>
      <Select.Trigger
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 p-3 text-zinc-800 focus:outline-none"
        aria-label={label}
        disabled={isLoading}
      >
        <Select.Value placeholder={placeholder}>{trigger}</Select.Value>
        <Select.Icon className="text-zinc-500">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ChevronDownIcon />
          )}
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-[15] ml-8 flex min-w-[8rem] flex-col gap-1 rounded-lg border bg-white p-2 shadow-lg animate-in fade-in md:min-w-[12rem]">
          <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white text-zinc-600">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {children}
            {/* <Select.Group>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </Select.Group>

            <SelectSeparator />

            <Select.Group>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="aubergine">Aubergine</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="carrot" disabled>
                Carrot
              </SelectItem>
              <SelectItem value="courgette">Courgette</SelectItem>
              <SelectItem value="leek">Leek</SelectItem>
            </Select.Group>

            <SelectSeparator />

            <Select.Group>
              <SelectLabel>Meat</SelectLabel>
              <SelectItem value="beef">Beef</SelectItem>
              <SelectItem value="chicken">Chicken</SelectItem>
              <SelectItem value="lamb">Lamb</SelectItem>
              <SelectItem value="pork">Pork</SelectItem>
            </Select.Group> */}
          </Select.Viewport>
          <Select.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  {
    children: JSX.Element | string;
    className?: string;
    value: string;
    [key: string]: unknown;
  }
>(function ({ children, className, value, ...props }, forwardedRef) {
  return (
    <Select.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded p-2 pl-8 leading-none text-zinc-800 hover:bg-zinc-100 data-[disabled]:text-zinc-400 data-[highlighted]:outline-none",
        className
      )}
      value={value}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText className="flex items-center">
        {children}
      </Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex w-5 items-center justify-center text-zinc-600">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = "SelectItem";

export default SelectDemo;
