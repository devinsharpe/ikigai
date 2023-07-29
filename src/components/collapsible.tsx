import React from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { FoldVertical, UnfoldVertical } from 'lucide-react';
import { cn } from '~/lib/cn';

export function CollapsibleActionButton(props: RadixCollapsible.PrimitiveButtonProps) {
  return (<button className={cn("p-2 rounded-lg hover:bg-zinc-100 flex items-center justify-center", props.className)} {...props} />)
}

interface CollapsibleItemProps {
  key: string;
  children: JSX.Element;
  className?: string;
}

export function CollapsibleItem({ key, children, ...props }: CollapsibleItemProps) {
  return <div className={cn("p-3 flex items-center gap-2 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-100 cursor-pointer animate-in fade-in", props.className)} key={key} >
    {children}
  </div>
}

interface CollapsibleProps {
  actions?: JSX.Element[];
  className?: string;
  elements: JSX.Element[];
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  previewCount?: number;
  title: string;
}

function Collapsible({ actions, elements, isOpen, onOpenChange, previewCount = 1, title, ...props }: CollapsibleProps) {
  return (
    <RadixCollapsible.Root className={cn("flex flex-col gap-2", props.className)} open={isOpen} onOpenChange={onOpenChange}>
      <div className="font-bold tracking-wide text-2xl text-zinc-800 flex items-center justify-between gap-2 px-2">
        <h3>{title}</h3>
        <div className="flex items-center gap-2">
          {
            actions &&
            (
              <>
                {actions.map((action) => action)}
              </>
            )
          }
          <RadixCollapsible.Trigger asChild>
            <CollapsibleActionButton className="p-2 rounded-lg hover:bg-zinc-100">{isOpen ? <FoldVertical /> : <UnfoldVertical />}</CollapsibleActionButton>
          </RadixCollapsible.Trigger>
        </div>
      </div>

      {
        elements.length && (
          <>
            {
              elements.slice(0, previewCount).map((el) => el)
            }
            <RadixCollapsible.Content className="flex flex-col gap-2">
              {
                elements.slice(previewCount).map((el) => el)
              }
            </RadixCollapsible.Content>
          </>
        )
      }
    </RadixCollapsible.Root >
  );
};

export default Collapsible;
