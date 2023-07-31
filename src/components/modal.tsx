import * as Dialog from "@radix-ui/react-dialog";
import { Minimize2 } from "lucide-react";

interface ModalProps {
  children: JSX.Element;
  description?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}

function Modal({ children, isOpen, onOpenChange, title, ...props }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[10] bg-zinc-900/25 animate-in fade-in" />
        <Dialog.Content className="fixed z-[11] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] w-[90vw] max-w-[450px] rounded-2xl shadow-lg focus:outline-none p-6 bg-white border border-zinc-300 flex flex-col gap-4">
          <div className="flex items-center gap-2 justify-between">
            <Dialog.Title className="font-bold tracking-wide text-2xl md:text-4xl text-zinc-800">
              {title}
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600">
              <Minimize2 />
            </Dialog.Close>
          </div>
          {
            props.description && (
              <Dialog.Description className="text-zinc-600">
                {props.description}
              </Dialog.Description>
            )
          }
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal;
