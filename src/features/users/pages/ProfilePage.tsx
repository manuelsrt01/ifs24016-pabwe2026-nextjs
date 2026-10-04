"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import {
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "@/helpers/toolsHelper";
import type { User } from "@/types";
import {
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "../states/action";
import Avatar from "../components/Avatar";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100";
const card = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";
const label =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700";
const button =
  "rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-60";

function ProfileForms({ profile }: { profile: User }) {
  const dispatch = useAppDispatch();
  const { isChangeProfile, isChangeProfilePhoto, isChangeProfilePassword } =
    useAppSelector((state) => state.users);

  const [name, onName] = useInput(profile.name);
  const [email, onEmail] = useInput(profile.email);
  const [password, onPassword, resetPassword] = useInput("");
  const [newPassword, onNewPassword, resetNewPassword] = useInput("");
  const [confirmation, onConfirmation, resetConfirmation] = useInput("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      showWarningDialog("Nama dan email wajib diisi.");
      return;
    }
    const result = await dispatch(
      asyncChangeProfile({ name: name.trim(), email: email.trim() }),
    );
    if (asyncChangeProfile.fulfilled.match(result))
      showSuccessDialog("Profil berhasil diperbarui.");
    else showErrorDialog(result.payload?.message ?? "Gagal memperbarui profil");
  };

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showWarningDialog("File harus berupa gambar.");
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhoto = async () => {
    if (!photoFile) {
      showWarningDialog("Pilih foto terlebih dahulu.");
      return;
    }
    const result = await dispatch(asyncChangeProfilePhoto(photoFile));
    if (asyncChangeProfilePhoto.fulfilled.match(result)) {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(null);
      setPhotoPreview(null);
      showSuccessDialog("Foto profil berhasil diperbarui.");
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal mengunggah foto");
    }
  };

  const handlePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || !newPassword) {
      showWarningDialog("Semua kolom kata sandi wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      showWarningDialog("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmation) {
      showWarningDialog("Konfirmasi kata sandi tidak sama.");
      return;
    }
    const result = await dispatch(
      asyncChangeProfilePassword({ password, newPassword, confirmation }),
    );
    if (asyncChangeProfilePassword.fulfilled.match(result)) {
      resetPassword();
      resetNewPassword();
      resetConfirmation();
      showSuccessDialog("Kata sandi berhasil diubah.");
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal mengubah kata sandi");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-extrabold">Profil Saya</h1>

      <section className={card}>
        <h2 className="font-bold">Foto Profil</h2>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Pratinjau foto"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <Avatar name={profile.name} photo={profile.photo} size={80} />
          )}
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              aria-label="Pilih foto profil"
              className="block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-slate-200"
            />
            <button
              onClick={handlePhoto}
              disabled={isChangeProfilePhoto}
              className={button}
            >
              {isChangeProfilePhoto ? "Mengunggah..." : "Simpan Foto"}
            </button>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-bold">Informasi Akun</h2>
        <form onSubmit={handleProfile} className="mt-4 space-y-4">
          <div>
            <label htmlFor="profile-name" className={label}>
              Nama
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={onName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className={label}>
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={onEmail}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={isChangeProfile} className={button}>
            {isChangeProfile ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </section>

      <section className={card}>
        <h2 className="font-bold">Ubah Kata Sandi</h2>
        <form onSubmit={handlePassword} className="mt-4 space-y-4">
          <div>
            <label htmlFor="old-password" className={label}>
              Kata Sandi Saat Ini
            </label>
            <input
              id="old-password"
              type="password"
              value={password}
              onChange={onPassword}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="new-password" className={label}>
              Kata Sandi Baru
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={onNewPassword}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className={label}>
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmation}
              onChange={onConfirmation}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={isChangeProfilePassword}
            className={button}
          >
            {isChangeProfilePassword ? "Memproses..." : "Ubah Kata Sandi"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const profile = useAppSelector((state) => state.users.profile);

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-extrabold">Profil Saya</h1>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return <ProfileForms profile={profile} />;
}
