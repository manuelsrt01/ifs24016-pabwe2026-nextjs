import { createApiThunk } from "@/helpers/thunkHelper";
import type { User } from "@/types";
import type { PasswordInput, ProfileInput } from "@/types/action";
import {
  getUsers,
  getProfile,
  putProfile,
  postProfilePhoto,
  putPassword,
} from "../api/userApi";

export const asyncGetUsers = createApiThunk<{ users: User[] }>(
  "users/getAll",
  () => getUsers(),
);

export const asyncGetProfile = createApiThunk<{ user: User }>(
  "users/getProfile",
  () => getProfile(),
);

export const asyncChangeProfile = createApiThunk<{ user: User }, ProfileInput>(
  "users/changeProfile",
  (body) => putProfile(body),
);

export const asyncChangeProfilePhoto = createApiThunk<{ user: User }, File>(
  "users/changePhoto",
  async (file) => {
    await postProfilePhoto(file);
    return getProfile();
  },
);

export const asyncChangeProfilePassword = createApiThunk<null, PasswordInput>(
  "users/changePassword",
  (body) => putPassword(body),
);
