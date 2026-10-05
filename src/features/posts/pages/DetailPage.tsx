"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCamera,
  IconEdit,
  IconTrash,
  IconHeart,
  IconHeartFilled,
  IconPhotoOff,
  IconAlertTriangle,
  IconSend,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import {
  formatDate,
  resolveAssetUrl,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "@/helpers/toolsHelper";
import type { PostComment } from "@/types";
import Avatar from "@/features/users/components/Avatar";
import {
  asyncGetPost,
  asyncChangePost,
  asyncChangePostCover,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
} from "../states/action";

const ChangeModal = dynamic(() => import("../modals/ChangeModal"));
const ChangeCoverModal = dynamic(() => import("../modals/ChangeCoverModal"));

export default function DetailPage() {
  const params = useParams<{ postId: string }>();
  const postId = Number(params.postId);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    post,
    isPost,
    error,
    isPostChange,
    isPostChangeCover,
    isPostLike,
    isPostAddComment,
    isPostDeleteComment,
  } = useAppSelector((state) => state.posts);
  const profile = useAppSelector((state) => state.users.profile);
  const [editing, setEditing] = useState(false);
  const [changingCover, setChangingCover] = useState(false);
  const [comment, onComment, resetComment] = useInput("");

  useEffect(() => {
    dispatch(asyncGetPost(postId));
  }, [dispatch, postId]);

  const reload = () => dispatch(asyncGetPost(postId));

  const back = (
    <Link
      href="/"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-teal-800"
    >
      <IconArrowLeft size={16} /> Kembali
    </Link>
  );

  if (isPost) {
    return (
      <div className="mx-auto max-w-3xl">
        {back}
        <h1 className="sr-only">Memuat detail postingan</h1>
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl">
        {back}
        <h1 className="mb-3 text-2xl font-extrabold">Detail Postingan</h1>
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <IconAlertTriangle size={18} />{" "}
          {error || "Postingan tidak ditemukan."}
        </div>
      </div>
    );
  }

  const isOwner = Boolean(profile && post.user_id === profile.id);
  const liked = Boolean(profile && post.likes.includes(profile.id));
  const comments = post.comments.filter(
    (item): item is PostComment => typeof item === "object",
  );
  const cover = resolveAssetUrl(post.cover);

  const handleLike = async () => {
    const result = await dispatch(
      asyncLikePost({ id: post.id, like: liked ? 0 : 1 }),
    );
    if (asyncLikePost.fulfilled.match(result)) reload();
    else showErrorDialog(result.payload?.message ?? "Gagal mengubah like");
  };

  const handleComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) {
      showWarningDialog("Komentar tidak boleh kosong.");
      return;
    }
    const result = await dispatch(
      asyncAddComment({ id: post.id, comment: comment.trim() }),
    );
    if (asyncAddComment.fulfilled.match(result)) {
      resetComment();
      reload();
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal mengirim komentar");
    }
  };

  const handleDeleteComment = async () => {
    if (
      !(await showConfirmDialog(
        "Komentarmu akan dihapus.",
        "Hapus komentar?",
        "Ya, hapus",
      ))
    )
      return;
    const result = await dispatch(asyncDeleteComment(post.id));
    if (asyncDeleteComment.fulfilled.match(result)) reload();
    else showErrorDialog(result.payload?.message ?? "Gagal menghapus komentar");
  };

  const handleChange = async (description: string) => {
    const result = await dispatch(
      asyncChangePost({ id: post.id, description }),
    );
    if (asyncChangePost.fulfilled.match(result)) {
      setEditing(false);
      await showSuccessDialog("Postingan berhasil diperbarui.");
      reload();
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal memperbarui postingan");
    }
  };

  const handleCover = async (file: File) => {
    const result = await dispatch(asyncChangePostCover({ id: post.id, file }));
    if (asyncChangePostCover.fulfilled.match(result)) {
      setChangingCover(false);
      await showSuccessDialog("Cover berhasil diperbarui.");
      reload();
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal mengunggah cover");
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog(
      "Postingan yang dihapus tidak dapat dikembalikan.",
      "Hapus postingan?",
      "Ya, hapus",
    );
    if (!confirmed) return;
    const result = await dispatch(asyncDeletePost(post.id));
    if (asyncDeletePost.fulfilled.match(result)) {
      await showSuccessDialog("Postingan berhasil dihapus.");
      router.push("/");
    } else {
      showErrorDialog(result.payload?.message ?? "Gagal menghapus postingan");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {back}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex max-h-[420px] min-h-48 items-center justify-center bg-slate-100">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`Cover postingan ${post.author?.name ?? ""}`}
              className="max-h-[420px] w-full object-contain"
            />
          ) : (
            <IconPhotoOff size={48} className="text-slate-600" />
          )}
        </div>

        <div className="space-y-5 p-6">
          <h1 className="sr-only">Detail postingan {post.author?.name}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Avatar
              name={post.author?.name}
              photo={post.author?.photo}
              size={40}
            />
            <div>
              <p className="font-semibold text-slate-900">
                {post.author?.name}
              </p>
              <p>{formatDate(post.created_at)}</p>
            </div>
          </div>

          <p className="whitespace-pre-line text-lg text-slate-800">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={handleLike}
              disabled={isPostLike}
              aria-pressed={liked}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
                liked
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-slate-300 hover:bg-slate-50"
              }`}
            >
              {liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
              {post.likes.length} Suka
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setChangingCover(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  <IconCamera size={18} /> Ubah Cover
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  <IconEdit size={18} /> Ubah Postingan
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  <IconTrash size={18} /> Hapus
                </button>
              </>
            )}
          </div>
        </div>
      </article>

      <section
        aria-label="Komentar"
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-bold">Komentar ({comments.length})</h2>

        <form onSubmit={handleComment} className="mt-4 flex gap-2">
          <input
            value={comment}
            onChange={onComment}
            placeholder="Tulis komentar..."
            aria-label="Tulis komentar"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
          <button
            type="submit"
            disabled={isPostAddComment}
            className="flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            <IconSend size={16} /> Kirim
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="mt-6 text-sm text-slate-600">Belum ada komentar.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {comments.map((item) => {
              const mine = post.my_comment?.id === item.id;
              return (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800">{item.comment}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {mine ? "Komentar kamu · " : ""}
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  {mine && (
                    <button
                      onClick={handleDeleteComment}
                      disabled={isPostDeleteComment}
                      aria-label="Hapus komentar saya"
                      className="rounded-lg p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {editing && (
        <ChangeModal
          post={post}
          loading={isPostChange}
          onSubmit={handleChange}
          onClose={() => setEditing(false)}
        />
      )}
      {changingCover && (
        <ChangeCoverModal
          post={post}
          loading={isPostChangeCover}
          onSubmit={handleCover}
          onClose={() => setChangingCover(false)}
        />
      )}
    </div>
  );
}
