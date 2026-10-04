import type { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalShell({
  title,
  onClose,
  children,
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <IconX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
