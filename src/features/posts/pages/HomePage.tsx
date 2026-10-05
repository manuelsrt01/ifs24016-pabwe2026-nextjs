"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconPlus,
  IconSearch,
  IconAlertTriangle,
  IconRefresh,
  IconInbox,
  IconTrash,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import {
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "@/helpers/toolsHelper";
import {
  asyncAddPost,
  asyncDeleteAllPosts,
  asyncGetPosts,
} from "../states/action";
import PostCard from "../components/PostCard";

const AddModal = dynamic(() => import("../modals/AddModal"));

export default function HomePage({
  initialTab = "all",
}: {
  initialTab?: "all" | "me";
}) {
  const dispatch = useAppDispatch();
  const { posts, isPost, error, isPostAdd, isPostDeleteAll } = useAppSelector(
    (state) => state.posts,
  );
  const [tab, setTab] = useState<"all" | "me">(initialTab);
  const [showAdd, setShowAdd] = useState(false);
  const [search, onSearch] = useInput("");

  const loadPosts = useCallback(
    () => dispatch(asyncGetPosts(tab === "me" ? { isMe: true } : undefined)),
    [dispatch, tab],
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const visible = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter(
      (post) =>
        post.description.toLowerCase().includes(keyword) ||
        (post.author?.name ?? "").toLowerCase().includes(keyword),
    );
  }, [posts, search]);

  const handleAdd = async (description: string) => {
    const result = await dispatch(asyncAddPost({ description }));
    if (asyncAddPost.fulfilled.match(result)) {
      setShowAdd(false);
      await showSuccessDialog("Postingan berhasil dipublikasikan.");
      loadPosts();
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal menambah postingan");
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = await showConfirmDialog(
      "Semua postingan milikmu beserta cover, like, dan komentarnya akan dihapus permanen.",
      "Hapus semua postingan?",
      "Ya, hapus semua",
    );
    if (!confirmed) return;
    const result = await dispatch(asyncDeleteAllPosts());
    if (asyncDeleteAllPosts.fulfilled.match(result)) {
      await showSuccessDialog("Semua postingan berhasil dihapus.");
      loadPosts();
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal menghapus postingan");
    }
  };

  const tabClass = (active: boolean) =>
    `rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
      active
        ? "bg-white text-teal-800 shadow-sm"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Linimasa TanaPosts</h1>
          <p className="text-sm text-slate-600">
            Lihat apa yang sedang dibagikan pengguna lain.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
        >
          <IconPlus size={18} /> Tambah Postingan
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <IconSearch
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            value={search}
            onChange={onSearch}
            placeholder="Cari postingan atau penulis..."
            aria-label="Cari postingan"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        <div
          role="group"
          aria-label="Filter postingan"
          className="inline-flex rounded-xl bg-slate-100 p-1"
        >
          <button
            onClick={() => setTab("all")}
            aria-pressed={tab === "all"}
            className={tabClass(tab === "all")}
          >
            Semua
          </button>
          <button
            onClick={() => setTab("me")}
            aria-pressed={tab === "me"}
            className={tabClass(tab === "me")}
          >
            Postingan Saya
          </button>
        </div>
        {tab === "me" && posts.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={isPostDeleteAll}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            <IconTrash size={16} /> Hapus Semua
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="flex items-center gap-2">
            <IconAlertTriangle size={18} /> {error}
          </span>
          <button
            onClick={loadPosts}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            <IconRefresh size={16} /> Coba lagi
          </button>
        </div>
      )}

      {isPost ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : visible.length === 0 && !error ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-400 py-16 text-slate-600">
          <IconInbox size={40} />
          <p className="font-semibold">Belum ada postingan</p>
          <p className="text-sm">
            Coba ubah pencarian atau tambahkan postingan baru.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddModal
          loading={isPostAdd}
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
