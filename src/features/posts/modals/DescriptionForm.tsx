"use client";

import { useState, type FormEvent } from "react";
import useInput from "@/hooks/useInput";

interface DescriptionFormProps {
  initial?: string;
  loading: boolean;
  submitLabel: string;
  onSubmit: (description: string) => void;
  onCancel: () => void;
}

export default function DescriptionForm({
  initial = "",
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: DescriptionFormProps) {
  const [description, onDescription] = useInput(initial);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      setError("Deskripsi wajib diisi");
      return;
    }
    setError("");
    onSubmit(description.trim());
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="post-description"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700"
        >
          Deskripsi
        </label>
        <textarea
          id="post-description"
          rows={5}
          value={description}
          onChange={onDescription}
          placeholder="Apa yang ingin kamu bagikan?"
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-hidden focus:ring-4 ${
            error
              ? "border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
          }`}
        />
        {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
