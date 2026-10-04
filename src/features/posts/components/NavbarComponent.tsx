"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconNotes,
  IconMenu2,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import { asyncAuthLogout } from "@/features/auth/states/action";
import Avatar from "@/features/users/components/Avatar";

export default function NavbarComponent({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.users.profile);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    if (
      await showConfirmDialog(
        "Kamu akan keluar dari TanaPosts.",
        "Keluar?",
        "Ya, keluar",
      )
    ) {
      dispatch(asyncAuthLogout());
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <IconMenu2 size={22} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <IconNotes size={26} className="text-teal-700" />
          <span className="text-lg font-extrabold">TanaPosts</span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          aria-label="Menu profil"
          className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100"
        >
          <Avatar name={profile?.name} photo={profile?.photo} size={36} />
          <span className="hidden max-w-40 truncate pr-2 text-sm font-semibold sm:block">
            {profile?.name}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="truncate text-sm font-bold">{profile?.name}</p>
              <p className="truncate text-xs text-slate-600">
                {profile?.email}
              </p>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              <IconUser size={18} /> Profil Saya
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <IconLogout size={18} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
