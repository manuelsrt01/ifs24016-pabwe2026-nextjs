import { apiPost } from "@/helpers/apiHelper";
import type { User } from "@/types";
import type { LoginInput, RegisterInput } from "@/types/action";

export interface LoginData {
  user: User;
  token: string;
}

export const postLogin = ({ email, password }: LoginInput) =>
  apiPost<LoginData>("/auth/login", { email, password });

export const postRegister = ({ name, email, password }: RegisterInput) =>
  apiPost("/auth/register", { name, email, password });

export const postLogout = () => apiPost("/auth/logout");
