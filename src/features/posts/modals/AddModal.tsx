"use client";

import ModalShell from "./ModalShell";
import DescriptionForm from "./DescriptionForm";

interface AddModalProps {
  loading: boolean;
  onSubmit: (description: string) => void;
  onClose: () => void;
}

export default function AddModal({
  loading,
  onSubmit,
  onClose,
}: AddModalProps) {
  return (
    <ModalShell title="Tambah Postingan" onClose={onClose}>
      <DescriptionForm
        loading={loading}
        submitLabel="Publikasikan"
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
}
