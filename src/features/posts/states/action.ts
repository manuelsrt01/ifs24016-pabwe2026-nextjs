import { createApiThunk } from "@/helpers/thunkHelper";
import type { Post } from "@/types";
import type {
  PostChangeInput,
  PostCommentInput,
  PostCoverInput,
  PostInput,
  PostLikeInput,
  PostsQuery,
} from "@/types/action";
import {
  getPosts,
  getPost,
  postPost,
  putPost,
  postPostCover,
  deletePost,
  postPostLike,
  postPostComment,
  deletePostComment,
  deleteAllPosts,
} from "../api/postApi";

export const asyncGetPosts = createApiThunk<
  { posts: Post[] },
  PostsQuery | undefined
>("posts/getAll", (query) => getPosts(query));

export const asyncGetPost = createApiThunk<{ post: Post }, number>(
  "posts/getOne",
  (id) => getPost(id),
);

export const asyncAddPost = createApiThunk<{ post_id: number }, PostInput>(
  "posts/add",
  (body) => postPost(body),
);

export const asyncChangePost = createApiThunk<null, PostChangeInput>(
  "posts/change",
  (body) => putPost(body),
);

export const asyncChangePostCover = createApiThunk<null, PostCoverInput>(
  "posts/changeCover",
  (body) => postPostCover(body),
);

export const asyncDeletePost = createApiThunk<null, number>(
  "posts/delete",
  (id) => deletePost(id),
);

export const asyncLikePost = createApiThunk<null, PostLikeInput>(
  "posts/like",
  (body) => postPostLike(body),
);

export const asyncAddComment = createApiThunk<null, PostCommentInput>(
  "posts/addComment",
  (body) => postPostComment(body),
);

export const asyncDeleteComment = createApiThunk<null, number>(
  "posts/deleteComment",
  (id) => deletePostComment(id),
);

export const asyncDeleteAllPosts = createApiThunk<null>("posts/deleteAll", () =>
  deleteAllPosts(),
);
