import { apiDelete, apiGet, apiPost, apiPut } from "@/helpers/apiHelper";
import type { Post } from "@/types";
import type {
  PostChangeInput,
  PostCommentInput,
  PostCoverInput,
  PostInput,
  PostLikeInput,
  PostsQuery,
} from "@/types/action";

export const getPosts = (query?: PostsQuery) =>
  apiGet<{ posts: Post[] }>("/posts", { is_me: query?.isMe ? 1 : undefined });

export const getPost = (id: number) => apiGet<{ post: Post }>(`/posts/${id}`);

export const postPost = ({ description }: PostInput) =>
  apiPost<{ post_id: number }>("/posts", { description });

export const putPost = ({ id, description }: PostChangeInput) =>
  apiPut(`/posts/${id}`, { description });

export const postPostCover = ({ id, file }: PostCoverInput) => {
  const formData = new FormData();
  formData.append("cover", file);
  return apiPost(`/posts/${id}/cover`, formData);
};

export const deletePost = (id: number) => apiDelete(`/posts/${id}`);

export const postPostLike = ({ id, like }: PostLikeInput) =>
  apiPost(`/posts/${id}/likes`, { like });

export const postPostComment = ({ id, comment }: PostCommentInput) =>
  apiPost(`/posts/${id}/comments`, { comment });

export const deletePostComment = (id: number) =>
  apiDelete(`/posts/${id}/comments`);

export const deleteAllPosts = () => apiDelete("/posts");
