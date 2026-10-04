"use client";

import { useState } from "react";
import { resolveAssetUrl } from "@/helpers/toolsHelper";

interface AvatarProps {
  name?: string | null;
  photo?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({
  name,
  photo,
  size = 40,
  className = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveAssetUrl(photo);
  const style = { width: size, height: size };

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={style}
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ ...style, fontSize: size / 2.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white ${className}`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}
