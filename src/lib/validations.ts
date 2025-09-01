import { z } from 'zod';
import { UserRole } from '@prisma/client';

// User validation schemas
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z
    .number()
    .int()
    .min(13, 'Age must be at least 13')
    .max(120, 'Age must be less than 120')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  age: z
    .number()
    .int()
    .min(13, 'Age must be at least 13')
    .max(120, 'Age must be less than 120')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

// Post validation schemas
export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
  tags: z.array(z.string()).default([]),
  authorId: z.string().optional(), // Optional since it's set from authenticated user
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .optional(),
  published: z.boolean().optional(),
  publishedAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  authorId: z.string().optional(), // Optional since it's set from authenticated user
  postId: z.string().min(1, 'Post ID is required'),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
    age: z
      .number()
      .int()
      .min(13, 'Age must be at least 13')
      .max(120, 'Age must be less than 120')
      .optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(10),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const userQuerySchema = paginationSchema.extend({
  ...searchSchema.shape,
  isActive: z.boolean().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const postQuerySchema = paginationSchema.extend({
  ...searchSchema.shape,
  published: z.boolean().optional(),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const commentQuerySchema = paginationSchema.extend({
  ...searchSchema.shape,
  postId: z.string().optional(),
  authorId: z.string().optional(),
});

// ID validation schema
export const idSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Type inference for validation schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
export type CommentQueryInput = z.infer<typeof commentQuerySchema>;
export type IdInput = z.infer<typeof idSchema>;
