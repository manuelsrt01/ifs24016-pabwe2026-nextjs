"use client";

import type { Post } from "@/types";
import ModalShell from "./ModalShell";
import DescriptionForm from "./DescriptionForm";

interface ChangeModalProps {
  post: Post;
  loading: boolean;
  onSubmit: (description: string) => void;
  onClose: () => void;
}

export default function ChangeModal({
  post,
  loading,
  onSubmit,
  onClose,
}: ChangeModalProps) {
  return (
    <ModalShell title="Ubah Postingan" onClose={onClose}>
      <DescriptionForm
        initial={post.description}
        loading={loading}
        submitLabel="Simpan Perubahan"
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
}
