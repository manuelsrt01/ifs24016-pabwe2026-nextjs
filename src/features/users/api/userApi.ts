import { apiGet, apiPost, apiPut } from "@/helpers/apiHelper";
import type { User } from "@/types";
import type { PasswordInput, ProfileInput } from "@/types/action";

export const getUsers = () => apiGet<{ users: User[] }>("/users");

export const getProfile = () => apiGet<{ user: User }>("/users/me");

export const putProfile = ({ name, email }: ProfileInput) =>
  apiPut<{ user: User }>("/users/me", { name, email });

export const postProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return apiPost("/users/me/photo", formData);
};

export const putPassword = ({
  password,
  newPassword,
  confirmation,
}: PasswordInput) =>
  apiPut("/users/password", {
    password,
    new_password: newPassword,
    new_password_confirmation: confirmation,
  });
