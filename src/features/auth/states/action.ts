import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "@/helpers/thunkHelper";
import { putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import type { LoginInput, RegisterInput } from "@/types/action";
import { postLogin, postRegister, postLogout, LoginData } from "../api/authApi";

export const asyncAuthLogin = createApiThunk<LoginData, LoginInput>(
  "auth/login",
  async (body) => {
    const response = await postLogin(body);
    if (response.data) putAccessToken(response.data.token);
    return response;
  },
);

export const asyncAuthRegister = createApiThunk<null, RegisterInput>(
  "auth/register",
  (body) => postRegister(body),
);

export const asyncAuthLogout = createAsyncThunk("auth/logout", async () => {
  try {
    await postLogout();
  } catch {
    // Token mungkin sudah kedaluwarsa; sesi lokal tetap dibersihkan.
  } finally {
    removeAccessToken();
  }
  return true;
});
