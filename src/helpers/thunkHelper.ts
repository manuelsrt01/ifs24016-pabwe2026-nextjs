import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiError, ApiResponse } from "@/types";
import { ApiRequestError } from "./apiHelper";

export const createApiThunk = <Data, Arg = void>(
  type: string,
  apiFn: (arg: Arg) => Promise<ApiResponse<Data>>,
) =>
  createAsyncThunk<Data | null, Arg, { rejectValue: ApiError }>(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        const response = await apiFn(arg);
        return response.data ?? null;
      } catch (error) {
        const failure = error as ApiRequestError;
        return rejectWithValue({
          message:
            failure instanceof Error ? failure.message : "Terjadi kesalahan",
          status: failure.status,
        });
      }
    },
  );
