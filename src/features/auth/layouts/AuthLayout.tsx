"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconNotes } from "@tabler/icons-react";
import { useAppSelector } from "@/hooks/redux";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthLogin = useAppSelector((state) => state.auth.isAuthLogin);

  useEffect(() => {
    if (isAuthLogin) router.replace("/");
  }, [isAuthLogin, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-linear-to-br from-teal-700 to-emerald-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <IconNotes size={32} />
          <span className="text-2xl font-extrabold">TanaPosts</span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Bagikan cerita, kumpulkan apresiasi.
          </h2>
          <p className="mt-4 max-w-md text-teal-50">
            Tulis postingan, unggah cover, beri like, dan berdiskusi lewat
            komentar bersama pengguna lain.
          </p>
        </div>
        <p className="text-sm text-teal-50">© TanaPosts</p>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <IconNotes size={28} className="text-teal-700" />
            <span className="text-xl font-extrabold">TanaPosts</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
