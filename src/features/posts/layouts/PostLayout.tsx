"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetProfile } from "@/features/users/states/action";
import { asyncAuthLogout } from "@/features/auth/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthLogin, isAuthChecked } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthChecked && !isAuthLogin) router.replace("/auth/login");
  }, [isAuthChecked, isAuthLogin, router]);

  useEffect(() => {
    if (!isAuthLogin) return;
    dispatch(asyncGetProfile()).then((result) => {
      if (
        asyncGetProfile.rejected.match(result) &&
        result.payload?.status === 401
      ) {
        dispatch(asyncAuthLogout());
      }
    });
  }, [isAuthLogin, dispatch]);

  if (!isAuthChecked || !isAuthLogin) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center text-sm text-slate-600"
      >
        <h1 className="sr-only">TanaPosts</h1>
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent onMenuClick={() => setSidebarOpen(true)} />
      <Suspense fallback={null}>
        <SidebarComponent
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>
      <main className="px-4 pb-10 pt-24 sm:px-8 lg:pl-72">{children}</main>
    </div>
  );
}
