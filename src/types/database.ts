import { User, Post, Comment, UserRole } from '@prisma/client';

// Re-export Prisma types
export type { User, Post, Comment, UserRole };

// Enhanced types with relationships
export interface UserWithPosts extends User {
  posts: Post[];
}

export interface UserWithComments extends User {
  comments: Comment[];
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface PostWithRelations extends Post {
  author: User;
  comments: CommentWithAuthor[];
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface CommentWithPost extends Comment {
  post: Post;
}

// Create/Update types
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  age?: number;
  avatar?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  slug: string;
  published?: boolean;
  publishedAt?: Date | null;
  tags?: string[];
  authorId: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  slug?: string;
  published?: boolean;
  publishedAt?: Date | null;
  tags?: string[];
}

export interface CreateCommentData {
  content: string;
  authorId: string;
  postId: string;
}

export interface UpdateCommentData {
  content?: string;
}

// Query options
export interface UserQueryOptions {
  includePosts?: boolean;
  includeComments?: boolean;
  isActive?: boolean;
}

export interface PostQueryOptions {
  includeAuthor?: boolean;
  includeComments?: boolean;
  published?: boolean;
  authorId?: string;
  tags?: string[];
}

export interface CommentQueryOptions {
  includeAuthor?: boolean;
  includePost?: boolean;
  postId?: string;
  authorId?: string;
}
