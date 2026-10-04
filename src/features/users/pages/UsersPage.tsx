"use client";

import { useEffect, useMemo } from "react";
import {
  IconSearch,
  IconAlertTriangle,
  IconRefresh,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { formatDate } from "@/helpers/toolsHelper";
import { asyncGetUsers } from "../states/action";
import Avatar from "../components/Avatar";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, isUsers, error } = useAppSelector((state) => state.users);
  const [search, onSearch] = useInput("");

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const visible = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword),
    );
  }, [users, search]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Daftar Pengguna</h1>
          <p className="text-sm text-slate-600">
            {users.length} pengguna terdaftar di sistem.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <IconSearch
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            value={search}
            onChange={onSearch}
            placeholder="Cari nama atau email..."
            aria-label="Cari pengguna"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="flex items-center gap-2">
            <IconAlertTriangle size={18} /> {error}
          </span>
          <button
            onClick={() => dispatch(asyncGetUsers())}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            <IconRefresh size={16} /> Coba lagi
          </button>
        </div>
      )}

      {isUsers ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : visible.length === 0 && !error ? (
        <p className="mt-10 text-center text-slate-600">
          Tidak ada pengguna yang cocok.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <Avatar name={user.name} photo={user.photo} size={52} />
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="truncate text-sm text-slate-600">{user.email}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Bergabung {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
