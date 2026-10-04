import Swal from "sweetalert2";
import { DELCOM_BASEURL } from "@/lib/config";

export const showSuccessDialog = (message: string, title = "Berhasil") =>
  Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#0f766e",
  });

export const showErrorDialog = (message: string, title = "Terjadi Kesalahan") =>
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#0f766e",
  });

export const showWarningDialog = (message: string, title = "Perhatian") =>
  Swal.fire({
    icon: "warning",
    title,
    text: message,
    confirmButtonColor: "#0f766e",
  });

export const showConfirmDialog = async (
  message: string,
  title = "Apakah kamu yakin?",
  confirmText = "Ya, lanjutkan",
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: "#0f766e",
    cancelButtonColor: "#475569",
  });
  return result.isConfirmed;
};

export const formatDate = (value: string): string =>
  new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const resolveAssetUrl = (
  path: string | null | undefined,
): string | null => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${new URL(DELCOM_BASEURL).origin}/${path.replace(/^\//, "")}`;
};
