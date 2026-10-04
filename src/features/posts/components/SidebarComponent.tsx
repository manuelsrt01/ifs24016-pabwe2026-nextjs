"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  IconNews,
  IconUserCircle,
  IconUsers,
  IconUser,
} from "@tabler/icons-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function SidebarComponent({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const tab = useSearchParams().get("tab");

  const menus = [
    {
      href: "/",
      label: "Semua Postingan",
      icon: IconNews,
      active: pathname === "/" && tab !== "me",
    },
    {
      href: "/?tab=me",
      label: "Postingan Saya",
      icon: IconUserCircle,
      active: pathname === "/" && tab === "me",
    },
    {
      href: "/users",
      label: "Daftar Pengguna",
      icon: IconUsers,
      active: pathname === "/users",
    },
    {
      href: "/profile",
      label: "Profil Saya",
      icon: IconUser,
      active: pathname === "/profile",
    },
  ];

  return (
    <>
      {open && (
        <div
          data-testid="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white pt-16 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1 p-4">
          {menus.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
