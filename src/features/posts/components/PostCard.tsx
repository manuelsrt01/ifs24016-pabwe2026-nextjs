import Link from "next/link";
import {
  IconHeart,
  IconMessageCircle,
  IconPhotoOff,
} from "@tabler/icons-react";
import type { Post } from "@/types";
import { formatDate, resolveAssetUrl } from "@/helpers/toolsHelper";
import Avatar from "@/features/users/components/Avatar";

export default function PostCard({ post }: { post: Post }) {
  const cover = resolveAssetUrl(post.cover);

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex aspect-video items-center justify-center bg-slate-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`Cover postingan ${post.author?.name ?? ""}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconPhotoOff size={36} className="text-slate-600" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Avatar
            name={post.author?.name}
            photo={post.author?.photo}
            size={28}
          />
          <span className="truncate font-semibold">{post.author?.name}</span>
        </div>
        <p className="line-clamp-3 text-sm text-slate-700 group-hover:text-slate-900">
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
          <span>{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <IconHeart size={14} /> {post.likes.length}
            </span>
            <span className="flex items-center gap-1">
              <IconMessageCircle size={14} /> {post.comments.length}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
