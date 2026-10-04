import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import type { User } from "@/types";
import {
  asyncGetUsers,
  asyncGetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "./action";

type Flag =
  | "isChangeProfile"
  | "isChangeProfilePhoto"
  | "isChangeProfilePassword";

interface UsersState {
  users: User[];
  profile: User | null;
  isUsers: boolean;
  isProfile: boolean;
  isChangeProfile: boolean;
  isChangeProfilePhoto: boolean;
  isChangeProfilePassword: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  profile: null,
  isUsers: false,
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
  error: null,
};

const flags: Record<string, Flag> = {
  [asyncChangeProfile.typePrefix]: "isChangeProfile",
  [asyncChangeProfilePhoto.typePrefix]: "isChangeProfilePhoto",
  [asyncChangeProfilePassword.typePrefix]: "isChangeProfilePassword",
};

const mutationThunks = [
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
] as const;
const prefixOf = (type: string) => type.slice(0, type.lastIndexOf("/"));

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetUsers.pending, (state) => {
        state.isUsers = true;
        state.error = null;
      })
      .addCase(asyncGetUsers.fulfilled, (state, action) => {
        state.isUsers = false;
        state.users = action.payload?.users ?? [];
      })
      .addCase(asyncGetUsers.rejected, (state, action) => {
        state.isUsers = false;
        state.error = action.payload?.message ?? null;
      })
      .addCase(asyncGetProfile.pending, (state) => {
        state.isProfile = true;
      })
      .addCase(asyncGetProfile.fulfilled, (state, action) => {
        state.isProfile = false;
        state.profile = action.payload?.user ?? null;
      })
      .addCase(asyncGetProfile.rejected, (state) => {
        state.isProfile = false;
      })
      .addMatcher(isPending(...mutationThunks), (state, action) => {
        state[flags[prefixOf(action.type)]] = true;
      })
      .addMatcher(isFulfilled(...mutationThunks), (state, action) => {
        state[flags[prefixOf(action.type)]] = false;
        if (action.payload && "user" in action.payload)
          state.profile = action.payload.user;
      })
      .addMatcher(isRejected(...mutationThunks), (state, action) => {
        state[flags[prefixOf(action.type)]] = false;
      });
  },
});

export default usersSlice.reducer;
