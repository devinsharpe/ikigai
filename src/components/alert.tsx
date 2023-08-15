import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface AlertProps {
  title: string;
  description: string;
  actionText: string;
  cancelText: string;
  onAction: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function Alert({
  title,
  description,
  actionText,
  cancelText,
  onAction,
  onCancel,
  isOpen,
  onOpenChange,
}: AlertProps) {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[10] bg-zinc-900/25 animate-in fade-in" />
        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-[11] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-y-auto rounded-2xl border border-zinc-300 bg-white p-6 shadow-lg focus:outline-none">
          <AlertDialog.Title className="text-2xl font-bold tracking-wide text-zinc-800 md:text-4xl">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-zinc-600">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild onClick={onCancel}>
              <button className="flex items-center justify-center gap-2 rounded-md p-2 px-6 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onClick={onAction}>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-900">
                {actionText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default Alert;
