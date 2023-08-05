import * as Dialog from "@radix-ui/react-dialog";
import { Minimize2 } from "lucide-react";

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
        <Dialog.Overlay className="fixed inset-0 z-[10] bg-zinc-900/25 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[11] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-y-auto rounded-2xl border border-zinc-300 bg-white p-6 shadow-lg focus:outline-none">
          <div className="flex items-center justify-between gap-2">
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
          <Dialog.Close className="flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">
            <span>Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
