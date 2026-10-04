import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { asyncAuthLogin, asyncAuthRegister, asyncAuthLogout } from "./action";

interface AuthState {
  isAuthChecked: boolean;
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthChecked: false,
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authHydrated(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = true;
      state.isAuthLogin = action.payload;
    },
    resetAuthStatus(state) {
      state.isAuthRegister = false;
      state.isAuthLogout = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncAuthLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncAuthLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthLogin = true;
        state.isAuthLogout = false;
        state.user = action.payload?.user ?? null;
      })
      .addCase(asyncAuthLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? null;
      })
      .addCase(asyncAuthRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthRegister = false;
      })
      .addCase(asyncAuthRegister.fulfilled, (state) => {
        state.loading = false;
        state.isAuthRegister = true;
      })
      .addCase(asyncAuthRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? null;
      })
      .addCase(asyncAuthLogout.fulfilled, (state) => {
        state.isAuthLogin = false;
        state.isAuthLogout = true;
        state.user = null;
      });
  },
});

export const { authHydrated, resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
