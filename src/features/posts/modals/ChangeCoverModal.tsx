"use client";

import { useState, type ChangeEvent } from "react";
import { IconUpload } from "@tabler/icons-react";
import type { Post } from "@/types";
import { resolveAssetUrl, showWarningDialog } from "@/helpers/toolsHelper";
import ModalShell from "./ModalShell";

interface ChangeCoverModalProps {
  post: Post;
  loading: boolean;
  onSubmit: (file: File) => void;
  onClose: () => void;
}

export default function ChangeCoverModal({
  post,
  loading,
  onSubmit,
  onClose,
}: ChangeCoverModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      showWarningDialog("File harus berupa gambar.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!file) {
      showWarningDialog("Pilih gambar terlebih dahulu.");
      return;
    }
    onSubmit(file);
  };

  const current = preview || resolveAssetUrl(post.cover);

  return (
    <ModalShell title="Ubah Cover" onClose={onClose}>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt="Pratinjau cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-sm text-slate-600">Belum ada cover</p>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        aria-label="Pilih gambar cover"
        className="mt-4 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-slate-200"
      />
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          <IconUpload size={18} /> {loading ? "Mengunggah..." : "Unggah Cover"}
        </button>
      </div>
    </ModalShell>
  );
}
