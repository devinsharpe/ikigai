import * as Dialog from "@radix-ui/react-dialog";
import { Minimize2 } from "lucide-react";
import { cn } from "~/lib/cn";

interface ModalProps {
  children: JSX.Element;
  description?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}

function Modal({
  children,
  isOpen,
  onOpenChange,
  title,
  ...props
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[10] bg-zinc-900/25 backdrop-blur-md duration-300",
            "data-[state=open]:animate-in data-[state=open]:fade-in",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out"
          )}
        />
        <Dialog.Content
          className={cn(
            "group fixed bottom-0 z-[11] mx-auto max-h-[85vh] w-[100vw] max-w-[450px] focus:outline-none md:inset-0 md:m-auto",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-24",
            "data-[state=closed]:slide-out-top-bottom-24 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-90"
          )}
        >
          <div
            className={cn(
              "flex max-h-[85vh] w-[100vw] max-w-[450px] flex-col gap-4 overflow-y-auto rounded-t-2xl border border-zinc-300 bg-white p-6 shadow-lg duration-300 ease-in-out md:rounded-2xl md:rounded-t-2xl"
            )}
          >
            <div className="flex items-center justify-between gap-2 ">
              <Dialog.Title className="text-2xl font-bold tracking-wide text-zinc-800 md:text-4xl">
                {title}
              </Dialog.Title>
              <Dialog.Close className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100">
                <Minimize2 />
              </Dialog.Close>
            </div>
            {props.description && (
              <Dialog.Description className="text-zinc-600">
                {props.description}
              </Dialog.Description>
            )}
            {children}
            <div className="flex w-full justify-center">
              <Dialog.Close className="flex items-center justify-center gap-2 rounded-md px-6 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">
                <span>Close</span>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
