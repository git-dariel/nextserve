import { UserRole } from '@prisma/client';

// API Constants
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  POSTS: {
    BASE: '/api/posts',
    BY_ID: (id: string) => `/api/posts/${id}`,
    BY_SLUG: (slug: string) => `/api/posts/slug/${slug}`,
  },
  COMMENTS: {
    BASE: '/api/comments',
    BY_ID: (id: string) => `/api/comments/${id}`,
    BY_POST: (postId: string) => `/api/comments/post/${postId}`,
  },
  HEALTH: '/api/health',
} as const;

// App Constants
export const APP_CONFIG = {
  NAME: 'Next.js Template',
  DESCRIPTION:
    'A production-ready Next.js template with TypeScript, MongoDB, and Prisma',
  VERSION: '1.0.0',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Authentication
export const AUTH = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  SESSION_DURATION: '7d',
  BCRYPT_ROUNDS: 12,
} as const;

// User Roles
export const USER_ROLES = {
  USER: UserRole.USER,
  ADMIN: UserRole.ADMIN,
  MODERATOR: UserRole.MODERATOR,
} as const;

// Role Permissions
export const ROLE_PERMISSIONS = {
  [UserRole.USER]: [
    { resource: 'posts', action: 'read' },
    { resource: 'posts', action: 'create' },
    { resource: 'posts', action: 'update' },
    { resource: 'comments', action: 'create' },
    { resource: 'comments', action: 'read' },
    { resource: 'comments', action: 'update' },
    { resource: 'users', action: 'read' },
  ],
  [UserRole.MODERATOR]: [
    { resource: 'posts', action: 'read' },
    { resource: 'posts', action: 'create' },
    { resource: 'posts', action: 'update' },
    { resource: 'comments', action: 'create' },
    { resource: 'comments', action: 'read' },
    { resource: 'comments', action: 'update' },
    { resource: 'comments', action: 'delete' },
    { resource: 'users', action: 'read' },
  ],
  [UserRole.ADMIN]: [
    { resource: 'posts', action: 'create' },
    { resource: 'posts', action: 'read' },
    { resource: 'posts', action: 'update' },
    { resource: 'posts', action: 'delete' },
    { resource: 'comments', action: 'create' },
    { resource: 'comments', action: 'read' },
    { resource: 'comments', action: 'update' },
    { resource: 'comments', action: 'delete' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
  ],
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again',
  INVALID_TOKEN: 'Invalid authentication token',

  // Validation
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

  // Database
  USER_NOT_FOUND: 'User not found',
  POST_NOT_FOUND: 'Post not found',
  COMMENT_NOT_FOUND: 'Comment not found',
  EMAIL_ALREADY_EXISTS: 'A user with this email already exists',
  SLUG_ALREADY_EXISTS: 'A post with this slug already exists',

  // Server
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later',
  DATABASE_ERROR: 'Database connection error',
  VALIDATION_ERROR: 'Validation failed',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  COMMENT_CREATED: 'Comment created successfully',
  COMMENT_UPDATED: 'Comment updated successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  UPLOAD_PATH: '/uploads',
} as const;

// Environment
export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
} as const;
