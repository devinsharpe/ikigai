import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { FoldVertical, Loader2, UnfoldVertical } from "lucide-react";
import { cn } from "~/lib/cn";
import AppIcon from "./appIcon";

export function EmptyCollapsibleItem(props: Record<string, unknown>) {
  return (
    <CollapsibleItem
      className="cursor-default items-baseline justify-center"
      {...props}
    >
      <>
        <p className="italic">Nothing to show here</p>
        <AppIcon className="h-2 w-2 text-zinc-600" />
        <AppIcon className="h-3 w-3 text-zinc-400" />
        <AppIcon className="h-4 w-4 text-zinc-200" />
      </>
    </CollapsibleItem>
  );
}

export function CollapsibleActionButton(
  props: RadixCollapsible.PrimitiveButtonProps
) {
  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100",
        props.className
      )}
      {...props}
    />
  );
}

export function LoadingCollapsibleItem(props: Record<string, unknown>) {
  return (
    <div
      className={cn(
        "flex animate-pulse items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white p-3"
      )}
      {...props}
    >
      <div className="h-6 w-1/2 rounded bg-zinc-200" />
      <div className="h-7 w-7 rounded bg-zinc-200" />
    </div>
  );
}

interface CollapsibleItemProps {
  children: JSX.Element;
  className?: string;
}

export function CollapsibleItem({ children, ...props }: CollapsibleItemProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white p-3 animate-in fade-in hover:bg-zinc-100",
        props.className
      )}
    >
      {children}
    </div>
  );
}

interface CollapsibleProps {
  actions?: JSX.Element[];
  className?: string;
  elements: JSX.Element[];
  isLoading?: boolean;
  isQuietLoading?: boolean;
  isOpen: boolean;
  EmptyElement?: React.FC;
  LoadingElement?: React.FC;
  onOpenChange: (val: boolean) => void;
  previewCount?: number;
  showCollapseButton?: boolean;
  title: string;
}

function Collapsible({
  actions,
  elements,
  isLoading = false,
  isQuietLoading = false,
  isOpen,
  EmptyElement = EmptyCollapsibleItem,
  LoadingElement = LoadingCollapsibleItem,
  onOpenChange,
  previewCount = 1,
  showCollapseButton = true,
  title,
  ...props
}: CollapsibleProps) {
  return (
    <RadixCollapsible.Root
      className="flex flex-col gap-2"
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex items-center justify-between gap-2 px-2 text-2xl font-bold tracking-wide text-zinc-800">
        <h3 className="flex items-center gap-2">
          <span>{title}</span>
          {(isLoading || isQuietLoading) && (
            <Loader2 className="animate-spin text-zinc-500" />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {actions && <>{actions.map((action) => action)}</>}
          {showCollapseButton && (
            <RadixCollapsible.Trigger
              asChild
              disabled={elements.length <= previewCount || isLoading}
            >
              <CollapsibleActionButton className="rounded-lg p-2 hover:bg-zinc-100">
                {isOpen ? <FoldVertical /> : <UnfoldVertical />}
              </CollapsibleActionButton>
            </RadixCollapsible.Trigger>
          )}
        </div>
      </div>

      <div className={cn("flex flex-col gap-2", props.className)}>
        {!isLoading && elements.length ? (
          <>
            {elements
              .filter((el) => !!el)
              .slice(0, previewCount)
              .map((el) => el)}
            <RadixCollapsible.Content
              className={cn(
                "col-span-full flex flex-col gap-2",
                props.className
              )}
            >
              {elements
                .filter((el) => !!el)
                .slice(previewCount).map((el) => el)}
            </RadixCollapsible.Content>
          </>
        ) : (
          <></>
        )}

        {!isLoading && elements.length === 0 ? <EmptyElement /> : <></>}

        {isLoading ? (
          <>
            {[...Array(previewCount).keys()].map((key) => (
              <LoadingElement key={key} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </RadixCollapsible.Root>
  );
}

export default Collapsible;
