export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ProfileInput {
  name: string;
  email: string;
}

export interface PasswordInput {
  password: string;
  newPassword: string;
  confirmation: string;
}

export interface PostsQuery {
  isMe?: boolean;
}

export interface PostInput {
  description: string;
}

export interface PostChangeInput {
  id: number;
  description: string;
}

export interface PostCoverInput {
  id: number;
  file: File;
}

export interface PostLikeInput {
  id: number;
  like: 0 | 1;
}

export interface PostCommentInput {
  id: number;
  comment: string;
}
