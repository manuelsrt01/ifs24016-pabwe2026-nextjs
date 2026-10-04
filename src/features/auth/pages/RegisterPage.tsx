"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconUser,
  IconMail,
  IconLock,
  IconUserPlus,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { asyncAuthRegister } from "../states/action";
import { resetAuthStatus } from "../states/reducer";
import AuthField from "../components/AuthField";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, isAuthRegister } = useAppSelector((state) => state.auth);
  const [name, onName] = useInput("");
  const [email, onEmail] = useInput("");
  const [password, onPassword] = useInput("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(resetAuthStatus());
      showSuccessDialog("Akun berhasil dibuat. Silakan masuk.").then(() =>
        router.push("/auth/login"),
      );
    }
  }, [isAuthRegister, dispatch, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: RegisterErrors = {};
    if (!name.trim()) found.name = "Nama wajib diisi";
    if (!email.trim()) found.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      found.email = "Format email tidak valid";
    if (password.length < 6) found.password = "Kata sandi minimal 6 karakter";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = await dispatch(
      asyncAuthRegister({ name: name.trim(), email: email.trim(), password }),
    );
    if (asyncAuthRegister.rejected.match(result)) {
      showErrorDialog(result.payload?.message ?? "Gagal mendaftar");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Buat akun TanaPosts</h1>
      <p className="mt-2 text-sm text-slate-600">
        Daftar gratis dan mulai berbagi postingan.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <AuthField
          id="register-name-input"
          label="Nama Lengkap"
          icon={IconUser}
          type="text"
          placeholder="Nama kamu"
          value={name}
          onChange={onName}
          error={errors.name}
        />
        <AuthField
          id="register-email-input"
          label="Alamat Email"
          icon={IconMail}
          type="text"
          placeholder="nama@email.com"
          value={email}
          onChange={onEmail}
          error={errors.email}
        />
        <AuthField
          id="register-password-input"
          label="Kata Sandi"
          icon={IconLock}
          type="password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={onPassword}
          error={errors.password}
        />
        <button
          id="register-submit-button"
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          <IconUserPlus size={18} />
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-teal-800 hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
