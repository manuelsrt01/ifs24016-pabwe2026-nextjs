"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { IconMail, IconLock, IconLogin2 } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { asyncAuthLogin } from "../states/action";
import AuthField from "../components/AuthField";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const [email, onEmail] = useInput("");
  const [password, onPassword] = useInput("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: { email?: string; password?: string } = {};
    if (!email.trim()) found.email = "Email wajib diisi";
    if (!password) found.password = "Kata sandi wajib diisi";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = await dispatch(
      asyncAuthLogin({ email: email.trim(), password }),
    );
    if (asyncAuthLogin.rejected.match(result)) {
      showErrorDialog(result.payload?.message ?? "Gagal login");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Masuk ke TanaPosts</h1>
      <p className="mt-2 text-sm text-slate-600">
        Selamat datang kembali! Masuk untuk melanjutkan.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <AuthField
          id="login-email-input"
          label="Alamat Email"
          icon={IconMail}
          type="text"
          placeholder="nama@email.com"
          value={email}
          onChange={onEmail}
          error={errors.email}
        />
        <AuthField
          id="login-password-input"
          label="Kata Sandi"
          icon={IconLock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={onPassword}
          error={errors.password}
        />
        <button
          id="login-submit-button"
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          <IconLogin2 size={18} />
          {loading ? "Memproses..." : "Masuk Sekarang"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-teal-800 hover:underline"
        >
          Daftar baru
        </Link>
      </p>
    </div>
  );
}
