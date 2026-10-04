import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import type { Post } from "@/types";
import {
  asyncGetPosts,
  asyncGetPost,
  asyncAddPost,
  asyncChangePost,
  asyncChangePostCover,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeleteAllPosts,
} from "./action";

interface PostsState {
  posts: Post[];
  post: Post | null;
  isPost: boolean;
  error: string | null;
  isPostAdd: boolean;
  isPostAdded: boolean;
  isPostChange: boolean;
  isPostChanged: boolean;
  isPostChangeCover: boolean;
  isPostChangedCover: boolean;
  isPostDelete: boolean;
  isPostDeleted: boolean;
  isPostLike: boolean;
  isPostLiked: boolean;
  isPostAddComment: boolean;
  isPostAddedComment: boolean;
  isPostDeleteComment: boolean;
  isPostDeletedComment: boolean;
  isPostDeleteAll: boolean;
  isPostDeletedAll: boolean;
}

type Flag = Exclude<keyof PostsState, "posts" | "post" | "error">;

const initialState: PostsState = {
  posts: [],
  post: null,
  isPost: false,
  error: null,
  isPostAdd: false,
  isPostAdded: false,
  isPostChange: false,
  isPostChanged: false,
  isPostChangeCover: false,
  isPostChangedCover: false,
  isPostDelete: false,
  isPostDeleted: false,
  isPostLike: false,
  isPostLiked: false,
  isPostAddComment: false,
  isPostAddedComment: false,
  isPostDeleteComment: false,
  isPostDeletedComment: false,
  isPostDeleteAll: false,
  isPostDeletedAll: false,
};

const flags: Record<string, [Flag, Flag]> = {
  [asyncAddPost.typePrefix]: ["isPostAdd", "isPostAdded"],
  [asyncChangePost.typePrefix]: ["isPostChange", "isPostChanged"],
  [asyncChangePostCover.typePrefix]: [
    "isPostChangeCover",
    "isPostChangedCover",
  ],
  [asyncDeletePost.typePrefix]: ["isPostDelete", "isPostDeleted"],
  [asyncLikePost.typePrefix]: ["isPostLike", "isPostLiked"],
  [asyncAddComment.typePrefix]: ["isPostAddComment", "isPostAddedComment"],
  [asyncDeleteComment.typePrefix]: [
    "isPostDeleteComment",
    "isPostDeletedComment",
  ],
  [asyncDeleteAllPosts.typePrefix]: ["isPostDeleteAll", "isPostDeletedAll"],
};

const mutationThunks = [
  asyncAddPost,
  asyncChangePost,
  asyncChangePostCover,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeleteAllPosts,
] as const;

const prefixOf = (type: string) => type.slice(0, type.lastIndexOf("/"));

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetPosts.pending, (state) => {
        state.isPost = true;
        state.error = null;
      })
      .addCase(asyncGetPosts.fulfilled, (state, action) => {
        state.isPost = false;
        state.posts = action.payload?.posts ?? [];
      })
      .addCase(asyncGetPosts.rejected, (state, action) => {
        state.isPost = false;
        state.error = action.payload?.message ?? null;
      })
      .addCase(asyncGetPost.pending, (state) => {
        state.isPost = true;
        state.error = null;
        state.post = null;
      })
      .addCase(asyncGetPost.fulfilled, (state, action) => {
        state.isPost = false;
        state.post = action.payload?.post ?? null;
      })
      .addCase(asyncGetPost.rejected, (state, action) => {
        state.isPost = false;
        state.error = action.payload?.message ?? null;
      })
      .addMatcher(isPending(...mutationThunks), (state, action) => {
        const [doing, done] = flags[prefixOf(action.type)];
        state[doing] = true;
        state[done] = false;
      })
      .addMatcher(isFulfilled(...mutationThunks), (state, action) => {
        const [doing, done] = flags[prefixOf(action.type)];
        state[doing] = false;
        state[done] = true;
      })
      .addMatcher(isRejected(...mutationThunks), (state, action) => {
        const [doing] = flags[prefixOf(action.type)];
        state[doing] = false;
      });
  },
});

export default postsSlice.reducer;
